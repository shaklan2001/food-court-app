import CustomizationBottomSheet from '@/src/components/HomePage/CustomizationBottomSheet';
import { FoodItem, FoodItemData } from '@/src/components/HomePage/FoodSection';
import { FoodItemSkeleton } from '@/src/components/HomePage/FoodSectionSkeleton';
import Header from '@/src/components/HomePage/Header';
import { Text, View } from '@/src/components/ui';
import { betterwayApiCall, useApiPort } from '@/src/network/useApiPort';
import { setCustomizationVisible } from '@/src/store/slices/uiSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/store/store';
import { showToast } from '@/src/utils';
import { SearchIcon, SortIcon } from '@/src/utils/Svgs';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ImageSourcePropType, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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

const parsePriceToPaise = (priceInput?: string | number | null): number => {
    if (priceInput === null || priceInput === undefined) {
        return 0;
    }

    if (typeof priceInput === 'number' && !Number.isNaN(priceInput)) {
        return Math.round(priceInput);
    }

    if (typeof priceInput === 'string') {
        const numeric = priceInput.replace(/[^\d.]/g, '');
        const parsed = parseFloat(numeric);
        if (!Number.isNaN(parsed)) {
            return Math.round(parsed * 100);
        }
    }

    return 0;
};

type AddonItem = {
    id: string;
    addonGroupId?: string;
    name: string;
    pricePaise: number;
    rank?: number;
};

type AddonGroup = {
    id: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    items: AddonItem[];
};

type VariationOption = {
    id: string;
    name: string;
    pricePaise: number;
    variationId?: string;
    groupName?: string;
};

type UnknownRecord = Record<string, unknown>;

type FavouriteItem = {
    dishId?: string | number;
    id?: string | number;
};

type FavouriteResponse = {
    items?: FavouriteItem[];
};

type RawMenuItem = {
    id: string;
    name?: string;
    description?: string;
    image?: string;
    pricePaise?: number;
    categoryId?: string;
    payload?: UnknownRecord;
    addons?: unknown[];
    variations?: unknown[];
};

const extractPriceInput = (...values: unknown[]): string | number | undefined => {
    for (const value of values) {
        if (typeof value === 'number' || typeof value === 'string') {
            return value;
        }
    }
    return undefined;
};

const sanitizeAddonGroups = (rawAddons?: unknown[]): AddonGroup[] => {
    if (!Array.isArray(rawAddons)) {
        return [];
    }

    return rawAddons.map((rawGroup) => {
        const group = (rawGroup as UnknownRecord) ?? {};
        const payload = (group.payload as UnknownRecord) ?? {};
        const groupId = String(group.id ?? payload.addongroupid ?? '');
        const rawItems = Array.isArray(group.items) ? (group.items as unknown[]) : [];

        const minSelection = Number(group.minSelection ?? payload.addon_item_selection_min ?? 0) || 0;
        const maxSelection = Number(
            group.maxSelection ??
            payload.addon_item_selection_max ??
            rawItems.length ??
            0,
        ) || 0;

        const items: AddonItem[] = rawItems.map((rawItem) => {
            const item = (rawItem as UnknownRecord) ?? {};
            const addonPayload = (item.payload as UnknownRecord) ?? {};
            const addonId = String(item.id ?? addonPayload.addonitemid ?? '');
            const pricePaise = (item.pricePaise as number | undefined) ??
                parsePriceToPaise(
                    extractPriceInput(
                        addonPayload.addonitem_price,
                        addonPayload.price,
                        item.price,
                    ),
                );

            const rankValue = addonPayload.addonitem_rank;

            return {
                id: addonId,
                addonGroupId: groupId,
                name: String(item.name ?? addonPayload.addonitem_name ?? ''),
                pricePaise: Number.isNaN(pricePaise) ? 0 : pricePaise,
                rank: typeof rankValue === 'number' ? rankValue : rankValue ? Number(rankValue) : undefined,
            };
        });

        return {
            id: groupId,
            name: String(group.name ?? payload.addongroup_name ?? ''),
            minSelection,
            maxSelection: maxSelection === 0 && items.length > 0 ? items.length : maxSelection,
            items,
        };
    });
};

