import { Carousel, Text, View } from '@/src/components/ui';
import { betterwayApiCall, useApiPort } from '@/src/network/useApiPort';
import { addToCart, fetchCart, updateCartItem } from '@/src/store/slices/cartSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/src/store/store';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { NotificationIcon, SearchIcon, ShoppingCartIcon, SortIcon, WalletIcon } from '@/src/utils/Svgs';
import Fontisto from '@expo/vector-icons/build/Fontisto';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export const Card = memo(({ children, notification = false }: { children: React.ReactNode; notification?: boolean }) => {
    return (
        <View
            width={48}
            height={48}
            backgroundColor="mainBackground"
            borderRadius="m"
            borderWidth={1}
            justifyContent="center"
            alignItems="center"
            position="relative"
            borderColor="cardSecondaryBackground"
        >
            {children}
            {notification && (
                <View
                    position="absolute"
                    top={10}
                    right={10}
                    width={12}
                    height={12}
                    borderRadius="xxl"
                    backgroundColor="primary"
                    borderWidth={2}
                    borderColor="mainBackground"
                />
            )}
        </View>
    );
});

const QuantitySelector = memo(({ 
    itemId, 
    currentQuantity = 0, 
    onQuantityChange 
}: { 
    itemId: string; 
    currentQuantity: number; 
    onQuantityChange: (itemId: string, quantity: number) => void;
}) => {
    const handleIncrement = useCallback(() => {
        onQuantityChange(itemId, currentQuantity + 1);
    }, [itemId, currentQuantity, onQuantityChange]);

    const handleDecrement = useCallback(() => {
        if (currentQuantity > 0) {
            onQuantityChange(itemId, currentQuantity - 1);
        }
    }, [itemId, currentQuantity, onQuantityChange]);

    if (currentQuantity === 0) {
        return (
            <TouchableOpacity onPress={handleIncrement}>
                <View
                    width={80}
                    backgroundColor="primary"
                    borderRadius="m"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={12} fontFamily="Poppins-SemiBold">
                        Add
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View
            flexDirection="row"
            alignItems="center"
            backgroundColor="primary"
            borderRadius="m"
            minWidth={80}
        >
            <Pressable onPress={handleDecrement}>
                <View
                    width={25}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={14} fontFamily="Poppins-Bold">
                        -
                    </Text>
                </View>
            </Pressable>
            
            <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                minWidth={30}
            >
                <Text color="textOnPrimary" fontSize={12} fontFamily="Poppins-SemiBold">
                    {currentQuantity}
                </Text>
            </View>
            
            <Pressable onPress={handleIncrement}>
                <View
                    width={25}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text color="textOnPrimary" fontSize={14} fontFamily="Poppins-Bold">
                        +
                    </Text>
                </View>
            </Pressable>
        </View>
    );
});

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
    )
})

const ProfileIcon = memo(() => {
    return (
        <Pressable onPress={() => router.push('/profile/')}>
            <View overflow="hidden" width={48} height={48} backgroundColor="mainBackground" borderRadius="m" borderWidth={1} borderColor="border" justifyContent="center" alignItems="center" position="relative" >
                <Image source={require('@/assets/images/profile.jpg')} style={{ width: 48, height: 48 }} />
            </View>
        </Pressable>
    )
})

const Header = memo(({ user }: { user: any }) => {
    const cartItemCount = useAppSelector((state: RootState) => state.cart.itemCount);

    return (
        <View flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal={pageHorizantalPadding} mb='s'>
            <View>
                <View flexDirection="row" alignItems="center" gap="s">
                    <ProfileIcon />
                    <TouchableOpacity>
                        <Card notification={false}>
                            <WalletIcon />
                        </Card>
                    </TouchableOpacity>

                </View>
            </View>
            <View flexDirection="row" alignItems="center" gap="s">
                <TouchableOpacity onPress={() => router.push('/cart')}>
                    <Card notification={cartItemCount > 0}>
                        <ShoppingCartIcon />
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/notifications')}>
                    <Card notification={true}>
                        <NotificationIcon />
                    </Card>
                </TouchableOpacity>

            </View>
        </View>
    )
})

