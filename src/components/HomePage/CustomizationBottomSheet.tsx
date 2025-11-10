import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { addToCart } from "@/src/store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/src/store/store";
import theme from "@/src/theme/theme";
import { showToast } from "@/src/utils";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";

import {
  AddonGroup,
  AddonItem,
  VariationOption,
} from "@/src/types/customization";
import Checkbox from "../shared/Checkbox";
import { Text, View } from "../ui";

const FOOTER_HEIGHT = 120;
const TAB_BAR_HEIGHT = 70;

type CustomizableFoodItem = {
  id: string;
  title: string;
  description?: string;
  image: ImageSourcePropType;
  pricePaise: number;
  basePricePaise?: number;
  addons: AddonGroup[];
  variations: VariationOption[];
};

interface CustomizationBottomSheetProps {
  visible: boolean;
  item: CustomizableFoodItem;
  onClose: () => void;
  bottomOffset?: number;
}

const CustomizationBottomSheetComponent = ({
  visible,
  item,
  onClose,
  bottomOffset = TAB_BAR_HEIGHT,
}: CustomizationBottomSheetProps) => {
  const { id, title, description = "", image, addons, variations } = item;
  const basePrice = item.basePricePaise ?? item.pricePaise ?? 0;
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["65%", "90%"], []);
  const bottomInset = useMemo(
    () => insets.bottom + bottomOffset,
    [insets.bottom, bottomOffset],
  );

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [loadingImage, setLoadingImage] = useState(true);
  const [selectedVariation, setSelectedVariation] =
    useState<VariationOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<
    Map<string, AddonItem[]>
  >(new Map());

  const selectedAddonIds = useMemo(() => {
    const ids: string[] = [];
    selectedAddons.forEach((items) => {
      items.forEach((addon) => {
        ids.push(String(addon.id));
      });
    });
    return ids.sort();
  }, [selectedAddons]);

  useEffect(() => {
    if (visible) {
      setQuantity(1);
      const defaultVariation = variations[0] ?? null;
      setSelectedVariation(defaultVariation ?? null);
      setSelectedAddons(new Map());
      setLoadingImage(true);
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, variations]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  const grouping = useMemo(() => {
    if (!variations || variations.length === 0) {
      return [] as { groupName: string; options: VariationOption[] }[];
    }
    const map = new Map<string, VariationOption[]>();
    variations.forEach((option) => {
      const groupName = option.groupName || "Choose an option";
      const existing = map.get(groupName) || [];
      existing.push(option);
      map.set(groupName, existing);
    });
    return Array.from(map.entries()).map(([groupName, options]) => ({
      groupName,
      options,
    }));
  }, [variations]);

  const toggleAddon = useCallback(
    (groupId: string, addon: AddonItem, group: AddonGroup) => {
      setSelectedAddons((prev) => {
        const next = new Map(prev);
        const selected = next.get(groupId) || [];

        const alreadySelected = selected.some((item) => item.id === addon.id);

        if (group.maxSelection === 1) {
          if (alreadySelected) {
            next.delete(groupId);
          } else {
            next.set(groupId, [addon]);
          }
          return next;
        }

        if (alreadySelected) {
          const filtered = selected.filter((item) => item.id !== addon.id);
          if (filtered.length === 0) {
            next.delete(groupId);
          } else {
            next.set(groupId, filtered);
          }
          return next;
        }

        if (group.maxSelection > 0 && selected.length >= group.maxSelection) {
          showToast({
            message: `You can select up to ${group.maxSelection} options for ${group.name}`,
            type: "info",
          });
          return prev;
        }

        next.set(groupId, [...selected, addon]);
        return next;
      });
    },
    [],
  );

  const totalPricePaise = useMemo(() => {
    let price = basePrice;

    if (grouping.length > 0 && selectedVariation) {
      price = selectedVariation.pricePaise;
    }

    selectedAddons.forEach((items) => {
      price += items.reduce((sum, addon) => sum + (addon.pricePaise || 0), 0);
    });

    return price;
  }, [basePrice, grouping.length, selectedVariation, selectedAddons]);

  const handleQuantityChange = useCallback(
    (type: "increment" | "decrement") => {
      setQuantity((prev) => {
        if (type === "decrement") {
          return Math.max(1, prev - 1);
        }
        return prev + 1;
      });
    },
    [],
  );

  const validateSelections = useCallback(() => {
    for (const group of addons) {
      const selected = selectedAddons.get(group.id) || [];
      if (group.minSelection > 0 && selected.length < group.minSelection) {
        return `Select at least ${group.minSelection} option${
          group.minSelection > 1 ? "s" : ""
        } for ${group.name}`;
      }
      if (group.maxSelection > 0 && selected.length > group.maxSelection) {
        return `Select up to ${group.maxSelection} options for ${group.name}`;
      }
    }

    if (grouping.length > 0 && !selectedVariation) {
      return "Please choose a variation to continue";
    }

    return null;
  }, [addons, grouping.length, selectedAddons, selectedVariation]);

  const handleAddToCart = useCallback(async () => {
    if (!token) {
      showToast({ message: "Please login to add items to cart", type: "info" });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const validationError = validateSelections();
    if (validationError) {
      showToast({ message: validationError, type: "error" });
      return;
    }

    try {
      let imageSource: ImageSourcePropType = image;
      if (!imageSource) {
        imageSource = require("@/assets/images/bowl.png");
      }

      const variationId = selectedVariation?.id ?? null;
      const addonsIdsPayload =
        selectedAddonIds.length > 0 ? selectedAddonIds : undefined;

      const itemPayload = {
        id,
        dishId: id,
        name: title,
        price: `₹${(totalPricePaise / 100).toFixed(2)}`,
        pricePaise: totalPricePaise,
        image: imageSource,
        description,
        selectedVariationId: variationId,
        selectedAddonIds: addonsIdsPayload,
        quantity,
      };

      await dispatch(addToCart(itemPayload, token));

      showToast({ message: "Added to cart successfully", type: "success" });
      onClose();
    } catch {
      showToast({ message: "Failed to add to cart", type: "error" });
    }
  }, [
    token,
    validateSelections,
    dispatch,
    id,
    title,
    totalPricePaise,
    image,
    description,
    quantity,
    onClose,
    selectedVariation,
    selectedAddonIds,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      bottomInset={bottomInset}
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 16) + FOOTER_HEIGHT + Math.max(bottomOffset - TAB_BAR_HEIGHT, 0) },
        ]}
      >
        <View paddingHorizontal={pageHorizantalPadding}>
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            marginBottom="m"
          >
            <View flex={1} marginRight="m">
              <Text
                fontSize={20}
                fontWeight="700"
                color="textPrimary"
                fontFamily="Poppins-Bold"
                marginBottom="xs"
              >
                {title}
              </Text>
              <Text
                fontSize={16}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
              >
                ₹{(totalPricePaise / 100).toFixed(2)}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons
                name="close"
                size={22}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          </View>

          <View
            height={140}
            borderRadius="m"
            overflow="hidden"
            marginBottom="l"
            backgroundColor="mainBackgroundLight"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              source={image}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setLoadingImage(false)}
            />
            {loadingImage && (
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={StyleSheet.absoluteFillObject}
              />
            )}
          </View>

          {grouping.map(({ groupName, options }) => (
            <View key={groupName} marginBottom="l">
              <Text
                fontSize={18}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                marginBottom="s"
              >
                {groupName}
              </Text>
              {options.map((option) => {
                const isSelected = selectedVariation?.id === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setSelectedVariation(option)}
                  >
                    <View
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingVertical="s"
                    >
                      <View flex={1} marginRight="m">
                        <Text
                          fontSize={16}
                          color="textPrimary"
                          fontFamily="Poppins-Regular"
                        >
                          {option.name}
                        </Text>
                      </View>
                      <Checkbox
                        label=""
                        checked={isSelected}
                        onToggle={() => setSelectedVariation(option)}
                      />
                      <Text
                        fontSize={14}
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        marginLeft="s"
                      >
                        ₹{(option.pricePaise / 100).toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}

          {addons.map((group) => {
            const selected = selectedAddons.get(group.id) || [];
            return (
              <View key={group.id} marginBottom="l">
                <Text
                  fontSize={18}
                  fontWeight="600"
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                  marginBottom="xs"
                >
                  {group.name}
                </Text>
                <Text
                  fontSize={13}
                  color="textSecondary"
                  fontFamily="Poppins-Regular"
                  marginBottom="s"
                >
                  {group.minSelection > 0
                    ? `Select ${group.minSelection} - ${
                        group.maxSelection === 0
                          ? group.items.length
                          : group.maxSelection
                      }`
                    : group.maxSelection > 0
                      ? `Optional - choose up to ${group.maxSelection}`
                      : "Optional"}
                </Text>
                {group.items.map((addon) => {
                  const isChecked = selected.some(
                    (item) => item.id === addon.id,
                  );
                  return (
                    <Pressable
                      key={addon.id}
                      onPress={() => toggleAddon(group.id, addon, group)}
                    >
                      <View
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        paddingVertical="s"
                      >
                        <View flex={1} marginRight="m">
                          <Text
                            fontSize={16}
                            color="textPrimary"
                            fontFamily="Poppins-Regular"
                          >
                            {addon.name}
                          </Text>
                        </View>
                        <Checkbox
                          label=""
                          checked={isChecked}
                          onToggle={() => toggleAddon(group.id, addon, group)}
                        />
                        {addon.pricePaise > 0 && (
                          <Text
                            fontSize={14}
                            color="textSecondary"
                            fontFamily="Poppins-Regular"
                            marginLeft="s"
                          >
                            + ₹{(addon.pricePaise / 100).toFixed(2)}
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}

          {description ? (
            <View marginBottom="l">
              <Text
                fontSize={16}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                marginBottom="s"
              >
                Description
              </Text>
              <Text
                fontSize={14}
                color="textSecondary"
                fontFamily="Poppins-Regular"
                lineHeight={20}
              >
                {description}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          paddingHorizontal={pageHorizantalPadding}
          paddingVertical="m"
          borderTopWidth={StyleSheet.hairlineWidth}
          borderTopColor="border"
          backgroundColor="mainBackground"
        >
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="m"
          >
            <View flexDirection="row" alignItems="center">
              <Pressable
                style={styles.quantityButton}
                onPress={() => handleQuantityChange("decrement")}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
              <Text
                fontSize={18}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                style={styles.quantityValue}
              >
                {quantity}
              </Text>
              <Pressable
                style={styles.quantityButtonFilled}
                onPress={() => handleQuantityChange("increment")}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={theme.colors.textOnPrimary}
                />
              </Pressable>
            </View>

            <Text
              fontSize={18}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
            >
              ₹{((totalPricePaise * quantity) / 100).toFixed(2)}
            </Text>
          </View>

          <Pressable style={styles.addButton} onPress={handleAddToCart}>
            <Text
              fontSize={18}
              fontWeight="600"
              color="textOnPrimary"
              fontFamily="Poppins-SemiBold"
            >
              Add item - ₹{((totalPricePaise * quantity) / 100).toFixed(2)}
            </Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: theme.colors.mainBackground,
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
  },
  contentContainer: {
    paddingTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1,
    borderColor: theme.colors.buttonSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonFilled: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    marginHorizontal: 16,
  },
  addButton: {
    height: 56,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

const CustomizationBottomSheet = memo(CustomizationBottomSheetComponent);

CustomizationBottomSheet.displayName = "CustomizationBottomSheet";

export default CustomizationBottomSheet;
