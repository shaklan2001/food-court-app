import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, router } from "expo-router";
import { MotiView } from "moti";
import { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CouponBottomSheet from "../components/CouponBottomSheet";
import SuccessModal from "../components/SuccessModal";
import { Text, View } from "../components/ui";
import {
  applyCoupon,
  fetchCart,
  processPayment,
  removeCoupon,
  updateCartItem,
} from "../store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { BackIcon, MoreIcon } from "../utils/Svgs";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { Card } from "./(tabs)/(home)";
import { Coupon } from "./all-coupons";

const RadioButton = memo(
  ({
    selected,
    onPress,
    label,
  }: {
    selected: boolean;
    onPress: () => void;
    label: string;
  }) => {
    return (
      <Pressable onPress={onPress} style={styles.radioButtonContainer}>
        <View
          width={20}
          height={20}
          borderRadius="xxl"
          borderWidth={2}
          borderColor="primary"
          backgroundColor={selected ? "primary" : "transparent"}
          justifyContent="center"
          alignItems="center"
          marginRight="s"
        >
          {selected && (
            <View
              width={8}
              height={8}
              borderRadius="xxl"
              backgroundColor="mainBackground"
            />
          )}
        </View>
        <Text
          fontSize={14}
          fontWeight="500"
          color="textPrimary"
          fontFamily="Poppins-Medium"
        >
          {label}
        </Text>
      </Pressable>
    );
  },
);

RadioButton.displayName = "RadioButton";

const CartItem = memo(
  ({
    name,
    price,
    quantity,
    onIncrease,
    onDecrease,
    image,
  }: {
    name: string;
    price: string;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    image?: string | number;
  }) => {
    return (
      <View width="100%">
        <View
          flexDirection="row"
          marginBottom="l"
          borderRadius="s"
          alignItems="center"
          width="100%"
        >
          <Image
            source={image || require("@/assets/images/bowl.png")}
            style={styles.cartItemImage}
          />
          <View
            marginLeft="m"
            justifyContent="space-between"
            height={100}
            width="70%"
          >
            <Text
              fontSize={Platform.OS === "ios" ? 16 : 14}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="xs"
              lineHeight={Platform.OS === "ios" ? 18 : 16}
            >
              {name}
            </Text>
            <View
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <View>
                <Text
                  fontSize={Platform.OS === "ios" ? 16 : 14}
                  fontWeight="600"
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                >
                  {price}
                </Text>
              </View>
              <View flexDirection="row">
                <TouchableOpacity
                  onPress={onDecrease}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove" size={18} color="#A20538" />
                </TouchableOpacity>
                <Text
                  fontSize={16}
                  fontWeight="600"
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                  textAlign="center"
                  paddingHorizontal="m"
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={onIncrease}
                  style={styles.quantityButtonAdd}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          borderTopWidth={1}
          style={{ borderTopColor: "#D3D3D3" }}
          paddingBottom={"l"}
        />
      </View>
    );
  },
);

CartItem.displayName = "CartItem";

const PriceRow = memo(
  ({
    label,
    value,
    isDiscount = false,
    showIcon = false,
  }: {
    label: string;
    value: string;
    isDiscount?: boolean;
    showIcon?: boolean;
  }) => {
    return (
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="s"
      >
        <View flexDirection="row" alignItems="center">
          {showIcon && (
            <View
              width={16}
              height={16}
              borderRadius="s"
              backgroundColor="success"
              justifyContent="center"
              alignItems="center"
              marginRight="s"
            >
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
          )}
          <Text
            fontSize={14}
            fontWeight="300"
            color="textPrimary"
            fontFamily="Poppins-Regular"
          >
            {label}
          </Text>
        </View>
        <Text
          fontSize={14}
          fontWeight="600"
          color={isDiscount ? "success" : "textPrimary"}
          fontFamily="Poppins-SemiBold"
        >
          {value}
        </Text>
      </View>
    );
  },
);

PriceRow.displayName = "PriceRow";

const EmptyCart = memo(() => {
  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: 400 }}
    >
      <Feather name="shopping-cart" size={80} color="#D3D3D3" />
      <Text
        fontSize={18}
        fontWeight="600"
        color="buttonPrimary"
        fontFamily="Poppins-SemiBold"
        marginTop="l"
        marginBottom="s"
      >
        Your Cart is Empty
      </Text>
      <Text
        fontSize={14}
        fontWeight="400"
        color="textSecondary"
        fontFamily="Poppins-Regular"
        textAlign="center"
        lineHeight={20}
        opacity={0.8}
      >
        Add some delicious items to get started!
      </Text>
    </View>
  );
});