const Title = memo(({ user }: { user: any }) => {
    return (
        <View flexDirection="row" alignItems="center" paddingHorizontal={pageHorizantalPadding} mt='s'>
            <View flex={1}>
                <Text
                    fontSize={14}
                    fontWeight="500"
                    color="textPrimary"
                    marginBottom="xs"
                    fontFamily="Poppins-Medium"
                >
                    Hi {user?.name.split(' ')[0]} 👋
                </Text>
                <Text
                    fontSize={18}
                    fontWeight="bold"
                    color="textPrimary"
                    fontFamily="Poppins-Bold"
                >
                    Welcome To Smart CSK
                </Text>
            </View>
        </View>
    )
})

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
            route: '/menu'
        },
        {
            id: '2',
            image: require('@/assets/images/Cuisins/cuisine 2.png'),
            title: 'Mo Ch',
            subtitle: 'More Chini',
            route: '/menu'
        },
        {
            id: '3',
            image: require('@/assets/images/Cuisins/cuisine 3.png'),
            title: 'Italian Delight',
            subtitle: 'Authentic Italian flavors',
            route: '/menu'
        },
        {
            id: '4',
            image: require('@/assets/images/Cuisins/cuisine 4.png'),
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights',
            route: '/menu'
        },
        {
            id: '5',
            image: require('@/assets/images/Cuisins/cuisine 5.png'),
            title: 'American Classics',
            subtitle: 'Traditional favorites',
            route: '/menu'
        }
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
            subtitle: 'Authentic flavors from Italy'
        },
        {
            id: '2',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'Asian Fusion',
            subtitle: 'Modern Asian delights'
        },
        {
            id: '3',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'Mediterranean',
            subtitle: 'Fresh and healthy options'
        },
        {
            id: '4',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'American Classics',
            subtitle: 'Traditional favorites'
        },
        {
            id: '5',
            image: require('@/assets/images/Menuuuu.png'),
            title: 'International',
            subtitle: 'Global culinary journey'
        }
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

