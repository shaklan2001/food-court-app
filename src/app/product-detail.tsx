import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/HomePage/Card";
import Checkbox from "../components/shared/Checkbox";
import { Text, View } from "../components/ui";
import { betterwayApiCall } from "../network/useApiPort";
import { addToCart, updateCartItem } from "../store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import theme from "../theme/theme";
import { AddonItem, CustomizationPayload, VariationOption } from "../types/customization";
import { showToast } from "../utils";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { BackIcon, HeartFilledIcon, HeartIcon } from "../utils/Svgs";

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ 
    itemId: string;
    name: string;
    price: string;
    pricePaise: string;
    description: string;
    image: string;
    isCustomizable: string;
    customization: string;
  }>();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customData, setCustomData] = useState<CustomizationPayload | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<VariationOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Map<string, AddonItem[]>>(new Map());

  useEffect(() => {
    const initializeProductDetails = async () => {
      if (!token || !params.itemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const cartItem = cartItems.find(ci => String(ci.id) === String(params.itemId));
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }

        const favResponse = await betterwayApiCall({
          method: "GET",
          url: "GET_FAVOURITES",
          auth: token,
        });

        if (favResponse && typeof favResponse === 'object' && 'items' in favResponse) {
          const favItems = (favResponse as { items: { dishId?: string; id?: string }[] }).items;
          const isFavorited = favItems.some(
            (fav) => (fav.dishId || fav.id) === params.itemId,
          );
          setIsLiked(isFavorited);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeProductDetails();
  }, [params.itemId, token, cartItems]);

  useEffect(() => {
    if (params.isCustomizable === '1' && params.customization) {
      try {
        const decoded = decodeURIComponent(params.customization);
        const parsed: CustomizationPayload = JSON.parse(decoded);
        setCustomData(parsed);
      } catch {
        setCustomData(null);
      }
    }
  }, [params.isCustomizable, params.customization]);

  useEffect(() => {
    if (customData && customData.variations.length > 0 && !selectedVariation) {
      setSelectedVariation(customData.variations[0]);
    }
  }, [customData, selectedVariation]);

  const toggleAddon = (groupId: string, item: AddonItem) => {
    setSelectedAddons(prev => {
      const newMap = new Map(prev);
      const customization = customData;
      if (!customization) {
        return prev;
      }
      const group = customization.addons.find(g => g.id === groupId);
      if (!group) {
        return prev;
      }
      const groupSelected = newMap.get(groupId) || [];

      if (group.maxSelection === 1) {
        if (groupSelected.some(s => s.id === item.id)) {
          newMap.delete(groupId);
        } else {
          newMap.set(groupId, [item]);
        }
      } else {
        if (groupSelected.some(s => s.id === item.id)) {
          const filtered = groupSelected.filter(s => s.id !== item.id);
          if (filtered.length === 0) {
            newMap.delete(groupId);
          } else {
            newMap.set(groupId, filtered);
          }
        } else {
          if (groupSelected.length >= group.maxSelection && group.maxSelection > 0) {
            return prev;
          }
          newMap.set(groupId, [...groupSelected, item]);
        }
      }
      return newMap;
    });
  };

  const totalPricePaise = useMemo(() => {
    let base = parseInt(params.pricePaise) || 0;
    if (customData) {
      if (customData.variations.length > 0 && selectedVariation) {
        base = selectedVariation.pricePaise;
      } else {
        base = customData.basePricePaise;
      }
      const addonsSum = Array.from(selectedAddons.values()).reduce((sum, items) => sum + items.reduce((s, i) => s + i.pricePaise, 0), 0);
      base += addonsSum;
    }
    return base;
  }, [customData, selectedVariation, selectedAddons, params.pricePaise]);

  const handleClosePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const handleHeartPress = useCallback(async () => {
    if (!token || !params.itemId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (isLiked) {
        // Remove from favorites
        await betterwayApiCall({
          method: "DELETE",
          url: "REMOVE_FROM_FAVOURITE",
          auth: token,
          body: {
            dishId: params.itemId,
          },
        });
        
        setIsLiked(false);
        showToast({
          message: 'Removed from favorites',
          type: 'success',
        });
      } else {
        await betterwayApiCall({
          method: "POST",
          url: "ADD_TO_FAVOURITE",
          auth: token,
          body: {
            dishId: params.itemId,
          },
        });
        
        setIsLiked(true);
      }
    } catch {
      showToast({
        message: isLiked ? 'Failed to remove from favorites' : 'Failed to add to favorites',
        type: 'error',
      });
    }
  }, [token, params.itemId, isLiked]);

  const handleQuantityIncrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => prev + 1);
  }, []);

  const handleQuantityDecrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleConfirmPress = useCallback(async () => {
    if (!token || !params.itemId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (customData) {
      const errors = [];
      if (customData.variations.length > 0 && !selectedVariation) {
        errors.push('Please select a variation');
      }
      customData.addons.forEach((group) => {
        const selectedCount = selectedAddons.get(group.id)?.length || 0;
        if (selectedCount < group.minSelection) {
          errors.push(`Please select at least ${group.minSelection} options for ${group.name}`);
        }
        if (group.maxSelection > 0 && selectedCount > group.maxSelection) {
          errors.push(`Please select at most ${group.maxSelection} options for ${group.name}`);
        }
      });
      if (errors.length > 0) {
        showToast({ message: errors[0], type: 'error' });
        return;
      }
    }

    const currentCartItem = cartItems.find(ci => String(ci.id) === String(params.itemId));
    const currentQuantity = currentCartItem?.quantity || 0;

    try {
      let imageSource: ImageSourcePropType;
      if (params.image && params.image.trim() !== '') {
        imageSource = { uri: params.image };
      } else {
        imageSource = require('@/assets/images/bowl.png');
      }

      const item = {
        id: params.itemId,
        name: params.name,
        price: `₹${(totalPricePaise / 100).toFixed(2)}`,
        pricePaise: totalPricePaise,
        image: imageSource,
        description: params.description,
      };

      if (currentQuantity === 0) {
        await dispatch(addToCart(item, token));
        if (quantity > 1) {
          await dispatch(updateCartItem(params.itemId, quantity, token));
        }
      } else {
        await dispatch(updateCartItem(params.itemId, quantity, token));
      }

      showToast({
        message: 'Added to cart successfully',
        type: 'success',
      });
      
      router.back();
    } catch {
      showToast({
        message: 'Failed to add to cart',
        type: 'error',
      });
    }
  }, [token, params, quantity, cartItems, dispatch, customData, selectedVariation, selectedAddons, totalPricePaise]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
          <View flex={1} backgroundColor="mainBackground" justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text fontSize={16} color="textPrimary" marginTop="m" fontFamily="Poppins-Medium">
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const imageSource: ImageSourcePropType = params.image && params.image.trim() !== '' 
    ? { uri: params.image }
    : require('@/assets/images/bowl.png');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundLight }}>
        <View flex={1} backgroundColor="mainBackgroundLight">
          <View position="relative" height={360}>
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
            />

            <View position="absolute" top={20} left={20}>
              <TouchableOpacity onPress={handleClosePress}>
                <Card>
                  <BackIcon />
                </Card>
              </TouchableOpacity>
            </View>
          </View>

          <View
            flex={1}
            backgroundColor="mainBackground"
            borderTopLeftRadius="l"
            borderTopRightRadius="l"
            paddingTop="l"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View paddingHorizontal={pageHorizantalPadding}>
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  marginBottom="m"
                >
                  <View flex={1} marginRight="m">
                    <Text
                      fontSize={32}
                      fontWeight="bold"
                      color="textPrimary"
                      fontFamily="Poppins-Bold"
                      lineHeight={40}
                      marginBottom="xs"
                    >
                      {params.name}
                    </Text>
                    <Text
                      fontSize={20}
                      fontWeight="600"
                      color="textPrimary"
                      fontFamily="Poppins-SemiBold"
                      lineHeight={28}
                      marginTop="xs"
                    >
                      ₹{(totalPricePaise / 100).toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={handleHeartPress}>
                    <Card>{isLiked ? <HeartFilledIcon /> : <HeartIcon />}</Card>
                  </TouchableOpacity>
                </View>

                <View marginTop="l" marginBottom="l">
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    lineHeight={24}
                    marginBottom="m"
                  >
                    Description
                  </Text>
                  <Text
                    fontSize={15}
                    fontWeight="400"
                    color="textSecondary"
                    fontFamily="Poppins-Regular"
                    lineHeight={24}
                  >
                    {params.description || 'No description available.'}
                  </Text>
                </View>

                {customData && (
                  <View marginTop="l" marginBottom="l">
                    {customData.variations.length > 0 && (
                      <View marginBottom="l">
                        <Text fontSize={18} fontWeight="600" color="textPrimary" fontFamily="Poppins-SemiBold" marginBottom="s">
                          Choose {customData.variations[0].groupName || 'Variation'}
                        </Text>
                        {customData.variations.map((option) => (
                          <TouchableOpacity 
                            key={option.id} 
                            onPress={() => setSelectedVariation(option)}
                          >
                            <View flexDirection="row" alignItems="center" marginBottom="s">
                              <Checkbox 
                                label="" 
                                checked={selectedVariation?.id === option.id} 
                                onToggle={() => setSelectedVariation(option)} 
                              />
                              <Text marginLeft="s" flex={1} fontSize={16}>{option.name}</Text>
                              <Text fontSize={16}>₹{(option.pricePaise / 100).toFixed(2)}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {customData.addons.map((group) => (
                      <View key={group.id} marginBottom="l">
                        <Text fontSize={18} fontWeight="600" color="textPrimary" fontFamily="Poppins-SemiBold" marginBottom="s">
                          {group.name} (Select {group.minSelection} - {group.maxSelection})
                        </Text>
                        {group.items.map((item) => (
                          <Pressable 
                            key={item.id} 
                            onPress={() => toggleAddon(group.id, item)} 
                          >
                            <View flexDirection="row" alignItems="center" marginBottom="s" justifyContent="space-between">
                              <Text marginLeft="s" flex={1} fontSize={16}>{item.name}</Text>
                              <Checkbox 
                                label="" 
                                checked={selectedAddons.get(group.id)?.some((s) => s.id === item.id) || false} 
                                onToggle={() => toggleAddon(group.id, item)} 
                              />
                              {item.pricePaise > 0 && <Text fontSize={16}>+ ₹{(item.pricePaise / 100).toFixed(2)}</Text>}
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="xl"
                  paddingVertical="s"
                >
                  <TouchableOpacity
                    onPress={handleQuantityDecrease}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>

                  <Text
                    fontSize={20}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    marginHorizontal="xl"
                    minWidth={50}
                    textAlign="center"
                  >
                    {quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={handleQuantityIncrease}
                    style={styles.quantityButtonAdd}
                  >
                    <Ionicons name="add" size={20} color={theme.colors.textOnPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View
              backgroundColor="mainBackgroundLight"
              paddingHorizontal={pageHorizantalPadding}
              paddingVertical="m"
            >
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmPress}
              >
                <View
                  flex={1}
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  gap="m"
                >
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textOnPrimary"
                    fontFamily="Poppins-SemiBold"
                  >
                    Confirm
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: "100%",
    height: "100%",
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadii.m,
    borderWidth: 1.5,
    borderColor: theme.colors.buttonSecondary,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonAdd: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
});

export default ProductDetail;
