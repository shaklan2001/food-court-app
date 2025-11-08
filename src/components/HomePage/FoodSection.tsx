import { addToCart, updateCartItem } from "@/src/store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/src/store/store";
import { AddonGroup, VariationOption } from "@/src/types/customization";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, TouchableOpacity } from "react-native";
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

    const currentQuantity = cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;

    const handleHeartPress = useCallback(async () => {
        if (onHeartPress) {
            onHeartPress(item.id);
        }
    }, [onHeartPress, item.id]);

    const handleCustomizePress = useCallback(() => {
        if (onCustomize) {
            onCustomize(item);
            return;
        }

        router.push({
            pathname: '/product-detail',
            params: {
                itemId: String(item.id),
                name: item.title,
                price: item.price,
                pricePaise: String(item.pricePaise ?? item.basePricePaise ?? 0),
                description: item.description || '',
                image: typeof item.image === 'object' && 'uri' in item.image ? item.image.uri ?? '' : '',
                isCustomizable: item.hasCustomizations ? '1' : '0',
            },
        });
    }, [item, onCustomize]);

    const handleQuantityChange = useCallback(async (itemId: string, quantity: number) => {
        if (!token) return;

        if (quantity === 0) {
            dispatch(updateCartItem(itemId, 0, token));
        } else if (currentQuantity === 0 && quantity === 1) {
            dispatch(addToCart({
                id: item.id,
                name: item.title,
                price: item.price,
                pricePaise: item.pricePaise || 0,
                image: item.image,
                description: item.description,
            }, token));
        } else {
            dispatch(updateCartItem(itemId, quantity, token));
        }
    }, [item, token, dispatch, currentQuantity]);

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
                <View position="relative">
                    <Image
                        source={item.image}
                        style={{ width: '100%', height: 140, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                    
                    {showHeartIcon && (
                        <Pressable
                            onPress={handleHeartPress}
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
                            <TouchableOpacity onPress={handleCustomizePress}>
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