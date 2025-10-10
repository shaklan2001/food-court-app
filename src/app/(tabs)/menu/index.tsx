import { FoodItem } from '@/src/components/HomePage/FoodSection';
import { FoodItemSkeleton } from '@/src/components/HomePage/FoodSectionSkeleton';
import Header from '@/src/components/HomePage/Header';
import { Text, View } from '@/src/components/ui';
import { betterwayApiCall, useApiPort } from '@/src/network/useApiPort';
import { RootState, useAppSelector } from '@/src/store/store';
import { showToast } from '@/src/utils';
import { SearchIcon, SortIcon } from '@/src/utils/Svgs';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: HORIZONTAL_PADDING,
    },
});

const SearchBar = memo(({ searchQuery, onSearchChange, onSearchPress }: {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearchPress: () => void;
}) => {
    return (
        <View
            flexDirection="row"
            gap="s"
            mt="m"
            paddingHorizontal={pageHorizantalPadding}
        >
            <View
                flex={1}
                height={48}
                backgroundColor="mainBackground"
                borderRadius="m"
                borderWidth={1}
                borderColor="buttonSecondary"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingHorizontal="m"
            >
                <TextInput
                    style={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                        color: '#333333',
                        flex: 1,
                    }}
                    placeholder="Search"
                    placeholderTextColor="#999999"
                    value={searchQuery}
                    onChangeText={onSearchChange}
                />
                <SortIcon />
            </View>
            <TouchableOpacity onPress={onSearchPress}>
                <View
                    width={48}
                    height={48}
                    backgroundColor="primary"
                    borderRadius="m"
                    justifyContent="center"
                    alignItems="center"
                >
                    <SearchIcon />
                </View>
            </TouchableOpacity>
        </View>
    );
});

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const Menu = () => {
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const transformMenuData = useCallback((apiData: any[]) => {
        return apiData.map((item) => {
            let imageSource;
            const imageUrl = item.payload?.item_image_url || item.image;
            if (imageUrl && imageUrl.trim() !== '') {
                imageSource = { uri: imageUrl };
            } else {
                imageSource = require('@/assets/images/bowl.png');
            }

            let displayPrice;
            if (item.payload?.price) {
                displayPrice = `₹${item.payload.price}`;
            } else if (item.pricePaise) {
                displayPrice = `₹${(item.pricePaise / 100).toFixed(2)}`;
            } else {
                displayPrice = '₹0';
            }

            return {
                id: item.id,
                title: item.name,
                price: displayPrice,
                pricePaise: item.pricePaise || 0,
                image: imageSource,
                description: item.payload?.itemdescription || item.description || '',
                categoryId: item.categoryId,
                payload: item.payload,
                isFavourite: favouriteIds.has(item.id),
            };
        });
    }, [favouriteIds]);

    const fetchFavourites = useCallback(() => {
        if (!token) return;
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_get_favourites",
            port: betterwayApiCall({
                method: "GET",
                url: "GET_FAVOURITES",
                auth: token,
            }),
            success: (response: { items?: any[] }) => {
                const favIds = new Set(
                    response?.items?.map((item) => item.dishId || item.id) || [],
                );
                setFavouriteIds(favIds);
            },
            failure: () => {
                // Failed to fetch favourites
            },
        })();
    }, [token]);

    const handleHeartPress = useCallback((itemId: string, isFavourite: boolean) => {
        if (!token) return;

        if (isFavourite) {
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
                    setFavouriteIds((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                },
                failure: () => {
                    showToast({
                        message: 'Failed to remove from favourites',
                        type: 'error',
                    });
                },
            })();
        } else {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useApiPort({
                intent: "intent_add_to_favourite",
                port: betterwayApiCall({
                    method: "POST",
                    url: "ADD_TO_FAVOURITE",
                    auth: token,
                    body: {
                        dishId: itemId,
                    },
                }),
                success: () => {
                    setFavouriteIds((prev) => new Set([...prev, itemId]));
                },
                failure: () => {
                    showToast({
                        message: 'Failed to add to favourites',
                        type: 'error',
                    });
                },
            })();
        }
    }, [token]);

    const getMenu = useCallback(async () => {
        setLoading(true);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_get_menu",
            port: betterwayApiCall({
                method: "POST",
                url: "GET_MENU",
                auth: token,
                body: {
                    page: 1,
                    limit: 50,
                },
            }),
            success: (response) => {
                setMenuData(response);
                setLoading(false);
            },
            failure: (error) => {
                setMenuData([]);
                setLoading(false);
                showToast({
                    message: error?.message || 'Failed to fetch menu',
                    type: 'error',
                });
            },
        })();
    }, [token]);

    const filteredData = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return menuData;
        }

        const query = debouncedSearchQuery.toLowerCase().trim();
        return menuData.filter(item => {
            const name = item.name?.toLowerCase() || '';
            const description = item.description?.toLowerCase() || '';
            const itemDescription = item.payload?.itemdescription?.toLowerCase() || '';
            
            return name.includes(query) || 
                   description.includes(query) || 
                   itemDescription.includes(query);
        });
    }, [menuData, debouncedSearchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleSearchPress = useCallback(() => {
        // Trigger immediate search if user presses search button
        // The debounced search will handle the filtering
    }, []);

    useEffect(() => {
        getMenu();
        fetchFavourites();
    }, [getMenu, fetchFavourites]);

    const transformedData = transformMenuData(filteredData);
    
    const searchResultsInfo = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return null;
        }
        
        const totalItems = menuData.length;
        const filteredCount = filteredData.length;
        
        return {
            query: debouncedSearchQuery,
            showing: filteredCount,
            total: totalItems,
            hasResults: filteredCount > 0,
        };
    }, [debouncedSearchQuery, filteredData.length, menuData.length]);

    const renderFoodItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <View style={{ 
            width: CARD_WIDTH, 
            marginBottom: 12, 
            marginRight: index % 2 === 0 ? CARD_GAP : 0, 
        }}>
            <FoodItem 
                item={item} 
                showHeartIcon={true}
                isFavouriteItem={item.isFavourite}
                isGridLayout={true}
                onHeartPress={handleHeartPress ? () => handleHeartPress(item.id, item.isFavourite) : undefined}
            />
        </View>
    ), [handleHeartPress]);

    const renderSkeletonItem = useCallback(({ index }: { index: number }) => (
        <View style={{ width: CARD_WIDTH, marginBottom: 12, marginRight: index % 2 === 0 ? CARD_GAP : 0 }}>
            <FoodItemSkeleton isGridLayout={true} />
        </View>
    ), []);

    const renderSearchResultsHeader = useCallback(() => {
        if (!searchResultsInfo) return null;

        return (
            <View 
                paddingHorizontal={pageHorizantalPadding} 
                marginTop="s" 
                marginBottom="xs"
            >
                <Text
                    fontSize={14}
                    color="textSecondary"
                    fontFamily="Poppins-Regular"
                >
                    {searchResultsInfo.hasResults 
                        ? `Found ${searchResultsInfo.showing} of ${searchResultsInfo.total} items for "${searchResultsInfo.query}"`
                        : `No results found for "${searchResultsInfo.query}"`
                    }
                </Text>
            </View>
        );
    }, [searchResultsInfo]);

    return (
        <SafeAreaView style={{ paddingTop: 10 }}>
            <Header />
            <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                onSearchPress={handleSearchPress}
            />
            <View>
                {renderSearchResultsHeader()}
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
                ) : transformedData.length === 0 ? (
                    <View justifyContent="center" alignItems="center" paddingHorizontal={pageHorizantalPadding}>
                        <Text 
                            fontSize={16}
                            color="textSecondary" 
                            fontFamily="Poppins-Medium"
                            textAlign="center"
                        >
                            {searchResultsInfo 
                                ? `No menu items found for "${searchResultsInfo.query}"`
                                : "No menu items available"
                            }
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.container, { marginTop: 16, flex: 1 }]}>
                        <FlatList
                            data={transformedData}
                            renderItem={renderFoodItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            columnWrapperStyle={{ justifyContent: 'flex-start' }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

SearchBar.displayName = 'SearchBar';

export default Menu;
