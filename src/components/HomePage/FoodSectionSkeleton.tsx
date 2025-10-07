import { MotiView } from "moti";
import { memo } from "react";
import { FlatList } from "react-native";
import { View } from "../ui";



const FoodItemSkeleton = memo(({ isGridLayout = false }: { isGridLayout?: boolean }) => {
    return (
        <MotiView
            from={{ opacity: 0.4 }}
            animate={{ opacity: 0.8 }}
            transition={{
                type: 'timing',
                duration: 1000,
                loop: true,
                repeatReverse: true,
            }}
        >
            <View
                minHeight={220}
                width={isGridLayout ? undefined : 200}
                backgroundColor="transparent"
                borderRadius="m"
                overflow="hidden"
                marginRight={isGridLayout ? undefined : "m"}
            >
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: 'timing',
                        duration: 1000,
                        delay: 200,
                        loop: true,
                        repeatReverse: true,
                    }}
                    style={{
                        width: '100%',
                        height: 140,
                        borderRadius: 8,
                        backgroundColor: '#c9c9c9',
                    }}
                />
                <View marginVertical='s'>
                    <MotiView
                        from={{ opacity: 0.4 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                            type: 'timing',
                            duration: 1000,
                            delay: 300,
                            loop: true,
                            repeatReverse: true,
                        }}
                        style={{
                            width: '90%',
                            height: 18,
                            backgroundColor: '#c9c9c9',
                            borderRadius: 4,
                            marginBottom: 8,
                        }}
                    />
                    <MotiView
                        from={{ opacity: 0.4 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                            type: 'timing',
                            duration: 1000,
                            delay: 400,
                            loop: true,
                            repeatReverse: true,
                        }}
                        style={{
                            width: '70%',
                            height: 16,
                            backgroundColor: '#c9c9c9',
                            borderRadius: 4,
                        }}
                    />
                </View>
                <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={'s'}>
                    <View width={'60%'} alignItems="flex-start" justifyContent="center">
                        <MotiView
                            from={{ opacity: 0.4 }}
                            animate={{ opacity: 0.8 }}
                            transition={{
                                type: 'timing',
                                duration: 1000,
                                delay: 500,
                                loop: true,
                                repeatReverse: true,
                            }}
                            style={{
                                width: 60,
                                height: 16,
                                backgroundColor: '#c9c9c9',
                                borderRadius: 4,
                            }}
                        />
                    </View>
                    <View width={'40%'} alignItems="center" justifyContent="center">
                        <MotiView
                            from={{ opacity: 0.4 }}
                            animate={{ opacity: 0.8 }}
                            transition={{
                                type: 'timing',
                                duration: 1000,
                                delay: 600,
                                loop: true,
                                repeatReverse: true,
                            }}
                            style={{
                                width: 80,
                                height: 32,
                                backgroundColor: '#c9c9c9',
                                borderRadius: 8,
                            }}
                        />
                    </View>
                </View>
            </View>
        </MotiView>
    );
});

export default FoodItemSkeleton;

FoodItemSkeleton.displayName = 'FoodItemSkeleton';

const FoodSectionSkeleton = memo(({ count = 5 }: { count?: number }) => {
    return (
        <FlatList
            data={Array.from({ length: count }, (_, index) => index)}
            renderItem={({ index }) => (
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: 'timing',
                        duration: 1000,
                        delay: index * 100,
                        loop: true,
                        repeatReverse: true,
                    }}
                >
                    <FoodItemSkeleton />
                </MotiView>
            )}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 0 }}
            decelerationRate="fast"
            snapToAlignment="start"
        />
    );
});

FoodSectionSkeleton.displayName = 'FoodSectionSkeleton';

export { FoodItemSkeleton, FoodSectionSkeleton };
