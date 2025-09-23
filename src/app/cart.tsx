import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import SuccessModal from "../components/SuccessModal";
import { Text, View } from "../components/ui";
import { fetchCart, processPayment, updateCartItem } from "../store/slices/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { BackIcon, MoreIcon } from "../utils/Svgs";
import { Card } from "./(tabs)/(home)";

const RadioButton = memo(({
  selected,
  onPress,
  label
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.radioButtonContainer}
    >
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
});

const CartItem = memo(({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  image
}: {
  name: string;
  price: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  image?: any;
}) => {
  return (
    <View>
      <View
        flexDirection="row"
        marginBottom="l"
        borderRadius="s"
        alignItems="center"
      >
        <Image
          source={image || require('@/assets/images/bowl.png')}
          style={styles.cartItemImage}
        />
        <View marginLeft="m" justifyContent="space-between" height={100} width="60%">
          <Text
            fontSize={Platform.OS === 'ios' ? 16 : 12}
            fontWeight="600"
            color="textPrimary"
            fontFamily="Poppins-SemiBold"
            marginBottom="xs"
            lineHeight={Platform.OS === 'ios' ? 18 : 12}
          >
            {name}
          </Text>
          <View flexDirection="row" justifyContent="space-between" alignItems="center" width="100%"> 
            <View>
              <Text
                fontSize={Platform.OS === 'ios' ? 16 : 12}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
              >
                {price}
              </Text>
            </View>
          <View flexDirection="row" >
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
      <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} paddingBottom={'l'}>
      </View>
    </View>
  );
});