EmptyCart.displayName = "EmptyCart";

const CartLoadingSkeleton = memo(() => {
  return (
    <View>
      <MotiView
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
          repeatReverse: true,
        }}
      >
        <View
          height={25}
          width={180}
          borderRadius="s"
          style={{ borderRadius: 6, backgroundColor: "#E5E5E5" }}
          marginBottom="xl"
        />
      </MotiView>
      <View>
        {[1, 2, 3, 4, 5].map((index) => (
          <View key={index}>
            <MotiView
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "timing",
                duration: 1000,
                delay: index * 100,
                loop: true,
                repeatReverse: true,
              }}
            >
              <View
                flexDirection="row"
                marginBottom="l"
                borderRadius="s"
                alignItems="center"
              >
                <MotiView
                  from={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "timing",
                    duration: 1000,
                    delay: index * 100 + 200,
                    loop: true,
                    repeatReverse: true,
                  }}
                  style={styles.skeletonImage}
                />
                <View
                  marginLeft="m"
                  justifyContent="space-between"
                  height={100}
                  width="60%"
                >
                  <MotiView
                    from={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "timing",
                      duration: 1000,
                      delay: index * 100 + 300,
                      loop: true,
                      repeatReverse: true,
                    }}
                    style={styles.skeletonText}
                  />
                  <View
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <MotiView
                      from={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        type: "timing",
                        duration: 1000,
                        delay: index * 100 + 400,
                        loop: true,
                        repeatReverse: true,
                      }}
                      style={styles.skeletonPrice}
                    />
                    <View flexDirection="row">
                      <MotiView
                        from={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "timing",
                          duration: 1000,
                          delay: index * 100 + 500,
                          loop: true,
                          repeatReverse: true,
                        }}
                        style={styles.skeletonButton}
                      />
                      <MotiView
                        from={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "timing",
                          duration: 1000,
                          delay: index * 100 + 600,
                          loop: true,
                          repeatReverse: true,
                        }}
                        style={styles.skeletonQuantity}
                      />
                      <MotiView
                        from={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "timing",
                          duration: 1000,
                          delay: index * 100 + 700,
                          loop: true,
                          repeatReverse: true,
                        }}
                        style={styles.skeletonButton}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </MotiView>
            <View
              borderTopWidth={1}
              style={{ borderTopColor: "#D3D3D3" }}
              paddingBottom={"l"}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

CartLoadingSkeleton.displayName = "CartLoadingSkeleton";

const DiscountCoupon = memo(
  ({
    appliedCoupon,
    onRemoveCoupon,
    onViewAllCoupons,
  }: {
    appliedCoupon: Coupon | null;
    onRemoveCoupon: () => void;
    onViewAllCoupons: () => void;
  }) => {
    return (
      <View paddingHorizontal={"l"} marginBottom="l">
        <View
          backgroundColor="mainBackground"
          borderRadius="m"
          padding="m"
          borderWidth={1}
          borderColor="border"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.1}
          shadowRadius={2}
          shadowColor="textPrimary"
          elevation={1}
        >
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="s"
            paddingVertical="xs"
          >
            <View flexDirection="row" alignItems="center" gap="s">
              {appliedCoupon && <View
                width={22}
                height={22}
                borderRadius="xxl"
                backgroundColor={"couponIconBg"}
                justifyContent="center"
                alignItems="center"
                marginLeft="s"
              >
                <FontAwesome name="check" size={14} color="white" />
              </View>}
              <Text
                fontSize={16}
                fontWeight="600"
                color="couponIconBg"
                fontFamily="Poppins-SemiBold"
                textAlign="center"
              >
                {appliedCoupon
                  ? `Upto ${appliedCoupon.discountPercent}% OFF applied`
                  : "No coupon applied"}
              </Text>
            </View>
            <Pressable onPress={onRemoveCoupon}>
            <View
              width={22}
              height={22}
              borderRadius="s"
              backgroundColor={
                appliedCoupon ? "couponSuccessBg" : "transparent"
              }
              justifyContent="center"
              alignItems="center"
              marginLeft="s"
              borderWidth={1}
              borderColor={appliedCoupon ? "couponSuccessBg" : "textSecondary"}
            >
              {appliedCoupon && (
                <FontAwesome name="check" size={14} color="white" />
              )}
            </View>
            </Pressable>
          </View>

          <View height={1} backgroundColor="border" marginVertical="xs" />

          <Pressable onPress={onViewAllCoupons}>
            <View flexDirection="row" alignItems="center" justifyContent="space-between" gap="s">
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              paddingVertical="xs"
              gap="s"
            >
              <MaterialCommunityIcons name="brightness-percent" size={24} color="black" />
              <Text
                fontSize={16}
                fontWeight="600"
                color="couponIconBg"
                fontFamily="Poppins-SemiBold"
                textAlign="center"
              >
                View all coupons
              </Text>
            </View>
            <Ionicons name="caret-forward" size={24} color="black" />
            </View>
          </Pressable>
        </View>
      </View>
    );
  },
);

