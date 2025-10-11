import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState, useAppSelector } from "../store/store";
import { Text, View } from "./ui";

interface FloatingCartProps {
  bottomOffset?: number;
}

const FloatingCart = memo(({ bottomOffset = 0 }: FloatingCartProps) => {
  const { items: cartItems } = useAppSelector((state: RootState) => state.cart);
  const insets = useSafeAreaInsets();

  const handleCartPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/cart');
  }, []);

  if (cartItems.length === 0) {
    return null;
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const previewItems = cartItems.slice(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          bottom: bottomOffset + insets.bottom + 10,
        },
      ]}
    >
      <Pressable style={styles.cartButton} onPress={handleCartPress}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            {previewItems.map((item, index) => (
              <Image
                key={item.id}
                source={item.image || require('@/assets/images/bowl.png')}
                style={[
                  styles.previewImage,
                  {
                    zIndex: previewItems.length - index,
                    marginLeft: index > 0 ? -20 : 0,
                  },
                ]}
                resizeMode="cover"
              />
            ))}
          </View>
          <View style={styles.textContainer}>
            <Text
              fontSize={16}
              fontWeight="600"
              color="textOnPrimary"
              fontFamily="Poppins-SemiBold"
              marginLeft={'s'}
            >
              View Cart
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textOnPrimary"
              fontFamily="Poppins-Regular"
              opacity={0.9}
              marginLeft={'s'}
            >
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#FFFFFF"
          />
        </View>
      </Pressable>
    </View>
  );
});

FloatingCart.displayName = 'FloatingCart';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  cartButton: {
    backgroundColor: '#A20538',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  previewImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 12,
  },
});

export default FloatingCart;
