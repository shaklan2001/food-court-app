import { addToCart, updateCartItem } from "@/src/store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/src/store/store";
import { AddonGroup, VariationOption } from "@/src/types/customization";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { FlatList, GestureResponderEvent, Image, ImageSourcePropType, Pressable, TouchableOpacity } from "react-native";
import { Text, View } from "../ui";
import { FoodSectionSkeleton } from "./FoodSectionSkeleton";
import QuantitySelector from "./QuantitySelector";

export type FoodItemData = {
    id: string;
    title: string;
    price: string;
    pricePaise?: number;
    basePricePaise?: number;
    maxPricePaise?: number;
    image: ImageSourcePropType;
    description?: string;
    addons?: AddonGroup[];
    variations?: VariationOption[];
    hasCustomizations?: boolean;
    isFavourite?: boolean;
    categoryId?: string;
    payload?: Record<string, unknown>;
    imageUri?: string;
};

export const FoodItem = memo(({ 
    item, 
    showHeartIcon = false, 
    marginBottom = 0,
    isGridLayout = false,
    isFavouriteItem = false,
    onHeartPress,
    onCustomize,
}: { 
    item: FoodItemData; 
    showHeartIcon?: boolean;
    marginBottom?: number;
    isGridLayout?: boolean;
    isFavouriteItem?: boolean;
    onHeartPress?: (itemId: string) => void;
    onCustomize?: (item: FoodItemData) => void;
}) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const cartItems = useAppSelector((state: RootState) => state.cart.items);

    const currentCartEntry = useMemo(() => {
        return cartItems.find(
            (cartItem) =>
                cartItem.id === item.id ||
                (cartItem.dishId && cartItem.dishId === item.id),
        );
    }, [cartItems, item.id]);

    const currentQuantity = currentCartEntry?.quantity ?? 0;

    const handleHeartPress = useCallback(async () => {
        if (onHeartPress) {
            onHeartPress(item.id);
        }
    }, [onHeartPress, item.id]);

    const customizationParam = useMemo(() => {
        if (!item.hasCustomizations) {
            return '';
        }

        const payload = {
            addons: item.addons ?? [],
            variations: item.variations ?? [],
            basePricePaise: item.basePricePaise ?? item.pricePaise ?? 0,
            maxPricePaise: item.maxPricePaise ?? item.pricePaise ?? 0,
        };

        try {
            return encodeURIComponent(JSON.stringify(payload));
        } catch {
            return '';
        }
    }, [item.addons, item.variations, item.basePricePaise, item.pricePaise, item.maxPricePaise, item.hasCustomizations]);

    const imageParam = useMemo(() => {
        if (item.imageUri) {
            return item.imageUri;
        }

        if (typeof item.image === 'object' && item.image !== null && 'uri' in item.image) {
            const value = (item.image as { uri?: string }).uri;
            return value ?? '';
        }

        return '';
    }, [item.image, item.imageUri]);

    const handleCardPress = useCallback(() => {
        const params: Record<string, string> = {
            itemId: String(item.id),
            name: item.title,
            price: item.price,
            pricePaise: String(item.pricePaise ?? item.basePricePaise ?? 0),
            description: item.description ?? '',
            image: imageParam,
            isCustomizable: item.hasCustomizations ? '1' : '0',
        };

        if (customizationParam) {
            params.customization = customizationParam;
        }

        router.push({
            pathname: '/product-detail',
            params,
        });
    }, [item.id, item.title, item.price, item.pricePaise, item.basePricePaise, item.description, item.hasCustomizations, imageParam, customizationParam]);

    const handleCustomizePress = useCallback(
        (event?: GestureResponderEvent) => {
            event?.stopPropagation?.();
            if (onCustomize) {
                onCustomize(item);
                return;
            }
            handleCardPress();
        },
        [item, onCustomize, handleCardPress],
    );

    const handleQuantityChange = useCallback(async (_itemId: string, quantity: number) => {
        if (!token) return;
        const cartKey = currentCartEntry?.id ?? item.id;

        if (quantity === 0) {
            dispatch(updateCartItem(cartKey, 0, token));
        } else if (!currentCartEntry && quantity === 1) {
            dispatch(addToCart({
                id: item.id,
                dishId: item.id,
                name: item.title,
                price: item.price,
                pricePaise: item.pricePaise || 0,
                image: item.image,
                description: item.description,
            }, token));
        } else {
            dispatch(updateCartItem(cartKey, quantity, token));
        }
    }, [item, token, dispatch, currentCartEntry]);

    return (
        <View>
            <View
                minHeight={220}
                width={isGridLayout ? undefined : 200}
                backgroundColor="transparent"
                borderRadius="m"
                overflow="hidden"
                marginRight={isGridLayout ? undefined : "m"}
                style={{ marginBottom }}
            >
                <Pressable onPress={handleCardPress}>
                    <View position="relative">
                        <Image
                            source={item.image}
                            style={{ width: '100%', height: 140, borderRadius: 8 }}
                            resizeMode="cover"
                        />
                        
                        {showHeartIcon && (
                            <Pressable
                                onPress={(event) => {
                                    event.stopPropagation();
                                    handleHeartPress();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                }}
                            >
                                <BlurView
                                    intensity={20}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 12,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    <Ionicons 
                                        name={isFavouriteItem ? "heart-sharp" : "heart-outline"} 
                                        size={22} 
                                        color={isFavouriteItem ? "#A20538" : "#FFFFFF"} 
                                    />
                                </BlurView>
                            </Pressable>
                        )}
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
                                    itemId={currentCartEntry?.id ?? item.id}
                                    currentQuantity={currentQuantity}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ) : (
                                <TouchableOpacity
                                    onPress={(event) => {
                                        event.stopPropagation();
                                        handleCustomizePress(event);
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
                                itemId={currentCartEntry?.id ?? item.id}
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

FoodItem.displayName = 'FoodItem';

const FoodSection = memo(({ 
    title, 
    data, 
    loading = false, 
    showHeartIcon = false,
    onHeartPress,
    onCustomize,
}: { 
    title: string; 
    data: FoodItemData[]; 
    loading?: boolean;
    showHeartIcon?: boolean;
    onHeartPress?: (itemId: string, isFavourite: boolean) => void;
    onCustomize?: (item: FoodItemData) => void;
}) => {
    const renderFoodItem = useCallback(({ item }: { item: FoodItemData }) => (
        <FoodItem 
            item={item} 
            showHeartIcon={showHeartIcon}
            isFavouriteItem={item.isFavourite}
            onHeartPress={onHeartPress ? () => onHeartPress(item.id, item.isFavourite ?? false) : undefined}
            onCustomize={onCustomize}
        />
    ), [showHeartIcon, onHeartPress, onCustomize]);

    return (
        <View marginTop="l" paddingHorizontal={pageHorizantalPadding}>
            <View flexDirection="row" alignItems="center" marginBottom="m">
                <View width={4} height={20} backgroundColor="primary" borderRadius="xs" marginRight="s" />
                <Text
                    fontSize={20}
                    fontWeight="bold"
                    color="textPrimary"
                    fontFamily="Poppins-Bold"
                >
                    {title}
                </Text>
            </View>

            {loading ? (
                <FoodSectionSkeleton count={5} />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderFoodItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 0 }}
                    decelerationRate="fast"
                    snapToAlignment="start"
                />
            )}
        </View>
    );
});

FoodSection.displayName = 'FoodSection';

export default FoodSection;