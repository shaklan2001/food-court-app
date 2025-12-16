import CustomizationBottomSheet from '@/src/components/HomePage/CustomizationBottomSheet';
import FoodSection, { type FoodItemData } from '@/src/components/HomePage/FoodSection';
import Header from '@/src/components/HomePage/Header';
import UserReviewsSection from '@/src/components/HomePage/UserReviewsSection';
import { Carousel, Text, View } from '@/src/components/ui';
import { betterwayApiCall, useApiPort } from '@/src/network/useApiPort';
import type { User } from '@/src/store/slices/authSlice';
import { fetchCart } from '@/src/store/slices/cartSlice';
import { setCustomizationVisible } from '@/src/store/slices/uiSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/store/store';
import type { AddonGroup, AddonItem, VariationOption } from '@/src/types/customization';
import { showToast } from '@/src/utils';
import { SearchIcon, SortIcon } from '@/src/utils/Svgs';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, ImageSourcePropType, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* eslint-disable @typescript-eslint/no-var-requires */
const CUISINE_IMAGE_1 = require('@/assets/images/Cuisins/cuisine 1.png') as ImageSourcePropType;
const CUISINE_IMAGE_2 = require('@/assets/images/Cuisins/cuisine 2.png') as ImageSourcePropType;
const CUISINE_IMAGE_3 = require('@/assets/images/Cuisins/cuisine 3.png') as ImageSourcePropType;
const CUISINE_IMAGE_4 = require('@/assets/images/Cuisins/cuisine 4.png') as ImageSourcePropType;
const CUISINE_IMAGE_5 = require('@/assets/images/Cuisins/cuisine 5.png') as ImageSourcePropType;
const MENU_BANNER_IMAGE = require('@/assets/images/Menuuuu.png') as ImageSourcePropType;
/* eslint-enable @typescript-eslint/no-var-requires */

