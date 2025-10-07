import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { Fontisto, Octicons } from "@expo/vector-icons";
import { memo } from "react";
import { FlatList, Image } from "react-native";
import { Text, View } from "../ui";


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
                fontSize={11}
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
                        marginRight: 12,
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

ReviewCard.displayName = 'ReviewCard';

const UserReviewsSection = memo(() => {
    const reviewsData = [
        {
            id: '1',
            rating: 5,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "Anna Whale",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg'),
        },
        {
            id: '2',
            rating: 4,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "John Doe",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg'),
        },
        {
            id: '3',
            rating: 5,
            text: "Amazing food and great service! The dishes were fresh, tasty, and served on time. Loved the ambiance will definitely visit again. Perfect spot for both family and friends.",
            name: "Sarah Smith",
            role: "Student",
            avatar: require('@/assets/images/profile.jpg'),
        },
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

UserReviewsSection.displayName = 'UserReviewsSection';

export default UserReviewsSection;