import { StepIndicator } from '@/src/components/StepIndicator';
import { Text, View } from '@/src/components/ui';
import theme from '@/src/theme/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../cart';

type MealType = 'breakfast' | 'lunch' | 'dinner';

const timeSlots = {
    breakfast: ['9:00 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM'],
    lunch: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM'],
    dinner: ['06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'],
};

const OrderLater = () => {
    const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
    const [selectedTime, setSelectedTime] = useState<string>('07:00 AM');

    const handleNext = () => {
        // Navigate to step 2
        router.push('/order-later/select-menu');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
            <ScreenHeader title="Order Later" />

            <View paddingHorizontal="l">
                <StepIndicator currentStep={1} totalSteps={3} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View paddingHorizontal="l" gap="l">
                    {/* Select Time Section */}
                    <View gap="m">
                        <View flexDirection="row" gap="xs" alignItems="center">
                            <View width={4} height={21} backgroundColor="primary" borderRadius="xs" />
                            <Text fontSize={20} fontWeight="600" fontFamily="Poppins-SemiBold" color="textPrimary">
                                Select Time
                            </Text>
                        </View>

                        {/* Meal Type Selector */}
                        <View flexDirection="row" gap="s">
                            {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((meal) => (
                                <TouchableOpacity
                                    key={meal}
                                    onPress={() => setSelectedMeal(meal)}
                                    style={[
                                        styles.mealButton,
                                        selectedMeal === meal && styles.mealButtonActive,
                                    ]}
                                >
                                    <Text
                                        fontSize={14}
                                        fontFamily="SF Pro"
                                        style={{
                                            color: selectedMeal === meal ? 'white' : theme.colors.textPrimary,
                                        }}
                                    >
                                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Time Slots Grid */}
                        <View style={styles.timeGrid}>
                            {timeSlots[selectedMeal].slice(0, 2).map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    disabled
                                    style={[
                                        styles.timeSlot,
                                        styles.timeSlotDisabled,
                                    ]}
                                >
                                    <Text
                                        fontSize={14}
                                        fontFamily="Poppins-Medium"
                                        style={{
                                            color: theme.colors.textSecondary,
                                            opacity: 0.4,
                                        }}
                                    >
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {timeSlots[selectedMeal].slice(2).map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    onPress={() => setSelectedTime(time)}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === time && styles.timeSlotActive,
                                    ]}
                                >
                                    <Text
                                        fontSize={14}
                                        fontFamily="Poppins-Medium"
                                        style={{
                                            color:
                                                selectedTime === time
                                                    ? theme.colors.mainBackground
                                                    : theme.colors.primary,
                                        }}
                                    >
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Next Button */}
            <View paddingHorizontal="l" paddingBottom="m">
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
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
    mealButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(1, 1, 1, 0.15)',
        backgroundColor: theme.colors.mainBackground,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mealButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeSlot: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.mainBackground,
    },
    timeSlotDisabled: {
        borderColor: 'rgba(1, 1, 1, 0.1)',
        backgroundColor: theme.colors.mainBackground,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default OrderLater;