const SearchBar = memo(() => {
    const handleSearchPress = useCallback(() => {
        router.push({
            pathname: '/(tabs)/menu',
            params: { focusSearch: 'true' },
        });
    }, []);

    return (
        <View
            flexDirection="row"
            gap="s"
            mt="m"
            paddingHorizontal={pageHorizantalPadding}
        >
            <Pressable onPress={handleSearchPress} style={{ flex: 1 }}>
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
                    <Text
                        fontSize={12}
                        fontWeight="400"
                        color="inputPlaceholder"
                        fontFamily="Poppins-Regular"
                    >
                        Search
                    </Text>
                    <SortIcon />
                </View>
            </Pressable>
            <TouchableOpacity onPress={handleSearchPress}>
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

type TitleProps = { user: User | null };

const Title = memo(({ user }: TitleProps) => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';

    return (
        <View flexDirection="row" alignItems="center" paddingHorizontal={pageHorizantalPadding} mt='m'>
            <View flex={1}>
                <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textPrimary"
                    marginBottom="xs"
                    fontFamily="Poppins-Medium"
                    lineHeight={24}
                >
                    Hi {firstName} 👋
                </Text>
                <Text
                    fontSize={20}
                    lineHeight={28}
                    fontWeight="bold"
                    color="textPrimary"
                    fontFamily="Poppins-Bold"
                >
                    Welcome To Smart CSK
                </Text>
            </View>
        </View>
    );
});

type CuisineItemData = {
    id: string;
    image: ImageSourcePropType;
    title: string;
    subtitle: string;
    slug: string;
};

const CuisineItem = memo(({ item }: { item: CuisineItemData }) => {
    const handleCuisinePress = (slug: string) => {
        router.push(`/cuisine/${slug}`);
    };

    return (
        <Pressable
            onPress={() => handleCuisinePress(item.slug)}
            style={{ marginRight: 16 }}
        >
            <View
                height={150}
                width={270}
                backgroundColor="mainBackground"
                borderRadius="l"
                overflow="hidden"
                elevation={4}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                shadowColor="textPrimary"
            >
                <Image
                    source={item.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>
        </Pressable>
    );
});

const CuisineSection = memo(() => {
    const cuisineData = [
        {
            id: '1',
            image: CUISINE_IMAGE_1,
            title: 'Mini South',
            subtitle: 'Deliciously South Indian',
            slug: 'mini-south',
        },
        {
            id: '2',
            image: CUISINE_IMAGE_2,
            title: 'Mo China',
            subtitle: 'More Chinese',
            slug: 'mo-china',
        },
        {
            id: '3',
            image: CUISINE_IMAGE_3,
            title: 'Italian Delight',
            subtitle: 'Authentic Italian flavors',
            slug: 'italian-delight',
        },
        {
            id: '4',
            image: CUISINE_IMAGE_4,
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights',
            slug: 'asian-fusion',
        },
        {
            id: '5',
            image: CUISINE_IMAGE_5,
            title: 'American Classics',
            subtitle: 'Traditional favorites',
            slug: 'american-classics',
        },
    ];

    return (
        <View marginTop="l" paddingLeft={pageHorizantalPadding}>
            <View flexDirection="row" alignItems="center" marginBottom="m">
                <View width={4} height={20} backgroundColor="primary" borderRadius="xs" marginRight="s" />
                <Text
                    fontSize={20}
                    fontWeight="bold"
                    color="textPrimary"
                    fontFamily="Poppins-Bold"
                >
                    Cuisine Section
                </Text>
            </View>

            <FlatList
                data={cuisineData}
                renderItem={({ item }) => <CuisineItem item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 0 }}
                decelerationRate="fast"
                snapToAlignment="start"
            />
        </View>
    );
});

const CuisineCarousel = memo(() => {
    const cuisineData = [
        {
            id: '1',
            image: MENU_BANNER_IMAGE,
            title: 'Italian Cuisine',
            subtitle: 'Authentic flavors from Italy',
        },
        {
            id: '2',
            image: MENU_BANNER_IMAGE,
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights',
        },
        {
            id: '3',
            image: MENU_BANNER_IMAGE,
            title: 'Mediterranean',
            subtitle: 'Fresh and healthy options',
        },
        {
            id: '4',
            image: MENU_BANNER_IMAGE,
            title: 'American Classics',
            subtitle: 'Traditional favorites',
        },
        {
            id: '5',
            image: MENU_BANNER_IMAGE,
            title: 'International',
            subtitle: 'Global culinary journey',
        },
    ];

    return (
        <View marginTop="l" paddingLeft={pageHorizantalPadding}>
            <Carousel
                data={cuisineData}
                height={200}
                showPagination={true}
                showTitle={true}
            />
        </View>
    );
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

const extractPriceValue = (value: unknown): string | number | undefined => {
    if (typeof value === 'number' || typeof value === 'string') {
        return value;
    }
    return undefined;
};

type UnknownRecord = Record<string, unknown>;

type RawMenuItem = {
    id: string | number;
    name?: string;
    description?: string;
    image?: string;
    pricePaise?: number;
    categoryId?: string;
    payload?: UnknownRecord;
    addons?: unknown[];
    variations?: unknown[];
};

type SectionKey = 'recommendations' | 'bestSellers' | 'newArrivals';

const sanitizeAddonGroups = (rawAddons?: unknown[]): AddonGroup[] => {
    if (!Array.isArray(rawAddons)) {
        return [];
    }

    return rawAddons.map((rawGroup) => {
        const group = (rawGroup as UnknownRecord) ?? {};
        const payload = (group.payload as UnknownRecord) ?? {};
        const groupId = String(group.id ?? payload.addongroupid ?? '');
        const rawItems = Array.isArray(group.items) ? (group.items as unknown[]) : [];

        const rawMinSelection = Number(group.minSelection ?? payload.addon_item_selection_min ?? 0) || 0;
        const rawMaxSelection = Number(
            group.maxSelection ??
            payload.addon_item_selection_max ??
            rawItems.length ??
            0,
        ) || 0;
        const minSelection = 0;
        const maxSelection = rawMaxSelection > 0 && rawMaxSelection < rawMinSelection
            ? rawMinSelection
            : rawMaxSelection;

        const items: AddonItem[] = rawItems.map((rawItem) => {
            const item = (rawItem as UnknownRecord) ?? {};
            const addonPayload = (item.payload as UnknownRecord) ?? {};
            const addonId = String(item.id ?? addonPayload.addonitemid ?? '');
            const addonPriceInput =
                extractPriceValue(addonPayload.addonitem_price) ??
                extractPriceValue(addonPayload.price) ??
                extractPriceValue(item.price);
            const pricePaise = (item.pricePaise as number | undefined) ??
                parsePriceToPaise(addonPriceInput);

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
            const variationPriceInput =
                extractPriceValue(variation.price) ??
                extractPriceValue(payload.price);
            const pricePaise = (variation.pricePaise as number | undefined) ??
                parsePriceToPaise(variationPriceInput);

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
            const pricePaise = parsePriceToPaise(extractPriceValue(variation.price));

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

const extractDishIds = (response: unknown, key: SectionKey): string[] => {
    if (!response || typeof response !== 'object') {
        return [];
    }

    const container = response as UnknownRecord;
    const dataContainer = (container.data as UnknownRecord) ?? container;
    const rawList = dataContainer[key];

    if (!Array.isArray(rawList)) {
        return [];
    }

    const ids = rawList.map((entry) => {
        if (typeof entry === 'string' || typeof entry === 'number') {
            return String(entry);
        }

        if (entry && typeof entry === 'object') {
            const record = entry as UnknownRecord;
            const value = record.dishId ?? record.dishID ?? record.dish_id ?? record.id;
            if (value !== undefined && value !== null) {
                return String(value);
            }
        }

        return '';
    }).filter((id) => id.length > 0);

    return Array.from(new Set(ids));
};

const SECTION_LABELS: Record<SectionKey, string> = {
    recommendations: 'recommendations',
    bestSellers: 'best sellers',
    newArrivals: 'new arrivals',
};

const Home = () => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(true);
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const [menuItemsById, setMenuItemsById] = useState<Map<string, RawMenuItem>>(new Map());
    const [recommendationIds, setRecommendationIds] = useState<string[]>([]);
    const [bestSellerIds, setBestSellerIds] = useState<string[]>([]);
    const [newArrivalIds, setNewArrivalIds] = useState<string[]>([]);
    const [customizerItem, setCustomizerItem] = useState<FoodItemData | null>(null);
    const [customizerVisible, setCustomizerVisible] = useState(false);
    const isLoadingRef = useRef(false);
    const lastLoadedTokenRef = useRef<string | null>(null);

    const transformMenuItem = useCallback((rawItem?: RawMenuItem): FoodItemData | null => {
        if (!rawItem) {
            return null;
        }

        const payload = (rawItem.payload as UnknownRecord) ?? {};
        const imageUrl = typeof payload.item_image_url === 'string' && payload.item_image_url.trim() !== ''
            ? (payload.item_image_url as string)
            : rawItem.image;

        let imageSource: ImageSourcePropType;
        if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            imageSource = { uri: imageUrl };
        } else {
            imageSource = require('@/assets/images/bowl.png');
        }

        const addons = sanitizeAddonGroups(rawItem.addons);
        const variations = sanitizeVariations(rawItem.variations, payload);

        const basePricePaise = rawItem.pricePaise ||
            parsePriceToPaise(extractPriceValue(payload.price)) ||
            parsePriceToPaise(extractPriceValue(payload.markup_price));

        const variationPrices = variations
            .map((variation) => variation.pricePaise)
            .filter((price) => price > 0);

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

        const ensuredDisplayPricePaise = displayPricePaise ?? 0;
        const priceRangeMaxPaise = variationPrices.length > 0
            ? Math.max(...variationPrices)
            : basePricePaise;

        const hasCustomizations = addons.length > 0 || variations.length > 0;

        let displayPrice = `₹${(ensuredDisplayPricePaise / 100).toFixed(2)}`;
        if (hasCustomizations && priceRangeMaxPaise && priceRangeMaxPaise !== ensuredDisplayPricePaise) {
            displayPrice = `From ₹${(ensuredDisplayPricePaise / 100).toFixed(2)}`;
        }

        const imageUri = typeof imageSource === 'object' && imageSource !== null && 'uri' in imageSource
            ? (imageSource as { uri: string }).uri
            : '';

        const rawDescription = payload.itemdescription;
        const description = typeof rawDescription === 'string' && rawDescription.trim().length > 0
            ? rawDescription
            : rawItem.description || '';

        return {
            id: String(rawItem.id),
            title: rawItem.name ?? '',
            price: displayPrice,
            pricePaise: ensuredDisplayPricePaise,
            basePricePaise: basePricePaise,
            maxPricePaise: priceRangeMaxPaise || ensuredDisplayPricePaise,
            image: imageSource,
            imageUri,
            description,
            categoryId: rawItem.categoryId,
            payload: rawItem.payload,
            addons,
            variations,
            hasCustomizations,
            isFavourite: favouriteIds.has(String(rawItem.id)),
        };
    }, [favouriteIds]);

    const buildSectionItems = useCallback((ids: string[]): FoodItemData[] => {
        const items: FoodItemData[] = [];
        ids.forEach((id) => {
            const rawItem = menuItemsById.get(id);
            const transformed = transformMenuItem(rawItem);
            if (transformed) {
                items.push(transformed);
            }
        });
    return items;
    }, [menuItemsById, transformMenuItem]);

    const recommendationsData = useMemo(
        () => buildSectionItems(recommendationIds),
        [buildSectionItems, recommendationIds],
    );

    const bestSellersData = useMemo(
        () => buildSectionItems(bestSellerIds),
        [buildSectionItems, bestSellerIds],
    );

    const newArrivalsData = useMemo(
        () => buildSectionItems(newArrivalIds),
        [buildSectionItems, newArrivalIds],
    );
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

    const fetchFavourites = useCallback(() => {
        if (!token) {
            setFavouriteIds(new Set());
            return;
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_get_favourites",
            port: betterwayApiCall({
                method: "GET",
                url: "GET_FAVOURITES",
                auth: token,
            }),
            success: (response: { items?: unknown[] }) => {
                const ids = new Set<string>(
                    (response?.items ?? [])
                        .map((item) => {
                            if (item && typeof item === 'object') {
                                const record = item as UnknownRecord;
                                const value = record.dishId ?? record.id;
                                return value !== undefined && value !== null ? String(value) : '';
                            }
                            if (typeof item === 'string' || typeof item === 'number') {
                                return String(item);
                            }
                            return '';
                        })
                        .filter((id) => id.length > 0),
                );
                setFavouriteIds(ids);
            },
            failure: () => {
                setFavouriteIds(new Set());
            },
        })();
    }, [token]);

    const fetchSectionIds = useCallback(async (route: 'GET_RECOMMENDATIONS' | 'GET_BEST_SELLERS' | 'GET_NEW_ARRIVALS', key: SectionKey) => {
        const resetSection = () => {
            switch (key) {
                case 'recommendations':
                    setRecommendationIds([]);
                    break;
                case 'bestSellers':
                    setBestSellerIds([]);
                    break;
                case 'newArrivals':
                    setNewArrivalIds([]);
                    break;
            }
        };

        if (!token) {
            resetSection();
            return;
        }

        resetSection();

        try {
            const response = await betterwayApiCall({
                method: "GET",
                url: route,
                auth: token,
            });

            const ids = extractDishIds(response, key);

            switch (key) {
                case 'recommendations':
                    setRecommendationIds(ids);
                    break;
                case 'bestSellers':
                    setBestSellerIds(ids);
                    break;
                case 'newArrivals':
                    setNewArrivalIds(ids);
                    break;
            }
        } catch (error) {
            resetSection();
            const message = (error as { message?: string })?.message;
            showToast({
                message: message
                    ? `Failed to load ${SECTION_LABELS[key]}: ${message}`
                    : `Failed to load ${SECTION_LABELS[key]}`,
                type: 'error',
            });
        }
    }, [token]);

    const fetchMenuItems = useCallback(async (): Promise<RawMenuItem[]> => {
        if (!token) {
            return [];
        }

        const response = await betterwayApiCall({
            method: "POST",
            url: "GET_MENU",
            auth: token,
            body: {
                page: 1,
                limit: 200,
            },
        });

        if (Array.isArray(response)) {
            return response as RawMenuItem[];
        }

        if (response && typeof response === 'object' && Array.isArray((response as { data?: unknown }).data)) {
            return (response as { data: RawMenuItem[] }).data;
        }

        return [];
    }, [token]);

    const loadHomeContent = useCallback(async () => {
        if (!token || isLoadingRef.current) {
            return;
        }

        isLoadingRef.current = true;
        setLoading(true);

        try {
            const menuItems = await fetchMenuItems();
            const menuMap = new Map<string, RawMenuItem>();
            menuItems.forEach((item) => {
                if (item && item.id !== undefined && item.id !== null) {
                    menuMap.set(String(item.id), item);
                }
            });
            setMenuItemsById(menuMap);

            await Promise.all([
                fetchSectionIds("GET_RECOMMENDATIONS", "recommendations"),
                fetchSectionIds("GET_BEST_SELLERS", "bestSellers"),
                fetchSectionIds("GET_NEW_ARRIVALS", "newArrivals"),
            ]);
        } catch (error) {
            showToast({
                message: (error as { message?: string })?.message || 'Failed to load menu',
                type: 'error',
            });
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [token, fetchMenuItems, fetchSectionIds]);

    const handleHeartPress = useCallback((itemId: string, isFavourite: boolean) => {
        if (!token) {
            return;
        }

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

    useEffect(() => {
        if (!token) {
            lastLoadedTokenRef.current = null;
            setMenuItemsById(new Map());
            setRecommendationIds([]);
            setBestSellerIds([]);
            setNewArrivalIds([]);
            setLoading(false);
            handleCustomizerClose();
            return;
        }

        if (lastLoadedTokenRef.current === token) {
            return;
        }

        lastLoadedTokenRef.current = token;
        loadHomeContent();
        fetchFavourites();
        dispatch(fetchCart(token));
    }, [token, loadHomeContent, fetchFavourites, dispatch, handleCustomizerClose]);

    useEffect(() => {
        return () => {
            dispatch(setCustomizationVisible(false));
        };
    }, [dispatch]);

    return (
        <SafeAreaView style={{ paddingTop: 10 }}>
            <Header />
            <ScrollView>
                <Title user={user} />
                <SearchBar />
                <CuisineCarousel />
                <CuisineSection />
                <FoodSection
                    title="Recommendations"
                    data={recommendationsData}
                    loading={loading}
                    showHeartIcon={true}
                    onHeartPress={handleHeartPress}
                    onCustomize={handleCustomizeItem}
                />
                <FoodSection
                    title="Best Sellers"
                    data={bestSellersData}
                    loading={loading}
                    showHeartIcon={true}
                    onHeartPress={handleHeartPress}
                    onCustomize={handleCustomizeItem}
                />
                <FoodSection
                    title="New Arrivals"
                    data={newArrivalsData}
                    loading={loading}
                    showHeartIcon={true}
                    onHeartPress={handleHeartPress}
                    onCustomize={handleCustomizeItem}
                />
                <UserReviewsSection />
            </ScrollView>
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
                        addons: customizerItem.addons ?? [],
                        variations: customizerItem.variations ?? [],
                    }}
                    onClose={handleCustomizerClose}
                    bottomOffset={0}
                />
            )}
        </SafeAreaView>
    );
};

export default Home;

SearchBar.displayName = 'SearchBar';
Title.displayName = 'Title';
CuisineItem.displayName = 'CuisineItem';
CuisineCarousel.displayName = 'CuisineCarousel';
CuisineSection.displayName = 'CuisineSection';


