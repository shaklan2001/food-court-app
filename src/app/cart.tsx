import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/ui";
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
  onDecrease
}: {
  name: string;
  price: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
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
          source={require('@/assets/images/bowl.png')}
          style={styles.cartItemImage}
        />
        <View flex={1} marginLeft="m" justifyContent="space-between" height={100}>
          <Text
            fontSize={16}
            fontWeight="600"
            color="textPrimary"
            fontFamily="Poppins-SemiBold"
            marginBottom="xs"
          >
            {name}
          </Text>
          <Text
            fontSize={14}
            fontWeight="600"
            color="textPrimary"
            fontFamily="Poppins-SemiBold"
          >
            {price}
          </Text>
        </View>
        <View flexDirection="row" alignItems="flex-end" justifyContent="flex-end" height={100} >
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
  const [selectedOption, setSelectedOption] = useState<'orderNow' | 'takeaway'>('orderNow');
  const [promocode, setPromocode] = useState('TASTY12');
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Desi Bowl', price: '$500', quantity: 1 },
    { id: 2, name: 'Desi Bowl', price: '$500', quantity: 1 }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseInt(item.price.replace('$', '')) * item.quantity), 0);
  const walletCoins = 25;
  const deliveryFee = 30;
  const discount = 20;
  const total = subtotal - walletCoins + deliveryFee - (subtotal * discount / 100);

  const handleOrderNowPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption('orderNow');
  }, []);

  const handleTakeawayPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption('takeaway');
  }, []);

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
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onIncrease={() => updateQuantity(item.id, 1)}
                onDecrease={() => updateQuantity(item.id, -1)}
              />
            ))}
          </View>

          <DiscountCoupon promocode={promocode} onPress={() => setPromocode('')} />

          <View
            marginHorizontal={pageHorizantalPadding}
            marginBottom="l"
            borderRadius="m"
          >
            <PriceRow label="Subtotal:" value={`$${subtotal}`} />
            <PriceRow label="Wallet Coins" value={`-$${walletCoins}`} showIcon />
            <PriceRow label="Delivery Fee:" value={`$${deliveryFee}`} />
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
          </View>
        </ScrollView>

        <View
          backgroundColor="primary"
          paddingHorizontal={pageHorizantalPadding}
          paddingVertical="m"
        >
          <Pressable style={styles.checkoutButton}>
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
                ${total}
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
                marginRight="m"
              >
                Place Order
              </Text>
              <Ionicons style={{ marginTop: 4 }} name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>
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