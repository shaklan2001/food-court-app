import { StepIndicator } from "@/src/components/StepIndicator";
import { Text, View } from "@/src/components/ui";
import { betterwayApiCall } from "@/src/network/useApiPort";
import { RootState, useAppSelector } from "@/src/store/store";
import theme from "@/src/theme/theme";
import { showToast } from "@/src/utils";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../cart";

type MealType = "breakfast" | "lunch" | "dinner";

type RawSlot = {
  slotId?: string;
  id?: string;
  time?: string;
  endTime?: string;
  availableSeats?: number;
  maxSeats?: number;
  isBookable?: boolean;
};

type NormalizedSlot = {
  slotId: string;
  time: string;
  endTime: string;
  availableSeats: number;
  maxSeats: number;
  isBookable: boolean;
  displayTime: string;
  displayRange: string;
  meal: MealType;
  sortTimestamp: number;
};

type SlotsByMeal = Record<MealType, NormalizedSlot[]>;

const defaultSlotsState: SlotsByMeal = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

const mealOrder: MealType[] = ["breakfast", "lunch", "dinner"];

const formatTimeLabel = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getMealType = (dateString: string): MealType => {
  const date = new Date(dateString);
  const hour = date.getHours();
  if (hour < 12) return "breakfast";
  if (hour < 17) return "lunch";
  return "dinner";
};