DiscountCoupon.displayName = "DiscountCoupon";

export const ScreenHeader = ({
  title,
  moreAction = true,
}: {
  title: string;
  moreAction?: boolean;
}) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={pageHorizantalPadding}
      paddingBottom="l"
      backgroundColor="mainBackgroundLight"
    >
      <Pressable onPress={() => router.back()}>
        <Card>
          <BackIcon />
        </Card>
      </Pressable>

      <Text
        fontSize={22}
        fontWeight="bold"
        color="textPrimary"
        fontFamily="Poppins-Bold"
      >
        {title}
      </Text>

      <Pressable style={{ opacity: moreAction ? 1 : 0 }}>
        <Card>
          <MoreIcon />
        </Card>
      </Pressable>
    </View>
  );
};

const Cart = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const {
    items: cartItems,
    total: cartTotal,
    loading,
    paymentLoading,
    paymentSuccess,
    appliedCoupon,
    discountAmount,
  } = useAppSelector((state: RootState) => state.cart);
  const [selectedOption, setSelectedOption] = useState<"orderNow" | "takeaway">(
    "orderNow",
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCouponBottomSheet, setShowCouponBottomSheet] = useState(false);

  const subtotal = cartTotal / 100;
  const walletCoins = 0;
  const deliveryFee = 0;
  const couponDiscount = discountAmount / 100;
  const total = subtotal - walletCoins + deliveryFee - couponDiscount;

  useEffect(() => {
    if (token) {
      dispatch(fetchCart(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (paymentSuccess) {
      setShowSuccessModal(true);
    }
  }, [paymentSuccess]);

  const handleOrderNowPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption("orderNow");
  }, []);

  const handleTakeawayPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption("takeaway");
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    router.push("/(tabs)/(home)/");
  }, []);

  const handleViewAllCoupons = useCallback(() => {
    setShowCouponBottomSheet(true);
  }, []);

  const handleCouponSelect = useCallback(
    (coupon: Coupon) => {
      dispatch(applyCoupon(coupon));
    },
    [dispatch],
  );

  const handleCloseCouponBottomSheet = useCallback(() => {
    setShowCouponBottomSheet(false);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    dispatch(removeCoupon());
  }, [dispatch]);

  const handlePlaceOrder = useCallback(async () => {
    if (!token) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const userDetails = {
        name: user?.name || "Customer",
        email: user?.email || "",
        contact: user?.phone || "",
      };

      const orderType =
        selectedOption === "orderNow" ? "order_now" : "takeaway";
      const deliveryAddress =
        selectedOption === "orderNow"
          ? "Food Court Location"
          : "Takeaway Counter";
      await dispatch(
        processPayment(userDetails, orderType, deliveryAddress, token),
      );
    } catch (error: unknown) {
      console.log("❌ Payment process failed:", error);
    }
  }, [token, cartItems, user, selectedOption, dispatch]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="Cart" />
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {cartItems.length > 0 && (
              <View paddingHorizontal={"l"}>
                <Text
                  fontSize={12}
                  fontWeight="400"
                  color="textSecondary"
                  fontFamily="Poppins-Regular"
                  opacity={0.8}
                >
                  Choose your preferred option below
                </Text>
                <View flexDirection="row">
                  <RadioButton
                    selected={selectedOption === "orderNow"}
                    onPress={handleOrderNowPress}
                    label="Order Now"
                  />
                  <RadioButton
                    selected={selectedOption === "takeaway"}
                    onPress={handleTakeawayPress}
                    label="Takeaway"
                  />
                </View>
              </View>
            )}

            <View paddingHorizontal={"l"} mt="l">
              {loading ? (
                <CartLoadingSkeleton />
              ) : cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    onIncrease={() =>
                      token &&
                      dispatch(
                        updateCartItem(item.id, item.quantity + 1, token),
                      )
                    }
                    onDecrease={() =>
                      token &&
                      dispatch(
                        updateCartItem(item.id, item.quantity - 1, token),
                      )
                    }
                  />
                ))
              ) : (
                <EmptyCart />
              )}
            </View>

            {cartItems.length > 0 && (
              <>
                <DiscountCoupon
                  appliedCoupon={appliedCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  onViewAllCoupons={handleViewAllCoupons}
                />
                <View
                  marginHorizontal={pageHorizantalPadding}
                  marginBottom="l"
                  borderRadius="m"
                >
                  <PriceRow
                    label="Subtotal:"
                    value={`₹${subtotal.toFixed(0)}`}
                  />
                  {walletCoins > 0 && (
                    <PriceRow
                      label="Wallet Coins"
                      value={`-₹${walletCoins}`}
                      showIcon
                    />
                  )}
                  {deliveryFee > 0 && (
                    <PriceRow label="Delivery Fee:" value={`₹${deliveryFee}`} />
                  )}
                  {appliedCoupon && couponDiscount > 0 && (
                    <>
                      <PriceRow
                        label={`Coupon (${appliedCoupon.code}):`}
                        value={`-₹${couponDiscount.toFixed(0)}`}
                        isDiscount
                        showIcon
                      />
                      <Text
                        fontSize={10}
                        fontWeight="400"
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        marginBottom="s"
                      >
                        {appliedCoupon.discountPercent}% OFF up to ₹
                        {(appliedCoupon.maxDiscountPaise / 100).toFixed(0)}
                      </Text>
                    </>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          {cartItems.length > 0 && (
            <View
              backgroundColor="primary"
              paddingHorizontal={pageHorizantalPadding}
              paddingVertical="m"
            >
              <Pressable
                style={[
                  styles.checkoutButton,
                  {
                    opacity: paymentLoading || cartItems.length === 0 ? 0.6 : 1,
                  },
                ]}
                onPress={handlePlaceOrder}
                disabled={paymentLoading || cartItems.length === 0}
              >
                <View
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  borderRightWidth={1}
                  borderRightColor="border"
                  height="100%"
                >
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textOnPrimary"
                    fontFamily="Poppins-SemiBold"
                  >
                    ₹{total.toFixed(0)}
                  </Text>
                </View>
                <View
                  flex={2}
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textOnPrimary"
                    fontFamily="Poppins-SemiBold"
                  >
                    {paymentLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : paymentSuccess ? (
                      "Success!"
                    ) : (
                      "Place Order"
                    )}
                  </Text>
                  {!paymentLoading && !paymentSuccess && (
                    <Ionicons
                      style={{ marginTop: 4 }}
                      name="chevron-forward"
                      size={20}
                      color="#FFFFFF"
                    />
                  )}
                  {paymentLoading && (
                    <Ionicons
                      style={{ marginTop: 4 }}
                      name="hourglass-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  )}
                  {paymentSuccess && (
                    <Ionicons
                      style={{ marginTop: 4 }}
                      name="checkmark"
                      size={20}
                      color="#FFFFFF"
                    />
                  )}
                </View>
              </Pressable>
            </View>
          )}

          {showSuccessModal && (
            <SuccessModal
              visible={showSuccessModal}
              onClose={handleSuccessModalClose}
              title="Successful"
              message="Congratulations your order is accepted."
              buttonText="Checkout"
            />
          )}

          {showCouponBottomSheet && (
            <CouponBottomSheet
              visible={showCouponBottomSheet}
              onClose={handleCloseCouponBottomSheet}
              onCouponSelect={handleCouponSelect}
              cartTotal={cartTotal}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  cartItemImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A20538",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonAdd: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#A20538",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutButton: {
    backgroundColor: "#A20538",
    borderRadius: 12,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  skeletonImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E5E5E5", // Using gray200 from theme
  },
  skeletonText: {
    width: "80%",
    height: 18,
    backgroundColor: "#E5E5E5", // Using gray200 from theme
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonPrice: {
    width: 70,
    height: 16,
    backgroundColor: "#E5E5E5", // Using gray200 from theme
    borderRadius: 4,
  },
  skeletonButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
  },
  skeletonQuantity: {
    width: 40,
    height: 32,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    marginHorizontal: 8,
  },
});

export default Cart;