const FoodItem = memo(({ item }: { item: any }) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const cartItems = useAppSelector((state: RootState) => state.cart.items);

    const handleItemPress = () => {
        router.push('/product-detail');
    };

    const currentQuantity = cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0;

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
                description: item.description
            }, token));
        } else {
            dispatch(updateCartItem(itemId, quantity, token));
        }
    }, [item, token, dispatch, currentQuantity]);

    return (
        <Pressable onPress={handleItemPress}>
            <View
                minHeight={220}
                width={200}
                backgroundColor="transparent"
                borderRadius="m"
                overflow="hidden"
                marginRight="m"
            >
                <View>
                    <Image
                        source={item.image}
                        style={{ width: '100%', height: 140, borderRadius: 8 }}
                        resizeMode="cover"
                    />
                </View>
                <View marginVertical='s'>
                    <Text
                        fontSize={Platform.OS === 'ios' ? 14 : 12}
                        fontWeight="600"
                        lineHeight={Platform.OS === 'ios' ? 16 : 12}
                        color="textPrimary"
                        fontFamily="Poppins-SemiBold"
                        style={{ marginBottom: -10 }}
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

const FoodSection = memo(({ title, data }: { title: string; data: Array<any> }) => {
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

            <FlatList
                data={data}
                renderItem={({ item }) => <FoodItem item={item} />}
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

const ReviewCard = memo(({ review }: { review: any }) => {
    return (
        <View
            width={320}
            backgroundColor="mainBackground"
            borderRadius="m"
            padding="m"
            marginRight="m"
            elevation={3}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            shadowColor="textPrimary"
        >
            <View flexDirection="row" alignItems="flex-start" marginBottom="s" justifyContent="space-between">
                <Fontisto name="quote-a-right" size={18} color="black" />
                <View flexDirection="row" alignItems="center">
                    {[...Array(5)].map((_, index) => (
                        <Text
                            key={index}
                            color={index < review.rating ? "warning" : "crousalDot"}
                        >
                            <Octicons name="star-fill" size={16} color=" #FFA500" />
                        </Text>
                    ))}
                </View>
            </View>

            <Text
                fontSize={10}
                color="textSecondary"
                lineHeight={16}
                marginBottom="m"
                numberOfLines={5}
                fontFamily="Poppins-Regular"
            >
                {review.text}
            </Text>

            <View flexDirection="row" alignItems="center">
                <Image
                    source={review.avatar}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        marginRight: 12
                    }}
                />
                <View>
                    <Text
                        fontSize={12}
                        fontWeight="600"
                        color="textPrimary"
                        fontFamily="Poppins-SemiBold"
                        lineHeight={16}
                    >
                        {review.name}
                    </Text>
                    <Text
                        fontSize={10}
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        lineHeight={14}
                    >
                        {review.role}
                    </Text>
                </View>
            </View>
        </View>
    );
});

const UserReviewsSection = memo(() => {
    const reviewsData = [
        {
            id: '1',
            rating: 5,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "Anna Whale",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg')
        },
        {
            id: '2',
            rating: 4,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "John Doe",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg')
        },
        {
            id: '3',
            rating: 5,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "Sarah Smith",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg')
        }
    ];

    return (
        <View marginTop="l" paddingLeft={pageHorizantalPadding} paddingBottom='l'>
            <View flexDirection="row" alignItems="center" marginBottom="m">
                <View width={4} height={20} backgroundColor="primary" borderRadius="xs" marginRight="s" />
                <Text
                    fontSize={20}
                    fontWeight="bold"
                    color="textPrimary"
                    fontFamily="Poppins-Bold"
                >
                    User Reviews
                </Text>
            </View>

            <FlatList
                data={reviewsData}
                renderItem={({ item }) => <ReviewCard review={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 2, paddingVertical: 10 }}
                decelerationRate="fast"
                snapToAlignment="start"
            />
        </View>
    );
});

const Home = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const transformMenuData = useCallback((apiData: any[]) => {
        return apiData.map((item) => ({
            id: item.id,
            title: item.name,
            price: `₹${(item.pricePaise / 100).toFixed(0)}`,
            pricePaise: item.pricePaise,
            image: item.image || require('@/assets/images/bowl.png'),
            description: item.description,
            categoryId: item.categoryId,
            payload: item.payload
        }));
    }, []);

    const recommendationsData = transformMenuData(menuData);
    const bestSellersData = transformMenuData(menuData.slice(0, 5));
    const newArrivalsData = transformMenuData(menuData.slice(5, 10));

    const getMenu = useCallback(async () => {
        setLoading(true);
        const apiCall = useApiPort({
            intent: "intent_get_menu",
            port: betterwayApiCall({
                method: "POST",
                url: "GET_MENU",
                auth: token,
                body: {
                    page: 1,
                    limit: 10,
                },
            }),
            success: (response) => {
                let menuItems = response;
                if (response && !Array.isArray(response) && response.data) {
                    menuItems = response.data;
                }

                if (menuItems && Array.isArray(menuItems)) {
                    setMenuData(menuItems);
                }
                setLoading(false);
            },
            failure: (error) => {
                setLoading(false);
            },
        });

        try {
            await apiCall();
        } catch (error) {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        getMenu();
        if (token) {
            dispatch(fetchCart(token));
        }
    }, [getMenu, token, dispatch]);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : insets.top }}>
            <Header user={user} />
            <ScrollView>
                <Title user={user} />
                <SearchBar />
                <CuisineCarousel />
                <CuisineSection />
                <FoodSection title="Recommendations" data={recommendationsData} />
                <FoodSection title="Best Sellers" data={bestSellersData} />
                <FoodSection title="New Arrivals" data={newArrivalsData} />
                <UserReviewsSection />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