const PriceRow = memo(({
  label,
  value,
  isDiscount = false,
  showIcon = false
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
});

const DiscountCoupon = memo(({
  promocode,
  onPress
}: {
  promocode: string;
  onPress: () => void;
}) => {
  return (
    <View paddingHorizontal={pageHorizantalPadding} marginBottom="l">
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
        elevation={2}
      >
        <Text
          fontSize={11}
          fontWeight="400"
          color="textSecondary"
          fontFamily="Poppins-Regular"
          marginBottom="xs"
        >
          Promocode
        </Text>
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize={16}
            fontWeight="600"
            color="textPrimary"
            fontFamily="Poppins-SemiBold"
          >
            {promocode}
          </Text>
          <View
            width={24}
            height={24}
            borderRadius="s"
            backgroundColor="success"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </View>
  );
});

export const ScreenHeader = ({ title, moreAction = true }: { title: string, moreAction?: boolean }) => {
  return (
    <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={pageHorizantalPadding}
          paddingTop="xl"
          paddingBottom="l"
          backgroundColor="mainBackgroundLight"
        >
          <Pressable onPress={() => router.back()}>
            <Card>
              <BackIcon />
            </Card>
          </Pressable>

          <Text
            fontSize={18}
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
  )
}

const Cart = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const { 
    items: cartItems, 
    total: cartTotal, 
    loading, 
    paymentLoading, 
    paymentSuccess, 
    paymentError 
  } = useAppSelector((state: RootState) => state.cart);
  const [selectedOption, setSelectedOption] = useState<'orderNow' | 'takeaway'>('orderNow');
  const [promocode, setPromocode] = useState('TASTY12');
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  
  const subtotal = cartTotal / 100;
  const walletCoins = 0;
  const deliveryFee = 0;
  const discount = 0;
  const total = subtotal - walletCoins + deliveryFee - (subtotal * discount / 100);

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
    setSelectedOption('orderNow');
  }, []);

  const handleTakeawayPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption('takeaway');
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    router.push('/(tabs)/(home)/');
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!token) {
      console.log('❌ No authentication token available');
      return;
    }

    if (cartItems.length === 0) {
      console.log('❌ Cart is empty');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Prepare user details for payment
      const userDetails = {
        name: user?.name || 'Customer',
        email: user?.email || '',
        contact: user?.phone || '',
      };

      // Determine order type and delivery address based on selected option
      const orderType = selectedOption === 'orderNow' ? 'order_now' : 'takeaway';
      const deliveryAddress = selectedOption === 'orderNow' ? 'Food Court Location' : 'Takeaway Counter';

      console.log('🔄 Initiating payment process...');
      console.log('📋 Order Type:', orderType);
      console.log('📍 Delivery Address:', deliveryAddress);
      
      await dispatch(processPayment(userDetails, orderType, deliveryAddress, token));
      
    } catch (error: any) {
      console.log('❌ Payment process failed:', error);
      // Error handling is done in the processPayment thunk
    }
  }, [token, cartItems, user, selectedOption, dispatch]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View flex={1} backgroundColor="mainBackgroundLight" >
        <ScreenHeader title="Cart" />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View paddingHorizontal={pageHorizantalPadding} >
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
                selected={selectedOption === 'orderNow'}
                onPress={handleOrderNowPress}
                label="Order Now"
              />
              <RadioButton
                selected={selectedOption === 'takeaway'}
                onPress={handleTakeawayPress}
                label="Takeaway"
              />
            </View>
          </View>

          <View paddingHorizontal={pageHorizantalPadding} mt="l">
            {loading ? (
              <View paddingVertical="xl" alignItems="center">
                <Text
                  fontSize={16}
                  fontWeight="500"
                  color="textSecondary"
                  fontFamily="Poppins-Medium"
                  textAlign="center"
                >
                  Loading cart...
                </Text>
              </View>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  onIncrease={() => token && dispatch(updateCartItem(item.id, item.quantity + 1, token))}
                  onDecrease={() => token && dispatch(updateCartItem(item.id, item.quantity - 1, token))}
                />
              ))
            ) : (
              <View paddingVertical="xl" alignItems="center">
                <Text
                  fontSize={16}
                  fontWeight="500"
                  color="textSecondary"
                  fontFamily="Poppins-Medium"
                  textAlign="center"
                >
                  Your cart is empty
                </Text>
                <Text
                  fontSize={14}
                  fontWeight="400"
                  color="textSecondary"
                  fontFamily="Poppins-Regular"
                  textAlign="center"
                  marginTop="s"
                >
                  Add some delicious items to get started!
                </Text>
              </View>
            )}
          </View>

          <DiscountCoupon promocode={promocode} onPress={() => setPromocode('')} />

          <View
            marginHorizontal={pageHorizantalPadding}
            marginBottom="l"
            borderRadius="m"
          >
            <PriceRow label="Subtotal:" value={`₹${subtotal.toFixed(0)}`} />
            {walletCoins > 0 && <PriceRow label="Wallet Coins" value={`-₹${walletCoins}`} showIcon />}
            {deliveryFee > 0 && <PriceRow label="Delivery Fee:" value={`₹${deliveryFee}`} />}
            {discount > 0 && (
              <>
                <PriceRow label="Discount:" value={`${discount}%`} isDiscount />
                <Text
                  fontSize={10}
                  fontWeight="400"
                  color="textSecondary"
                  fontFamily="Poppins-Regular"
                  marginBottom="s"
                >
                  the discount does not apply to all products
                </Text>
              </>
            )}
          </View>
        </ScrollView>

        <View
          backgroundColor="primary"
          paddingHorizontal={pageHorizantalPadding}
          paddingVertical="m"
        >
          <Pressable 
            style={[
              styles.checkoutButton,
              { opacity: (paymentLoading || cartItems.length === 0) ? 0.6 : 1 }
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
              marginBottom="m"
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
              marginBottom="m"
            >
              <Text
                fontSize={18}
                fontWeight="600"
                color="textOnPrimary"
                fontFamily="Poppins-SemiBold"
                marginRight="m"
              >
                {paymentLoading ? 'Processing...' : paymentSuccess ? 'Success!' : 'Place Order'}
              </Text>
              {!paymentLoading && !paymentSuccess && (
                <Ionicons style={{ marginTop: 4 }} name="chevron-forward" size={20} color="#FFFFFF" />
              )}
              {paymentLoading && (
                <Ionicons style={{ marginTop: 4 }} name="hourglass-outline" size={20} color="#FFFFFF" />
              )}
              {paymentSuccess && (
                <Ionicons style={{ marginTop: 4 }} name="checkmark" size={20} color="#FFFFFF" />
              )}
            </View>
          </Pressable>
        </View>

       {showSuccessModal && <SuccessModal
          visible={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Successful"
          message="Congratulations your order is accepted."
          buttonText="Checkout"
        />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#A20538',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonAdd: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#A20538',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#A20538',
    borderRadius: 12,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
});

export default Cart;