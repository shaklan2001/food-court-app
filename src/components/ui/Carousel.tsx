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

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const goToSlide = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true,
            });
        }
    };

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
                goToSlide(nextIndex);
                return nextIndex;
            });
        }, autoPlayInterval);
    }, [autoPlay, autoPlayInterval, data.length, clearAutoPlay]);

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
        startAutoPlay();
        return () => {
            clearAutoPlay();
            clearResumeTimer();
        };
    }, [startAutoPlay, clearAutoPlay, clearResumeTimer]);

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
                            goToSlide(index);
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
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                onScrollBeginDrag={handleInteractionStart}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setCurrentIndex(newIndex);
                    handleInteractionEnd();
                }}
                scrollEventThrottle={16}
                decelerationRate='normal'
                snapToInterval={screenWidth}
                snapToAlignment="center"
                contentContainerStyle={{ alignItems: 'center' }}
            />
            {renderPaginationDots()}
        </View>
    );
};

export default Carousel;