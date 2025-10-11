import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import { Text, View } from "../components/ui";
import { betterwayApiCall } from "../network/useApiPort";
import { addToCart, updateCartItem } from "../store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import theme from "../theme/theme";
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
  }>();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

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

    const currentCartItem = cartItems.find(ci => String(ci.id) === String(params.itemId));
    const currentQuantity = currentCartItem?.quantity || 0;

    try {
      let imageSource: ImageSourcePropType;
      if (params.image && params.image.trim() !== '') {
        imageSource = { uri: params.image };
      } else {
        imageSource = require('@/assets/images/bowl.png');
      }

      if (currentQuantity === 0) {
        await dispatch(addToCart({
          id: params.itemId,
          name: params.name,
          price: params.price,
          pricePaise: parseInt(params.pricePaise),
          image: imageSource,
          description: params.description,
        }, token));
        
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
  }, [token, params, quantity, cartItems, dispatch]);

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
                      {params.price}
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

                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="xl"
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
