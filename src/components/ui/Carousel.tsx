import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import { View } from './index';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
    data: {
        id: string;
        image: any;
        title?: string;
        subtitle?: string;
    }[];
    height?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showPagination?: boolean;
    showTitle?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
    data,
    height = 200,
    autoPlay = true,
    autoPlayInterval = 5000,
    showPagination = true,
}) => {
    const theme = useTheme<Theme>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isScrollingRef = useRef(false);

    // Create infinite carousel data: [last, ...original, first]
    const infiniteData = React.useMemo(() => {
        if (data.length <= 1) return data;
        return [
            { ...data[data.length - 1], id: `duplicate-last-${data[data.length - 1].id}` },
            ...data,
            { ...data[0], id: `duplicate-first-${data[0].id}` },
        ];
    }, [data]);

    // Start at the first real item (index 1 in infiniteData)
    const startIndex = data.length > 1 ? 1 : 0;

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const goToSlide = useCallback((index: number, animated = true) => {
        if (flatListRef.current && !isScrollingRef.current) {
            isScrollingRef.current = true;
            flatListRef.current.scrollToIndex({
                index,
                animated,
            });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, animated ? 300 : 0);
        }
    }, []);

    const clearAutoPlay = useCallback(() => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }
    }, []);

    const clearResumeTimer = useCallback(() => {
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        if (!autoPlay || data.length <= 1) {
            clearAutoPlay();
            return;
        }
        clearAutoPlay();

        autoPlayTimerRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % data.length;
                // Map to infinite data index (add 1 because first item is duplicate)
                const infiniteIndex = nextIndex + 1;
                goToSlide(infiniteIndex, true);
                return nextIndex;
            });
        }, autoPlayInterval);
    }, [autoPlay, autoPlayInterval, data.length, clearAutoPlay, goToSlide]);

    const scheduleAutoPlayRestart = useCallback(() => {
        if (!autoPlay || data.length <= 1) {
            return;
        }
        clearResumeTimer();
        resumeTimerRef.current = setTimeout(() => {
            startAutoPlay();
        }, autoPlayInterval);
    }, [autoPlay, autoPlayInterval, data.length, startAutoPlay, clearResumeTimer]);

    const handleInteractionStart = useCallback(() => {
        clearAutoPlay();
        clearResumeTimer();
    }, [clearAutoPlay, clearResumeTimer]);

    const handleInteractionEnd = useCallback(() => {
        scheduleAutoPlayRestart();
    }, [scheduleAutoPlayRestart]);

    useEffect(() => {
        // Initialize scroll position to first real item
        if (data.length > 1 && flatListRef.current) {
            // Use requestAnimationFrame to ensure FlatList is ready
            const timer = setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                        index: startIndex,
                        animated: false,
                    });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [data.length, startIndex]);

    useEffect(() => {
        startAutoPlay();
        return () => {
            clearAutoPlay();
            clearResumeTimer();
        };
    }, [startAutoPlay, clearAutoPlay, clearResumeTimer]);

    const handleScrollEnd = useCallback((event: any) => {
        if (data.length <= 1) {
            setCurrentIndex(0);
            handleInteractionEnd();
            return;
        }

        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);

        // If we're at the duplicate last item (index 0), jump to real last item
        if (index === 0) {
            const realLastIndex = data.length; // Last real item in infiniteData
            setTimeout(() => {
                goToSlide(realLastIndex, false);
                setCurrentIndex(data.length - 1);
            }, 50);
        }
        // If we're at the duplicate first item (last index), jump to real first item
        else if (index === infiniteData.length - 1) {
            const realFirstIndex = 1; // First real item in infiniteData
            setTimeout(() => {
                goToSlide(realFirstIndex, false);
                setCurrentIndex(0);
            }, 50);
        }
        // We're at a real item
        else {
            const realIndex = index - 1; // Convert infinite index to real index
            setCurrentIndex(realIndex);
        }

        handleInteractionEnd();
    }, [data.length, infiniteData.length, goToSlide, handleInteractionEnd]);

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <View
                width={screenWidth}
                height={height}
                justifyContent="center"
                alignItems="center"
            >
                <View
                    style={{
                        width: screenWidth * 0.9,
                        height: '100%',
                        borderRadius: theme.borderRadii.l,
                        overflow: 'hidden',
                        marginRight: 30,
                    }}
                >
                    <Image
                        source={item.image}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        );
    };

    const renderPaginationDots = () => {
        if (!showPagination) return null;

        return (
            <View
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                marginTop="m"
                gap="s"
            >
                {data.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            handleInteractionStart();
                            const infiniteIndex = data.length > 1 ? index + 1 : index;
                            goToSlide(infiniteIndex, true);
                            setCurrentIndex(index);
                            handleInteractionEnd();
                        }}
                        style={{
                            width: index === currentIndex ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.crousalDot,
                        }}
                    />
                ))}
            </View>
        );
    };

    return (
        <View flex={1}>
            <Animated.FlatList
                ref={flatListRef}
                data={infiniteData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                onScrollBeginDrag={handleInteractionStart}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                decelerationRate='normal'
                snapToInterval={screenWidth}
                snapToAlignment="center"
                contentContainerStyle={{ alignItems: 'center' }}
                getItemLayout={(_, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
                initialScrollIndex={data.length > 1 ? startIndex : 0}
            />
            {renderPaginationDots()}
        </View>
    );
};

export default Carousel;