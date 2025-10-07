import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/ui";
import { RootState, useAppSelector } from "../store/store";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { CloseIcon, HeartFilledIcon, HeartIcon } from "../utils/Svgs";
import { Card } from "./(tabs)/(home)";

const ProductDetail = () => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const handleClosePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const handleHeartPress = useCallback(() => {
    if (!token) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setIsLiked(!isLiked);
  }, [token, isLiked]);

  const handleQuantityIncrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => prev + 1);
  }, []);

  const handleQuantityDecrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const handleConfirmPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add to cart logic here
    // You can navigate to cart or show success message
    // router.push('/cart');
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View flex={1} backgroundColor="mainBackgroundLight">
        <View position="relative" height={280}>
          <Image
            source={require('@/assets/images/bowl.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          <View position="absolute" top={50} right={20}>
            <TouchableOpacity onPress={handleClosePress}>
              <Card>
                <CloseIcon />
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
              <View flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginBottom="s">
                <View flex={1}>
                  <Text
                    fontSize={30}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                    marginBottom="xs"
                  >
                    Desi Bowl Meal
                  </Text>
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color="textPrimary"
                    fontFamily="Poppins-SemiBold"
                  >
                    $14
                  </Text>
                </View>
                
                <TouchableOpacity onPress={handleHeartPress}>
                  <Card>
                    {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
                  </Card>
                </TouchableOpacity>
              </View>

              <View marginBottom="l">
                <Text
                  fontSize={16}
                  fontWeight="500"
                  color="textPrimary"
                  fontFamily="Poppins-Medium"
                  marginBottom="s"
                >
                  Description
                </Text>
                <Text
                  fontSize={14}
                  fontWeight="500"
                  color="textPrimary"
                  fontFamily="Poppins-Medium"
                  lineHeight={21}
                >
                  A wholesome mix of grains, protein & greens — fluffy rice, roasted veggies, juicy chicken (or paneer), and a drizzle of zesty dressing. A perfect balance of health & taste in one bowl.
                </Text>
              </View>

              <View 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="center" 
                marginBottom="xl"
                paddingVertical="m"
              >
                <TouchableOpacity
                  onPress={handleQuantityDecrease}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove" size={18} color="#010101" />
                </TouchableOpacity>
                
                <Text
                  fontSize={18}
                  fontWeight="600"
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                  marginHorizontal="l"
                  minWidth={40}
                  textAlign="center"
                >
                  {quantity}
                </Text>
                
                <TouchableOpacity
                  onPress={handleQuantityIncrease}
                  style={styles.quantityButtonAdd}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View 
            backgroundColor="primary" 
            paddingHorizontal={pageHorizantalPadding} 
            paddingVertical="m"
          >
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
              <Text
                fontSize={18}
                fontWeight="600"
                color="textOnPrimary"
                fontFamily="Poppins-SemiBold"
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: '100%',
    height: '100%',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#010101',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonAdd: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#A20538',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#A20538',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetail;
