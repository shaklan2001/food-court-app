import { FoodItemData } from '@/src/components/HomePage/FoodSection';
import QuantitySelector from '@/src/components/HomePage/QuantitySelector';
import { StepIndicator } from '@/src/components/StepIndicator';
import { Text, View } from '@/src/components/ui';
import { betterwayApiCall } from '@/src/network/useApiPort';
import { RootState, useAppSelector } from '@/src/store/store';
import theme from '@/src/theme/theme';
import { showToast } from '@/src/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, GestureResponderEvent, Image, ImageSourcePropType, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../cart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

type OptionType = 'takeaway' | 'dine-in';

type RawMenuItem = {
    id?: string | number;
    name?: string;
    description?: string;
    image?: string;
    pricePaise?: number;
    payload?: Record<string, unknown>;
};

type MenuItem = {
    id: string;
    name: string;
    description: string;
    priceLabel: string;
    pricePaise: number;
    imageUrl?: string;
};

const parsePriceToPaise = (value?: unknown): number => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const numeric = value.replace(/[^\d.]/g, '');
        const parsed = parseFloat(numeric);
        if (!Number.isNaN(parsed)) {
            return Math.round(parsed * 100);
        }
    }
    return 0;
};

// Custom FoodItem component for order-later that matches menu tab exactly
const OrderLaterFoodItem = memo(({ 
    item, 
    currentQuantity = 0,
    onQuantityChange,
}: { 
    item: FoodItemData; 
    currentQuantity: number;
    onQuantityChange: (itemId: string, quantity: number) => void;
}) => {
    const handleCardPress = useCallback(() => {
        const params: Record<string, string> = {
            itemId: String(item.id),
            name: item.title,
            price: item.price,
            pricePaise: String(item.pricePaise ?? item.basePricePaise ?? 0),
            description: item.description ?? '',
            image: typeof item.image === 'object' && item.image !== null && 'uri' in item.image 
                ? (item.image as { uri?: string }).uri ?? '' 
                : '',
            isCustomizable: item.hasCustomizations ? '1' : '0',
        };

        router.push({
            pathname: '/product-detail',
            params,
        });
    }, [item]);

    const handleQuantityChange = useCallback((_itemId: string, quantity: number) => {
        onQuantityChange(item.id, quantity);
    }, [item.id, onQuantityChange]);

    return (
        <View>
            <View
                minHeight={220}
                width={undefined}
                backgroundColor="transparent"
                borderRadius="m"
                overflow="hidden"
                style={{ marginBottom: 0 }}
            >
                <Pressable onPress={handleCardPress}>
                    <View position="relative">
                        <Image
                            source={item.image}
                            style={{ width: '100%', height: 140, borderRadius: 8 }}
                            resizeMode="cover"
                        />
                    </View>
                
                    <View marginVertical='s'>
                        <Text
                            fontSize={14}
                            fontWeight="600"
                            lineHeight={16}
                            color="textPrimary"
                            fontFamily="Poppins-SemiBold"
                            style={{ marginBottom: -10 }}
                            minHeight={40}
                        >
                            {item.title}
                        </Text>
                    </View>
                </Pressable>
                <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={'s'} paddingBottom={'xs'}>
                    <View width={'45%'} alignItems="flex-start" justifyContent="center" >
                        <Text
                            fontSize={14}
                            marginTop={'xs'}
                            color="textSecondary"
                            fontFamily="Poppins-SemiBold"
                        >
                            {item.price}
                        </Text>
                    </View>
                    <View width={'55%'} alignItems="center" justifyContent="center" >
                        {item.hasCustomizations ? (
                            currentQuantity > 0 ? (
                                <QuantitySelector
                                    itemId={item.id}
                                    currentQuantity={currentQuantity}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ) : (
                                <TouchableOpacity
                                    onPress={(event: GestureResponderEvent) => {
                                        event.stopPropagation();
                                        handleCardPress();
                                    }}
                                >
                                    <View
                                        width={80}
                                        backgroundColor="primary"
                                        borderRadius="m"
                                        justifyContent="center"
                                        alignItems="center"
                                        paddingVertical='xs'
                                    >
                                        <Text color="textOnPrimary" fontSize={12} fontFamily="Poppins-SemiBold">
                                            Add
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        ) : (
                            <QuantitySelector
                                itemId={item.id}
                                currentQuantity={currentQuantity}
                                onQuantityChange={handleQuantityChange}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
});

OrderLaterFoodItem.displayName = 'OrderLaterFoodItem';

const SelectMenu = () => {
    const { slotId, slotLabel, availableSeats } = useLocalSearchParams<{
        slotId?: string;
        slotLabel?: string;
        availableSeats?: string;
    }>();
    const [selectedOption, setSelectedOption] = useState<OptionType>('takeaway');
    const [itemQuantities, setItemQuantities] = useState<Map<string, number>>(new Map());
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { token } = useAppSelector((state: RootState) => state.auth);

    const fetchMenuItems = useCallback(async () => {
        if (!token) {
            setLoadingMenu(false);
            setErrorMessage('Please login to view the menu.');
            return;
        }

        setLoadingMenu(true);
        setErrorMessage('');
        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "GET_MENU",
                auth: token,
                body: {
                    page: 1,
                    limit: 20,
                },
            });

            const payload = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            const formatted: MenuItem[] = (payload as RawMenuItem[])
                .filter(item => item?.id)
                .map((item) => {
                    const payloadData = item.payload ?? {};
                    const imageUrl = typeof payloadData?.item_image_url === 'string' && payloadData.item_image_url.trim() !== ''
                        ? payloadData.item_image_url
                        : typeof item.image === 'string' && item.image.trim() !== ''
                            ? item.image
                            : undefined;

                    const pricePaise = typeof item.pricePaise === 'number' && !Number.isNaN(item.pricePaise)
                        ? item.pricePaise
                        : parsePriceToPaise(payloadData?.price);

                    const safePrice = pricePaise > 0 ? pricePaise : 0;

                    return {
                        id: String(item.id),
                        name: item.name ?? (payloadData?.item_name as string) ?? 'Menu Item',
                        description: (payloadData?.itemdescription as string) ?? item.description ?? '',
                        imageUrl,
                        pricePaise: safePrice,
                        priceLabel: safePrice > 0 ? `₹${(safePrice / 100).toFixed(2)}` : 'Price on request',
                    };
                });

            setMenuItems(formatted);
        } catch (error) {
            const message = (error as { message?: string })?.message || 'Failed to fetch menu';
            setErrorMessage(message);
        } finally {
            setLoadingMenu(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
        setItemQuantities((prev) => {
            const newMap = new Map(prev);
            if (quantity > 0) {
                newMap.set(itemId, quantity);
            } else {
                newMap.delete(itemId);
            }
            return newMap;
        });
    }, []);

    const selectedCount = useMemo(() => {
        let total = 0;
        itemQuantities.forEach((qty) => {
            total += qty;
        });
        return total;
    }, [itemQuantities]);

    const handleNext = useCallback(() => {
        if (selectedCount === 0) {
            showToast({
                message: 'Please add at least one item to continue',
                type: 'error',
            });
            return;
        }

        // Convert Map to object for params
        const itemsData: Record<string, string> = {};
        itemQuantities.forEach((quantity, itemId) => {
            itemsData[`item_${itemId}`] = String(quantity);
        });

        router.push({
            pathname: '/(tabs)/order-later/confirmation',
            params: {
                selectedOption,
                slotId,
                slotLabel,
                availableSeats,
                itemCount: String(selectedCount),
                ...itemsData,
            },
        });
    }, [selectedCount, itemQuantities, selectedOption, slotId, slotLabel, availableSeats]);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fallbackImage = require('@/assets/images/bowl.png');

    // Transform MenuItem to FoodItemData format
    const transformedMenuItems: FoodItemData[] = useMemo(() => {
        return menuItems.map((item) => {
            let imageSource: ImageSourcePropType;
            if (item.imageUrl && item.imageUrl.trim() !== '') {
                imageSource = { uri: item.imageUrl };
            } else {
                imageSource = fallbackImage;
            }

            return {
                id: item.id,
                title: item.name,
                price: item.priceLabel,
                pricePaise: item.pricePaise,
                image: imageSource,
                description: item.description,
                hasCustomizations: false,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuItems]);

    const renderMenuCard = useCallback(({ item, index }: { item: FoodItemData; index: number }) => {
        const currentQuantity = itemQuantities.get(item.id) || 0;

        return (
            <View style={{ 
                width: CARD_WIDTH, 
                marginBottom: 12, 
                marginRight: index % 2 === 0 ? CARD_GAP : 0,
            }}>
                <OrderLaterFoodItem
                    item={item}
                    currentQuantity={currentQuantity}
                    onQuantityChange={handleQuantityChange}
                />
            </View>
        );
    }, [itemQuantities, handleQuantityChange]);

    const renderMenuContent = () => {
        if (loadingMenu) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={theme.colors.primary} />
                    <Text fontSize={12} color="textSecondary" marginTop="s">
                        Loading menu...
                    </Text>
                </View>
            );
        }

        if (errorMessage) {
            return (
                <View style={styles.loaderContainer}>
                    <Text fontSize={14} color="danger" textAlign="center">
                        {errorMessage}
                    </Text>
                </View>
            );
        }

        if (menuItems.length === 0) {
            return (
                <View style={styles.loaderContainer}>
                    <Text fontSize={14} color="textSecondary" textAlign="center">
                        No menu items available right now.
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={transformedMenuItems}
                renderItem={renderMenuCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'flex-start' }}
                contentContainerStyle={{ paddingBottom: 0 }}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
            <ScreenHeader title="Order Later" />

            <View paddingHorizontal="l">
                <StepIndicator currentStep={2} totalSteps={3} />
            </View>

            <FlatList
                ListHeaderComponent={(
                    <View paddingHorizontal="l" gap="xl">
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

                            <View style={styles.optionRow}>
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
                            {renderMenuContent()}
                        </View>
                    </View>
                )}
                data={[]}
                renderItem={() => null}
                keyExtractor={() => 'empty'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            />

            {/* Next Button */}
            <View paddingHorizontal="l" paddingBottom="m" backgroundColor="mainBackgroundLight">
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        selectedCount === 0 && styles.nextButtonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={selectedCount === 0}
                >
                    <Text fontSize={16} fontFamily="SF Pro" color="textOnPrimary">
                        {selectedCount > 0 ? `Next (${selectedCount} ${selectedCount === 1 ? 'item' : 'items'})` : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 20,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(1, 1, 1, 0.15)',
        backgroundColor: theme.colors.mainBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
    },
    optionButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    loaderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
});

export default SelectMenu;

