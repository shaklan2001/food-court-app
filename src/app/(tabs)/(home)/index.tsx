import { Carousel, Text, View } from '@/src/components/ui';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { NotificationIcon, SearchIcon, ShoppingCartIcon, SortIcon, WalletIcon } from '@/src/utils/Svgs';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { FlatList, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
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
        <Pressable onPress={() => router.push('/profile')}>
            <View overflow="hidden" width={48} height={48} backgroundColor="mainBackground" borderRadius="m" borderWidth={1} borderColor="border" justifyContent="center" alignItems="center" position="relative" >
                <Image source={require('@/assets/images/profile.jpg')} style={{ width: 48, height: 48 }} />
            </View>
        </Pressable>
    )
})

const Header = memo(() => {
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
                    <Card notification={true}>
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

const Title = memo(() => {
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
                    Hi Akash 👋
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
    const handleItemPress = () => {
        router.push('/product-detail');
    };

    return (
        <Pressable onPress={handleItemPress}>
            <View
                height={200}
                width={166}
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
                <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={'s'}>
                    <View alignItems="flex-start" justifyContent="center" >
                        <Text
                            fontSize={14}
                            fontWeight="600"
                            color="textPrimary"
                            fontFamily="Poppins-SemiBold"
                            style={{ marginBottom: -10 }}
                        >
                            {item.title}
                        </Text>
                        <Text
                            fontSize={12}
                            color="textSecondary"
                            fontFamily="Poppins-Regular"
                        >
                            {item.price}
                        </Text>
                    </View>
                    <View alignItems="center" justifyContent="center">
                        <TouchableOpacity>
                            <View
                                width={40}
                                height={40}
                                backgroundColor="primary"
                                borderRadius="m"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Text color="textOnPrimary" fontSize={16} fontFamily="Poppins-Bold">+</Text>
                            </View>
                        </TouchableOpacity>
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
            elevation={4}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            shadowColor="textPrimary"
        >
            <View flexDirection="row" alignItems="flex-start" marginBottom="s">
                <Text fontSize={24} color="textPrimary" fontWeight="bold" marginRight="s" fontFamily="Poppins-Bold">
                    "
                </Text>
                <View flexDirection="row" alignItems="center">
                    {[...Array(5)].map((_, index) => (
                        <Text
                            key={index}
                            fontSize={16}
                            color={index < review.rating ? "warning" : "crousalDot"}
                            marginRight="xs"
                            fontFamily="Poppins-Regular"
                        >
                            ★
                        </Text>
                    ))}
                </View>
            </View>

            <Text
                fontSize={12}
                color="textSecondary"
                lineHeight={16}
                marginBottom="m"
                numberOfLines={6}
                fontFamily="Poppins-Regular"
            >
                {review.text}
            </Text>

            <View flexDirection="row" alignItems="center">
                <Image
                    source={review.avatar}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 12
                    }}
                />
                <View>
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        color="textPrimary"
                        marginBottom="xs"
                        fontFamily="Poppins-SemiBold"
                    >
                        {review.name}
                    </Text>
                    <Text
                        fontSize={12}
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
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
                contentContainerStyle={{ paddingLeft: 0 }}
                decelerationRate="fast"
                snapToAlignment="start"
            />
        </View>
    );
});

const Home = () => {
    const insets = useSafeAreaInsets();

    const recommendationsData = [
        { id: 'rec1', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'rec2', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'rec3', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'rec4', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'rec5', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
    ];

    const bestSellersData = [
        { id: 'bs1', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'bs2', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'bs3', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'bs4', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'bs5', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
    ];

    const newArrivalsData = [
        { id: 'na1', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'na2', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'na3', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'na4', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
        { id: 'na5', image: require('@/assets/images/bowl.png'), title: 'Desi Bowl', price: '$500' },
    ];

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
            <Header />
            <ScrollView>
                <Title />
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

