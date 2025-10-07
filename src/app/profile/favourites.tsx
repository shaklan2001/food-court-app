import { betterwayApiCall, useApiPort } from "@/src/network/useApiPort";
import { RootState, useAppSelector } from "@/src/store/store";
import { showToast } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FoodItem } from "../../components/HomePage/FoodSection";
import { FoodItemSkeleton } from "../../components/HomePage/FoodSectionSkeleton";
import { Text, View } from "../../components/ui";
import { ScreenHeader } from "../cart";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: HORIZONTAL_PADDING,
    },
});

interface FavouriteItem {
    id: string;
    title: string;
    price: string;
    pricePaise: number;
    image: { uri: string } | number;
    description: string;
}

interface DishItem {
    dishId?: string;
    id: string;
    dish?: {
        name?: string;
        price?: number;
        pricePaise?: number;
        image?: string;
        description?: string;
        payload?: {
            price?: string;
            item_image_url?: string;
            itemdescription?: string;
        };
    };
}

const Favourites = () => {  
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavourites = useCallback(() => {
        setLoading(true);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_get_favourites",
            port: betterwayApiCall({
                method: "GET",
                url: "GET_FAVOURITES",
                auth: token,
            }),
            success: (response: { items?: DishItem[] }) => {
                const transformedData = response?.items?.map((item) => {
                    const price = item.dish?.payload?.price || item.dish?.price?.toString() || '0';
                    const pricePaise = item.dish?.pricePaise || 0;
                    const displayPrice = pricePaise > 0 
                        ? `₹${(pricePaise / 100).toFixed(2)}` 
                        : `₹${price}`;
                    
                    let imageSource;
                    const imageUrl = item.dish?.payload?.item_image_url || item.dish?.image;
                    if (imageUrl && imageUrl.trim() !== '') {
                        imageSource = { uri: imageUrl };
                    } else {
                        imageSource = require('../../../assets/images/bowl.png');
                    }

                    return {
                        id: item.dishId || item.id,
                        title: item.dish?.name || 'Unknown',
                        price: displayPrice,
                        pricePaise: pricePaise,
                        image: imageSource,
                        description: item.dish?.payload?.itemdescription || item.dish?.description || '',
                    };
                }) || [];
                setFavourites(transformedData);
                setLoading(false);
            },
            failure: () => {
                setLoading(false);
                showToast({
                    message: 'Failed to fetch favourites',
                    type: 'error',
                });
            },
        })();
    }, [token]);

    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

    const handleHeartPress = useCallback((itemId: string) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_remove_from_favourite",
            port: betterwayApiCall({
                method: "DELETE",
                url: "REMOVE_FROM_FAVOURITE",
                auth: token,
                body: {
                    dishId: itemId,
                },
            }),
            success: () => {
                setFavourites((prevFavourites) => 
                    prevFavourites.filter((item) => item.id !== itemId),
                );
            },
            failure: () => {
                showToast({
                    message: 'Failed to remove from favourites',
                    type: 'error',
                });
            },
        })();
    }, [token]);

    const renderFoodItem = useCallback(({ item, index }: { item: FavouriteItem; index: number }) => (
        <View style={{ width: CARD_WIDTH, marginBottom: 12, marginRight: index % 2 === 0 ? CARD_GAP : 0 }}>
            <FoodItem 
                item={item} 
                showHeartIcon={true}
                isGridLayout={true}
                isFavouriteItem={true}
                onHeartPress={handleHeartPress}
            />
        </View>
    ), [handleHeartPress]);

    const renderSkeletonItem = useCallback(({ index }: { index: number }) => (
        <View style={{ width: CARD_WIDTH, marginBottom: 12, marginRight: index % 2 === 0 ? CARD_GAP : 0 }}>
            <FoodItemSkeleton isGridLayout={true} />
        </View>
    ), []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
            <View flex={1} backgroundColor="mainBackgroundLight">
                <ScreenHeader title="Favourites" moreAction={false} />
                
                {loading ? (
                    <View style={[styles.container, { marginTop: 16 }]}>
                        <FlatList
                            data={Array.from({ length: 6 })}
                            renderItem={renderSkeletonItem}
                            keyExtractor={(_, index) => `skeleton-${index}`}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        />
                    </View>
                ) : favourites.length === 0 ? (
                    <View
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                        style={{ paddingHorizontal: HORIZONTAL_PADDING }}
                    >
                        <Ionicons name="heart-outline" size={80} color="#D3D3D3" />
                        <Text
                            fontSize={18}
                            fontWeight="600"
                            color="textPrimary"
                            fontFamily="Poppins-SemiBold"
                            marginTop="l"
                            marginBottom="s"
                        >
                            No Favourites Yet
                        </Text>
                        <Text
                            fontSize={14}
                            fontWeight="400"
                            color="textSecondary"
                            fontFamily="Poppins-Regular"
                            textAlign="center"
                            lineHeight={20}
                        >
                            Start adding items to your favourites by tapping the heart icon on
                            any food item
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.container, { marginTop: 16, flex: 1 }]}>
                        <FlatList
                            data={favourites}
                            renderItem={renderFoodItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Favourites;