const OrderLater = () => {
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");
  const [slotsByMeal, setSlotsByMeal] =
    useState<SlotsByMeal>(defaultSlotsState);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useAppSelector((state: RootState) => state.auth);

  const selectedSlot = useMemo(() => {
    const slots = slotsByMeal[selectedMeal] ?? [];
    return slots.find((slot) => slot.slotId === selectedSlotId) || null;
  }, [slotsByMeal, selectedMeal, selectedSlotId]);

  const handleMealSelection = (meal: MealType) => {
    setSelectedMeal(meal);
  };

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    setErrorMessage("");
    try {
      const today = new Date();
      const queryDate = today.toISOString().split("T")[0];
      const response = await betterwayApiCall({
        method: "GET",
        url: "GET_DINEIN_SLOTS",
        auth: token ?? undefined,
        query: {
          date: queryDate,
        },
      });

      const payload = response?.data ?? response;
      const rawSlots: RawSlot[] = Array.isArray(payload?.slots)
        ? payload.slots
        : [];

      const normalized: NormalizedSlot[] = rawSlots
        .filter((slot) => slot?.time && slot?.endTime)
        .map((slot) => {
          const slotId = slot.slotId ?? slot.id ?? slot.time ?? "";
          const time = slot.time as string;
          const endTime = slot.endTime as string;
          const meal = getMealType(time);
          const displayStart = formatTimeLabel(time);
          const displayEnd = formatTimeLabel(endTime);
          const availableSeats = Number(
            slot.availableSeats ?? slot.maxSeats ?? 0,
          );
          const maxSeats = Number(slot.maxSeats ?? slot.availableSeats ?? 0);

          return {
            slotId: String(slotId),
            time,
            endTime,
            availableSeats: Number.isNaN(availableSeats) ? 0 : availableSeats,
            maxSeats: Number.isNaN(maxSeats) ? 0 : maxSeats,
            isBookable: slot.isBookable !== false,
            displayTime: displayStart,
            displayRange: `${displayStart} - ${displayEnd}`,
            meal,
            sortTimestamp: new Date(time).getTime(),
          };
        })
        .sort((a, b) => a.sortTimestamp - b.sortTimestamp);

      const grouped: SlotsByMeal = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      normalized.forEach((slot) => {
        grouped[slot.meal].push(slot);
      });

      setSlotsByMeal(grouped);
    } catch (error) {
      const message =
        (error as { message?: string })?.message || "Unable to load slots";
      setErrorMessage(message);
    } finally {
      setLoadingSlots(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    const slots = slotsByMeal[selectedMeal];
    if (!slots.length) {
      const fallbackMeal = mealOrder.find(
        (meal) => slotsByMeal[meal].length > 0,
      );
      if (fallbackMeal && fallbackMeal !== selectedMeal) {
        setSelectedMeal(fallbackMeal);
      }
      setSelectedSlotId(null);
      return;
    }

    if (!slots.some((slot) => slot.slotId === selectedSlotId)) {
      const fallbackSlot = slots.find((slot) => slot.isBookable) ?? slots[0];
      setSelectedSlotId(fallbackSlot?.slotId ?? null);
    }
  }, [slotsByMeal, selectedMeal, selectedSlotId]);

  const handleNext = () => {
    if (!selectedSlot) {
      showToast({
        message: "Please select a slot to continue",
        type: "error",
      });
      return;
    }

    router.push({
      pathname: "/(tabs)/order-later/select-menu",
      params: {
        slotId: selectedSlot.slotId,
        slotTime: selectedSlot.time,
        slotLabel: selectedSlot.displayRange,
        availableSeats: String(
          selectedSlot.availableSeats ?? selectedSlot.maxSeats ?? 0,
        ),
      },
    });
  };

  const currentSlots = slotsByMeal[selectedMeal] ?? [];
  const showEmptyState = !loadingSlots && currentSlots.length === 0;

  const mealButtons = (
    <View style={styles.mealButtonGroup}>
      {mealOrder.map((meal) => (
        <TouchableOpacity
          key={meal}
          onPress={() => handleMealSelection(meal)}
          disabled={(slotsByMeal[meal] ?? []).length === 0 && !loadingSlots}
          style={[
            styles.mealButton,
            selectedMeal === meal && styles.mealButtonActive,
            (slotsByMeal[meal] ?? []).length === 0 && styles.mealButtonDisabled,
          ]}
        >
          <Text
            fontSize={14}
            fontFamily="SF Pro"
            style={{
              color: selectedMeal === meal ? "white" : theme.colors.textPrimary,
              opacity:
                (slotsByMeal[meal] ?? []).length === 0 && !loadingSlots
                  ? 0.5
                  : 1,
            }}
          >
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
      <ScreenHeader title="Order Later" />
      <View paddingHorizontal="l">
        <StepIndicator currentStep={1} totalSteps={3} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        >
        <View paddingHorizontal="l" gap="l">
          <View gap="m">
            <View flexDirection="row" gap="xs" alignItems="center">
              <View
                width={4}
                height={21}
                backgroundColor="primary"
                borderRadius="xs"
              />
              <Text
                fontSize={20}
                fontWeight="600"
                fontFamily="Poppins-SemiBold"
                color="textPrimary"
              >
                Select Time
              </Text>
            </View>
            {mealButtons}
            {loadingSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.primary} />
                <Text fontSize={12} color="textSecondary" marginTop="s">
                  Loading slots...
                </Text>
              </View>
            ) : showEmptyState ? (
              <View style={styles.emptyContainer}>
                <Text fontSize={14} color="textSecondary" textAlign="center">
                  No slots available for the selected date.
                </Text>
              </View>
            ) : (
              <View style={styles.timeGrid}>
                {currentSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.slotId;
                  return (
                    <TouchableOpacity
                      key={slot.slotId}
                      disabled={!slot.isBookable}
                      onPress={() => setSelectedSlotId(slot.slotId)}
                      style={[
                        styles.timeSlot,
                        !slot.isBookable && styles.timeSlotDisabled,
                        isSelected && slot.isBookable && styles.timeSlotActive,
                      ]}
                    >
                      <Text
                        fontSize={14}
                        fontFamily="Poppins-Medium"
                        style={{
                          color: !slot.isBookable
                            ? theme.colors.textSecondary
                            : isSelected
                            ? theme.colors.mainBackground
                            : theme.colors.primary,
                        }}
                      >
                        {slot.displayTime}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {!!errorMessage && (
              <View
                style={{
                  backgroundColor: "rgba(162, 5, 56, 0.08)",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Text fontSize={12} color="danger" textAlign="center">
                  {errorMessage}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View paddingHorizontal="l" paddingBottom="m">
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedSlot || loadingSlots) && { opacity: 0.5 },
          ]}
          onPress={handleNext}
          disabled={!selectedSlot || loadingSlots}
        >
          <Text fontSize={16} fontFamily="SF Pro" color="textOnPrimary">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mealButtonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  mealButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(1, 1, 1, 0.15)",
    backgroundColor: theme.colors.mainBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  mealButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  mealButtonDisabled: {
    opacity: 0.5,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  timeSlot: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.mainBackground,
    marginRight: 10,
    marginBottom: 10,
  },
  timeSlotDisabled: {
    borderColor: "rgba(1, 1, 1, 0.1)",
    backgroundColor: theme.colors.mainBackground,
    opacity: 0.6,
    fontSize: 14,
  },
  timeSlotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.mainBackground,
    borderRadius: 12,
  },
});

export default OrderLater;