const sanitizeVariations = (rawVariations?: unknown[], fallbackPayload?: UnknownRecord): VariationOption[] => {
    const variations: VariationOption[] = [];

    if (Array.isArray(rawVariations) && rawVariations.length > 0) {
        rawVariations.forEach((rawVariation) => {
            const variation = (rawVariation as UnknownRecord) ?? {};
            const payload = (variation.payload as UnknownRecord) ?? {};
            const variationId = variation.variationId ?? variation.id;
            const pricePaise = (variation.pricePaise as number | undefined) ??
                parsePriceToPaise(extractPriceInput(variation.price, payload.price));

            variations.push({
                id: String(variationId ?? ''),
                variationId: String(variationId ?? ''),
                name: String(variation.name ?? payload.variation_name ?? ''),
                pricePaise,
                groupName: typeof variation.groupname === 'string'
                    ? variation.groupname
                    : typeof payload.groupname === 'string'
                        ? payload.groupname
                        : undefined,
            });
        });
    } else {
        const fallbackVariations = Array.isArray(fallbackPayload?.variation)
            ? (fallbackPayload?.variation as unknown[])
            : [];

        fallbackVariations.forEach((rawVariation) => {
            const variation = (rawVariation as UnknownRecord) ?? {};
            const variationId = variation.variationid ?? variation.id;
            const pricePaise = parsePriceToPaise(extractPriceInput(variation.price));

            variations.push({
                id: String(variationId ?? ''),
                variationId: String(variationId ?? ''),
                name: String(variation.name ?? ''),
                pricePaise,
                groupName: typeof variation.groupname === 'string' ? variation.groupname : undefined,
            });
        });
    }

    return variations;
};

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
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [menuData, setMenuData] = useState<RawMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [customizerItem, setCustomizerItem] = useState<FoodItemData | null>(null);
    const [customizerVisible, setCustomizerVisible] = useState(false);

    const transformMenuData = useCallback((apiData: RawMenuItem[]) => {
        return apiData.map((item) => {
            let imageSource: ImageSourcePropType;
            const payload = item.payload ?? {};
            const imageUrl = typeof payload.item_image_url === 'string' && payload.item_image_url.trim() !== ''
                ? payload.item_image_url
                : item.image;
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
                imageSource = { uri: imageUrl };
            } else {
                imageSource = require('@/assets/images/bowl.png');
            }

            const addons = sanitizeAddonGroups(item.addons);
            const variations = sanitizeVariations(item.variations, item.payload ?? {});

            const basePricePaise = typeof item.pricePaise === 'number'
                ? item.pricePaise
                : parsePriceToPaise(
                    extractPriceInput(
                        item.payload?.price,
                        item.payload?.markup_price,
                    ),
                );

            const variationPrices = variations.map(variation => variation.pricePaise).filter(price => price > 0);

            let displayPricePaise: number | undefined = typeof basePricePaise === 'number' && basePricePaise > 0
                ? basePricePaise
                : undefined;

            if (variationPrices.length > 0) {
                const minVariationPrice = Math.min(...variationPrices);
                displayPricePaise = displayPricePaise !== undefined
                    ? Math.min(displayPricePaise, minVariationPrice)
                    : minVariationPrice;
            }

            if (displayPricePaise === undefined) {
                displayPricePaise = basePricePaise || 0;
            }

            const priceRangeMaxPaise = variationPrices.length > 0
                ? Math.max(...variationPrices)
                : basePricePaise;

            const hasCustomizations = addons.length > 0 || variations.length > 0;

            const ensuredDisplayPricePaise = displayPricePaise ?? 0;

            let displayPrice = `₹${(ensuredDisplayPricePaise / 100).toFixed(2)}`;
            if (hasCustomizations && priceRangeMaxPaise && priceRangeMaxPaise !== ensuredDisplayPricePaise) {
                displayPrice = `From ₹${(ensuredDisplayPricePaise / 100).toFixed(2)}`;
            }

            return {
                id: item.id,
                title: item.name,
                price: displayPrice,
                pricePaise: ensuredDisplayPricePaise,
                basePricePaise: basePricePaise,
                maxPricePaise: priceRangeMaxPaise || ensuredDisplayPricePaise,
                image: imageSource,
                imageUri: typeof imageSource === 'object' && 'uri' in imageSource ? imageSource.uri : '',
                description: item.payload?.itemdescription as string || item.description || '',
                categoryId: item.categoryId,
                payload: item.payload,
                addons,
                variations,
                hasCustomizations,
                isFavourite: favouriteIds.has(item.id),
            } as FoodItemData;
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
            success: (response: FavouriteResponse) => {
                const items = Array.isArray(response?.items) ? response.items : [];
                const favIds = new Set<string>();

                items.forEach((item) => {
                    const identifier = item.dishId ?? item.id;
                    if (identifier !== undefined && identifier !== null) {
                        favIds.add(String(identifier));
                    }
                });

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
            success: (response: unknown) => {
                if (Array.isArray(response)) {
                    setMenuData(response as RawMenuItem[]);
                } else if (response && typeof response === 'object' && Array.isArray((response as { data?: unknown }).data)) {
                    setMenuData((response as { data: RawMenuItem[] }).data);
                } else {
                    setMenuData([]);
                }
                setLoading(false);
            },
            failure: (error: { message?: string }) => {
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
            const payloadDescription = typeof item.payload?.itemdescription === 'string'
                ? item.payload.itemdescription.toLowerCase()
                : '';

            return name.includes(query) || 
                   description.includes(query) || 
                   payloadDescription.includes(query);
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

    const handleCustomizerClose = useCallback(() => {
        setCustomizerVisible(false);
        setCustomizerItem(null);
        dispatch(setCustomizationVisible(false));
    }, [dispatch]);

    const handleCustomizeItem = useCallback((item: FoodItemData) => {
        setCustomizerItem(item);
        setCustomizerVisible(true);
        dispatch(setCustomizationVisible(true));
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setCustomizationVisible(false));
        };
    }, [dispatch]);

    const renderFoodItem = useCallback(({ item, index }: { item: FoodItemData; index: number }) => (
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
                onHeartPress={handleHeartPress ? () => handleHeartPress(item.id, !!item.isFavourite) : undefined}
                onCustomize={handleCustomizeItem}
            />
        </View>
    ), [handleHeartPress, handleCustomizeItem]);

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
            {customizerItem && (
                <CustomizationBottomSheet
                    visible={customizerVisible}
                    item={{
                        id: customizerItem.id,
                        title: customizerItem.title,
                        description: customizerItem.description,
                        image: customizerItem.image,
                        pricePaise: customizerItem.pricePaise ?? customizerItem.basePricePaise ?? 0,
                        basePricePaise: customizerItem.basePricePaise ?? customizerItem.pricePaise ?? 0,
                        addons: customizerItem.addons || [],
                        variations: customizerItem.variations || [],
                    }}
                    onClose={handleCustomizerClose}
                />
            )}
        </SafeAreaView>
    );
};

SearchBar.displayName = 'SearchBar';

export default Menu;