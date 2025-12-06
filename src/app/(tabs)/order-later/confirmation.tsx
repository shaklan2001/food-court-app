import { StepIndicator } from '@/src/components/StepIndicator';
import { Text, View } from '@/src/components/ui';
import theme from '@/src/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../cart';

const Confirmation = () => {
    const {
        selectedOption = 'takeaway',
        slotLabel,
        itemCount = '0',
        availableSeats = '0',
    } = useLocalSearchParams<{
        selectedOption?: string;
        slotLabel?: string;
        itemCount?: string;
        availableSeats?: string;
    }>();
    const isDineIn = selectedOption === 'dine-in';
    const [selectedSeats, setSelectedSeats] = useState(1);
    const parsedItemCount = Math.max(Number(itemCount) || 0, 0);
    const itemSummary = parsedItemCount === 1 ? '1 item' : `${parsedItemCount} items`;
    const slotDisplay = slotLabel || 'Not selected';
    const optionLabel = isDineIn ? 'Dine-In' : 'Takeaway';
    const availableSeatsNumber = Math.max(Number(availableSeats) || 0, 0);
    const seatOptions = useMemo(() => (
        Array.from(
            { length: Math.min(Math.max(availableSeatsNumber, 1), 10) },
            (_, index) => index + 1,
        )
    ), [availableSeatsNumber]);

    useEffect(() => {
        if (!seatOptions.includes(selectedSeats)) {
            setSelectedSeats(seatOptions[seatOptions.length - 1] ?? 1);
        }
    }, [seatOptions, selectedSeats]);

    const handleNext = () => {
        // Navigate back to home or show success
        router.push('/(tabs)/(home)');
    };

    const SummaryCard = () => (
        <View
            backgroundColor="mainBackground"
            borderRadius="m"
            padding="l"
            style={{ gap: 16 }}
        >
            <View style={{ gap: 8 }}>
                <Text
                    fontSize={16}
                    fontWeight="600"
                    fontFamily="Poppins-SemiBold"
                    color="textPrimary"
                >
                    Order Summary
                </Text>
                <Text fontSize={14} fontFamily="Poppins-Regular" color="textSecondary">
                    Your order has been scheduled for later.
                </Text>
            </View>

            <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text fontSize={14} fontFamily="Poppins-Regular" color="textSecondary">
                        Time:
                    </Text>
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        fontFamily="Poppins-SemiBold"
                        color="textPrimary"
                    >
                        {slotDisplay}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text fontSize={14} fontFamily="Poppins-Regular" color="textSecondary">
                        Option:
                    </Text>
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        fontFamily="Poppins-SemiBold"
                        color="textPrimary"
                    >
                        {optionLabel}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text fontSize={14} fontFamily="Poppins-Regular" color="textSecondary">
                        Items:
                    </Text>
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        fontFamily="Poppins-SemiBold"
                        color="textPrimary"
                    >
                        {itemSummary}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderSeatSelector = () => (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View paddingHorizontal="l" style={{ gap: 24 }}>
                    <SummaryCard />

                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <View
                            style={{
                                width: 4,
                                height: 21,
                                backgroundColor: theme.colors.primary,
                                borderRadius: 5,
                            }}
                        />
                        <Text
                            fontSize={20}
                            fontWeight="600"
                            fontFamily="Poppins-SemiBold"
                            color="textPrimary"
                        >
                            Select Number Of Seat
                        </Text>
                    </View>

                    {/* Available Seats Badge */}
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: 'rgba(1, 1, 1, 0.15)',
                                borderRadius: 6,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                height: 36,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                fontSize={14}
                                fontWeight="600"
                                fontFamily="SF Pro"
                                color="textPrimary"
                            >
                                No of Seats Available:- {availableSeatsNumber || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Chair Icon */}
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <MaterialCommunityIcons name="chair-rolling" size={96} color={theme.colors.primary} />
                    </View>

                    {/* Seat Numbers */}
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 12,
                            alignItems: 'center',
                            marginTop: 20,
                            flexWrap: 'wrap',
                        }}
                    >
                        {seatOptions.map((num) => (
                            <TouchableOpacity
                                key={num}
                                onPress={() => setSelectedSeats(num)}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor:
                                        selectedSeats === num
                                            ? theme.colors.primary
                                            : 'transparent',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    fontSize={14}
                                    fontFamily="SF Pro"
                                    style={{
                                        color:
                                            selectedSeats === num
                                                ? theme.colors.mainBackground
                                                : theme.colors.textPrimary,
                                    }}
                                >
                                    {num}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Next Button */}
            <View paddingHorizontal="l" paddingBottom="m" backgroundColor="mainBackgroundLight">
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 10,
                        paddingVertical: 18,
                        paddingHorizontal: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text fontSize={16} fontFamily="SF Pro" color="textOnPrimary">
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTakeawayConfirmation = () => (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                <View paddingHorizontal="l" style={{ gap: 24 }}>
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <View
                            style={{
                                width: 4,
                                height: 21,
                                backgroundColor: theme.colors.primary,
                                borderRadius: 2,
                            }}
                        />
                        <Text
                            fontSize={20}
                            fontWeight="600"
                            fontFamily="Poppins-SemiBold"
                            color="textPrimary"
                        >
                            Confirm Order
                        </Text>
                    </View>

                    <SummaryCard />
                </View>
            </ScrollView>

            {/* Confirm Button */}
            <View paddingHorizontal="l" paddingBottom="m">
                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 10,
                        paddingVertical: 18,
                        paddingHorizontal: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text fontSize={16} fontFamily="SF Pro" color="textOnPrimary">
                        Confirm Order
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
            <ScreenHeader title="Order Later" />

            <View paddingHorizontal="l">
                <StepIndicator currentStep={3} totalSteps={3} />
            </View>

            {isDineIn ? renderSeatSelector() : renderTakeawayConfirmation()}
        </SafeAreaView>
    );
};

export default Confirmation;

