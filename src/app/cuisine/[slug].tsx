import { FoodItem } from '@/src/components/HomePage/FoodSection';
import { Text, View } from '@/src/components/ui';
import { getAllCuisines, mockCuisineData, type CuisineItem } from '@/src/data/mockCuisineData';
import theme from '@/src/theme/theme';
import { SearchIcon, SortIcon } from '@/src/utils/Svgs';
import { pageHorizantalPadding } from '@/src/utils/commomCompute';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../cart';

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

interface CuisineSelectorProps {
    cuisines: { id: string; name: string; slug: string; image: unknown }[];
    selectedSlug: string;
    onSelect: (slug: string) => void;
}

const CuisineSelector = memo(({ cuisines, selectedSlug, onSelect }: CuisineSelectorProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [itemLayouts, setItemLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const isScrolling = useRef(false);

    const scrollToCuisine = useCallback((slug: string, animated: boolean = true) => {
        const layout = itemLayouts[slug];
        if (layout && scrollViewRef.current) {
            const scrollToX = layout.x - (SCREEN_WIDTH / 2) + (layout.width / 2);
            scrollViewRef.current.scrollTo({ x: Math.max(0, scrollToX), animated });
        }
    }, [itemLayouts]);

    const findCenterCuisine = useCallback((scrollX: number) => {
        const centerPosition = scrollX + (SCREEN_WIDTH / 2);
        let closestCuisine = cuisines[0];
        let minDistance = Infinity;

        cuisines.forEach((cuisine) => {
            const layout = itemLayouts[cuisine.slug];
            if (layout) {
                const cuisineCenter = layout.x + layout.width / 2;
                const distance = Math.abs(centerPosition - cuisineCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCuisine = cuisine;
                }
            }
        });

        return closestCuisine;
    }, [cuisines, itemLayouts]);

    const handleScroll = useCallback((event: any) => {
        if (!isScrolling.current) return;
        
        const scrollX = event.nativeEvent.contentOffset.x;
        const centeredCuisine = findCenterCuisine(scrollX);
        
        if (centeredCuisine && centeredCuisine.slug !== selectedSlug) {
            onSelect(centeredCuisine.slug);
        }
    }, [findCenterCuisine, selectedSlug, onSelect]);

    const handleScrollBeginDrag = useCallback(() => {
        isScrolling.current = true;
    }, []);

    const handleScrollEndDrag = useCallback((event: any) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const centeredCuisine = findCenterCuisine(scrollX);
        
        if (centeredCuisine) {
            onSelect(centeredCuisine.slug);
            scrollToCuisine(centeredCuisine.slug, true);
        }
        
        setTimeout(() => {
            isScrolling.current = false;
        }, 100);
    }, [findCenterCuisine, onSelect, scrollToCuisine]);

    const handleMomentumScrollEnd = useCallback((event: any) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const centeredCuisine = findCenterCuisine(scrollX);
        
        if (centeredCuisine) {
            onSelect(centeredCuisine.slug);
            scrollToCuisine(centeredCuisine.slug, true);
        }
        
        isScrolling.current = false;
    }, [findCenterCuisine, onSelect, scrollToCuisine]);

    const handleCuisinePress = (slug: string, _index: number) => {
        onSelect(slug);
        scrollToCuisine(slug, true);
    };

    const handleLayout = (slug: string, event: { nativeEvent: { layout: { x: number; width: number } } }) => {
        const { x, width } = event.nativeEvent.layout;
        setItemLayouts(prev => ({ ...prev, [slug]: { x, width } }));
    };

    // Auto-center on initial load
    useEffect(() => {
        if (isInitialLoad && selectedSlug && itemLayouts[selectedSlug]) {
            setTimeout(() => {
                scrollToCuisine(selectedSlug, false);
                setIsInitialLoad(false);
            }, 100);
        }
    }, [selectedSlug, itemLayouts, isInitialLoad, scrollToCuisine]);

    // Re-center when selectedSlug changes (after initial load)
    useEffect(() => {
        if (!isInitialLoad && selectedSlug && itemLayouts[selectedSlug] && !isScrolling.current) {
            scrollToCuisine(selectedSlug, true);
        }
    }, [selectedSlug, itemLayouts, isInitialLoad, scrollToCuisine]);

    return (
        <View marginBottom="m" marginTop="l">
            <View style={{ position: 'relative' }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingHorizontal: SCREEN_WIDTH / 2,
                    }}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    onScroll={handleScroll}
                    onScrollBeginDrag={handleScrollBeginDrag}
                    onScrollEndDrag={handleScrollEndDrag}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    scrollEventThrottle={16}
                >
                    {cuisines.map((item, index) => (
                        <CuisineChip
                            key={item.id}
                            item={item}
                            isSelected={selectedSlug === item.slug}
                            onPress={() => handleCuisinePress(item.slug, index)}
                            onLayout={(event) => handleLayout(item.slug, event)}
                        />
                    ))}
                </ScrollView>
                
                {/* Fixed T-shaped pointer - stays in center */}
                <View
                    style={{
                        position: 'absolute',
                        left: SCREEN_WIDTH / 2,
                        bottom: 0,
                        width: 2,
                        height: 40,
                        backgroundColor: theme.colors.textPrimary,
                        transform: [{ translateX: -1 }],
                        zIndex: 10,
                    }}
                />
            </View>
        </View>
    );
});

