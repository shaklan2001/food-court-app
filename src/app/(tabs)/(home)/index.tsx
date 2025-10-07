import FoodSection from '@/src/components/HomePage/FoodSection';
import Header from '@/src/components/HomePage/Header';
import UserReviewsSection from '@/src/components/HomePage/UserReviewsSection';
import { Carousel, Text, View } from '@/src/components/ui';
import { betterwayApiCall, useApiPort } from '@/src/network/useApiPort';
import { fetchCart } from '@/src/store/slices/cartSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/store/store';
import { showToast } from '@/src/utils';
import { SearchIcon, SortIcon } from '@/src/utils/Svgs';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchBar = memo(() => {
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
            <TouchableOpacity>
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

const Title = memo(({ user }: { user: any }) => {
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
                    Hi {user?.name.split(' ')[0]} 👋
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

const CuisineItem = memo(({ item }: { item: any }) => {
    const handleCuisinePress = (route: string) => {
        router.push(route);
    };

    return (
        <Pressable
            onPress={() => handleCuisinePress(item.route)}
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
            image: require('@/assets/images/Cuisins/cuisine 1.png'),
            title: 'Mini South',
            subtitle: 'Deliciously South Indian',
            route: '/menu',
        },
        {
            id: '2',
            image: require('@/assets/images/Cuisins/cuisine 2.png'),
            title: 'Mo Ch',
            subtitle: 'More Chini',
            route: '/menu',
        },
        {
            id: '3',
            image: require('@/assets/images/Cuisins/cuisine 3.png'),
            title: 'Italian Delight',
            subtitle: 'Authentic Italian flavors',
            route: '/menu',
        },
        {
            id: '4',
            image: require('@/assets/images/Cuisins/cuisine 4.png'),
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights',
            route: '/menu',
        },
        {
            id: '5',
            image: require('@/assets/images/Cuisins/cuisine 5.png'),
            title: 'American Classics',
            subtitle: 'Traditional favorites',
            route: '/menu',
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
            image: require('@/assets/images/Menuuuu.png'),
            title: 'Italian Cuisine',
            subtitle: 'Authentic flavors from Italy',
        },
        {
            id: '2',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights',
        },
        {
            id: '3',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'Mediterranean',
            subtitle: 'Fresh and healthy options',
        },
        {
            id: '4',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'American Classics',
            subtitle: 'Traditional favorites',
        },
        {
            id: '5',
            image: require('@/assets/images/Menuuuu.png'),
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

const Home = () => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const isLoadingRef = useRef(false);

    const transformMenuData = useCallback((apiData: any[]) => {
        return apiData.map((item) => {
            // Handle image - use URL if available, otherwise fallback to local image
            let imageSource;
            if (item.image && item.image.trim() !== '') {
                imageSource = { uri: item.image };
            } else {
                imageSource = require('@/assets/images/bowl.png');
            }

            return {
                id: item.id,
                title: item.name,
                price: `₹${(item.pricePaise / 100).toFixed(0)}`,
                pricePaise: item.pricePaise,
                image: imageSource,
                description: item.description,
                categoryId: item.categoryId,
                payload: item.payload,
                isFavourite: favouriteIds.has(item.id),
            };
        });
    }, [favouriteIds]);

    const recommendationsData = transformMenuData(menuData);
    const bestSellersData = transformMenuData(menuData.slice(0, 5));
    const newArrivalsData = transformMenuData(menuData.slice(5, 10));

    const fetchFavourites = useCallback(() => {
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
                console.log('Failed to fetch favourites');
            },
        })();
    }, [token]);

    const handleHeartPress = useCallback((itemId: string, isFavourite: boolean) => {
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
        if (!token || isLoadingRef.current) return;
        
        isLoadingRef.current = true;
        setLoading(true);
        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "GET_MENU",
                auth: token,
                body: {
                    page: 1,
                    limit: 10,
                },
            });

            let menuItems = response;
            if (response && !Array.isArray(response) && response.data) {
                menuItems = response.data;
            }

            if (menuItems && Array.isArray(menuItems)) {
                setMenuData(menuItems);
            }
        } catch (error) {
            console.log('Error fetching menu:', error);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [token]);

    useEffect(() => {
        getMenu();
        fetchFavourites();
        if (token) {
            dispatch(fetchCart(token));
        }
    }, [getMenu, fetchFavourites, token, dispatch]);

    return (
        <SafeAreaView style={{ paddingTop: 10 }}>
            <Header />
            <ScrollView>
                <Title user={user} />
                <SearchBar />
                <CuisineCarousel />
                <CuisineSection />
                <FoodSection title="Recommendations" data={recommendationsData} loading={loading} showHeartIcon={true} onHeartPress={handleHeartPress} />
                <FoodSection title="Best Sellers" data={bestSellersData} loading={loading} showHeartIcon={true} onHeartPress={handleHeartPress} />
                <FoodSection title="New Arrivals" data={newArrivalsData} loading={loading} showHeartIcon={true} onHeartPress={handleHeartPress} />
                <UserReviewsSection />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

SearchBar.displayName = 'SearchBar';
Title.displayName = 'Title';
CuisineItem.displayName = 'CuisineItem';
CuisineCarousel.displayName = 'CuisineCarousel';
CuisineSection.displayName = 'CuisineSection';


