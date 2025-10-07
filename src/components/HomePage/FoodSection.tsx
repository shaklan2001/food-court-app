import { addToCart, updateCartItem } from "@/src/store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/src/store/store";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { FlatList, Image, Pressable, TouchableOpacity } from "react-native";
import { Text, View } from "../ui";
import { FoodSectionSkeleton } from "./FoodSectionSkeleton";
import QuantitySelector from "./QuantitySelector";

export const FoodItem = memo(({ 
    item, 
    showHeartIcon = false, 
    onHeartPress,
    marginBottom = 0,
    isGridLayout = false,
}: { 
    item: any; 
    showHeartIcon?: boolean;
    onHeartPress?: () => void;
    marginBottom?: number;
    isGridLayout?: boolean;
}) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const cartItems = useAppSelector((state: RootState) => state.cart.items);

    const handleItemPress = () => {
        router.push('/product-detail');
    };

    const currentQuantity = cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;

    const handleHeartPress = useCallback(async () => {
        if (!token) return;
        onHeartPress?.();
    }, [token, onHeartPress]);

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
        <Pressable onPress={handleItemPress}>
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
                        <TouchableOpacity
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
                                    borderRadius: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                }}
                            >
                                <Ionicons 
                                    name="heart-outline" 
                                    size={16} 
                                    color="#FFFFFF" 
                                />
                            </BlurView>
                        </TouchableOpacity>
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
                <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={'s'}>
                    <View width={'60%'} alignItems="flex-start" justifyContent="center" >
                        <Text
                            fontSize={14}
                            marginTop={'xs'}
                            color="textSecondary"
                            fontFamily="Poppins-SemiBold"
                        >
                            {item.price}
                        </Text>
                    </View>
                    <View width={'40%'} alignItems="center" justifyContent="center">
                        <QuantitySelector
                            itemId={item.id}
                            currentQuantity={currentQuantity}
                            onQuantityChange={handleQuantityChange}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
});

FoodItem.displayName = 'FoodItem';

const FoodSection = memo(({ 
    title, 
    data, 
    loading = false, 
    showHeartIcon = false,
}: { 
    title: string; 
    data: any[]; 
    loading?: boolean;
    showHeartIcon?: boolean;
}) => {
    const renderFoodItem = useCallback(({ item }: { item: any }) => (
        <FoodItem 
            item={item} 
            showHeartIcon={showHeartIcon}
        />
    ), [showHeartIcon]);

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