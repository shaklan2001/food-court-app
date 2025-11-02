import { FoodItem } from '@/src/components/HomePage/FoodSection';
import { StepIndicator } from '@/src/components/StepIndicator';
import { Text, View } from '@/src/components/ui';
import { mockCuisineData } from '@/src/data/mockCuisineData';
import theme from '@/src/theme/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../cart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 15;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

type OptionType = 'takeaway' | 'dine-in';

const SelectMenu = () => {
    const [selectedOption, setSelectedOption] = useState<OptionType>('takeaway');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Get sample menu items
    const menuItems = mockCuisineData[0]?.menuItems.slice(0, 6) || [];

    const transformedMenuItems = menuItems.map((item) => ({
        id: item.id,
        title: item.name,
        price: `₹${item.price}`,
        pricePaise: item.price * 100,
        image: { uri: item.image },
        description: item.description,
        isFavourite: false,
    }));

    const handleAddItem = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleNext = () => {
        // Navigate to step 3 (confirmation/summary)
        router.push({
            pathname: '/(tabs)/order-later/confirmation',
            params: { selectedOption },
        });
    };

    const renderFoodItem = ({ item, index }: { item: any; index: number }) => (
        <View
            style={{
                width: CARD_WIDTH,
                marginBottom: 15,
                marginRight: index % 2 === 0 ? CARD_GAP : 0,
            }}
        >
            <FoodItem
                item={item}
                showHeartIcon={false}
                isFavouriteItem={false}
                isGridLayout={true}
                onHeartPress={() => undefined}
            />
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
            <ScreenHeader title="Order Later" moreAction={false} />

            <View paddingHorizontal="l">
                <StepIndicator currentStep={2} totalSteps={3} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View paddingHorizontal="l" gap="xl">
                    {/* Select Option Section */}
                    <View gap="m">
                        <View flexDirection="row" gap="xs" alignItems="center">
                            <View width={4} height={21} backgroundColor="primary" borderRadius="xs" />
                            <Text
                                fontSize={20}
                                fontWeight="600"
                                fontFamily="Poppins-SemiBold"
                                color="textPrimary"
                            >
                                Select Option
                            </Text>
                        </View>

                        <View flexDirection="row" gap="s">
                            {(['takeaway', 'dine-in'] as OptionType[]).map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setSelectedOption(option)}
                                    style={[
                                        styles.optionButton,
                                        selectedOption === option && styles.optionButtonActive,
                                    ]}
                                >
                                    <Text
                                        fontSize={14}
                                        fontFamily="SF Pro"
                                        style={{
                                            color:
                                                selectedOption === option
                                                    ? 'white'
                                                    : theme.colors.textPrimary,
                                        }}
                                    >
                                        {option === 'takeaway' ? 'Takeaway' : 'Dine-In'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Select Menu Section */}
                    <View gap="m" paddingBottom="l">
                        <View flexDirection="row" gap="xs" alignItems="center">
                            <View width={4} height={21} backgroundColor="primary" borderRadius="xs" />
                            <Text
                                fontSize={20}
                                fontWeight="600"
                                fontFamily="Poppins-SemiBold"
                                color="textPrimary"
                            >
                                Select Menu
                            </Text>
                        </View>

                        <FlatList
                            data={transformedMenuItems}
                            renderItem={renderFoodItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                            contentContainerStyle={{ paddingBottom: 0 }}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Next Button */}
            <View paddingHorizontal="l" paddingBottom="m" backgroundColor="mainBackgroundLight">
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
    optionButton: {
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
    optionButtonActive: {
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

export default SelectMenu;