const CuisineChip = memo(({ item, isSelected, onPress, onLayout }: {
    item: { id: string; name: string; slug: string };
    isSelected: boolean;
    onPress: () => void;
    onLayout: (event: { nativeEvent: { layout: { x: number; width: number } } }) => void;
}) => {
    const scale = useSharedValue(isSelected ? 1 : 0.95);

    useEffect(() => {
        scale.value = withSpring(isSelected ? 1 : 0.95, {
            damping: 15,
            stiffness: 150,
        });
    }, [isSelected, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity 
            onPress={onPress}
            onLayout={onLayout}
            activeOpacity={0.7}
            style={{ marginHorizontal: 20 }}
        >
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        paddingHorizontal: 4,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                <Text
                    fontSize={isSelected ? 32 : 20}
                    fontWeight={isSelected ? "600" : "400"}
                    color={isSelected ? "textPrimary" : "textSecondary"}
                    fontFamily={isSelected ? "Poppins-SemiBold" : "Poppins-Regular"}
                    style={{ opacity: isSelected ? 1 : 0.5 }}
                >
                    {item.name}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
});

const CuisineDetail = () => {
    const [selectedCuisine, setSelectedCuisine] = useState<CuisineItem | null>(null);
    const [selectedSlug, setSelectedSlug] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [allCuisines] = useState(getAllCuisines());
    const [allMenuItems] = useState(mockCuisineData.flatMap(cuisine => 
        cuisine.menuItems.map(item => ({
            ...item,
            cuisineId: cuisine.id,
            cuisineName: cuisine.name,
            cuisineSlug: cuisine.slug,
        })),
    ));
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const fadeAnim = useSharedValue(1);

    const handleCuisineSelect = useCallback((slug: string) => {
        if (slug === selectedSlug) return;
        
        // Fade out animation
        fadeAnim.value = withTiming(0, { duration: 150 });
        
        // Update cuisine after fade out
        setTimeout(() => {
            setSelectedSlug(slug);
            const cuisine = mockCuisineData.find(c => c.slug === slug);
            setSelectedCuisine(cuisine || null);
            
            // Fade in animation
            fadeAnim.value = withTiming(1, { duration: 150 });
        }, 150);
    }, [selectedSlug, fadeAnim]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleSearchPress = useCallback(() => {
        // Trigger immediate search if user presses search button
    }, []);

    const filteredMenuItems = useMemo(() => {
        let items = selectedSlug 
            ? allMenuItems.filter(item => item.cuisineSlug === selectedSlug)
            : allMenuItems;

        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase().trim();
            items = items.filter(item => {
                const name = item.name?.toLowerCase() || '';
                const description = item.description?.toLowerCase() || '';
                return name.includes(query) || description.includes(query);
            });
        }

        return items;
    }, [selectedSlug, allMenuItems, debouncedSearchQuery]);

    const transformedMenuItems = filteredMenuItems.map(item => ({
        id: item.id,
        title: item.name,
        price: `₹${item.price}`,
        pricePaise: item.price * 100,
        image: { uri: item.image },
        description: item.description,
        isFavourite: false,
    }));

    useEffect(() => {
        if (allCuisines.length > 0 && !selectedSlug) {
            const firstCuisine = allCuisines[0];
            setSelectedSlug(firstCuisine.slug);
            const cuisine = mockCuisineData.find(c => c.slug === firstCuisine.slug);
            setSelectedCuisine(cuisine || null);
        }
    }, [allCuisines, selectedSlug]);

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
                onHeartPress={() => undefined}
            />
        </View>
    ), []);

    const animatedContentStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    return (
        <SafeAreaView style={{  flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
            <ScreenHeader title="Cuisines" moreAction={false} />
            <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                onSearchPress={handleSearchPress}
            />

            <CuisineSelector
                cuisines={allCuisines}
                selectedSlug={selectedSlug}
                onSelect={handleCuisineSelect}
            />

            {/* Menu Items Grid with Fade Animation */}
            <Animated.View style={[styles.container, { flex: 1 }, animatedContentStyle]}>
                {selectedCuisine && (
                    <Text
                        fontSize={18}
                        fontWeight="bold"
                        color="textPrimary"
                        fontFamily="Poppins-Bold"
                        marginBottom="m"
                    >
                        {selectedCuisine.name} Menu
                    </Text>
                )}
                
                <FlatList
                    data={transformedMenuItems}
                    renderItem={renderFoodItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ justifyContent: 'flex-start' }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    key={selectedSlug} // Force re-render on cuisine change
                />
            </Animated.View>
        </SafeAreaView>
    );
};

export default CuisineDetail;

SearchBar.displayName = 'SearchBar';
CuisineSelector.displayName = 'CuisineSelector';
CuisineChip.displayName = 'CuisineChip';