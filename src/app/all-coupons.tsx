import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/ui";
import { Coupon } from "../network/routeTypes";
import { betterwayApiCall, useApiPort } from "../network/useApiPort";
import { RootState, useAppSelector } from "../store/store";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { DiscountIcon } from "../utils/Svgs";
import { ScreenHeader } from "./cart";

const CouponCard = memo(({
  coupon,
  isApplicable,
  isSelected,
  onPress
}: {
  coupon: Coupon;
  isApplicable: boolean;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const discountAmount = Math.min(
    (coupon.minOrderPaise * coupon.discountPercent) / 100,
    coupon.maxDiscountPaise
  ) / 100;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isApplicable}
      style={[
        styles.couponCard,
        { opacity: isApplicable ? 1 : 0.6 }
      ]}
    >
      <View flexDirection="row" alignItems="center" justifyContent="space-between">
        <View flexDirection="row" alignItems="center" flex={1}>
          <DiscountIcon />
          <View marginLeft="m" flex={1}>
            <Text
              fontSize={16}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="xs"
            >
              {coupon.discountPercent}% OFF up to ₹{discountAmount.toFixed(0)}
            </Text>
            <Text
              fontSize={12}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
            >
              {isApplicable 
                ? `Min order ₹${(coupon.minOrderPaise / 100).toFixed(0)}`
                : `Add eligible items worth ₹${(coupon.minOrderPaise / 100).toFixed(0)} more to unlock`
              }
            </Text>
          </View>
        </View>
        
        <View
          width={20}
          height={20}
          borderRadius="xxl"
          borderWidth={2}
          borderColor={isSelected ? "primary" : "border"}
          backgroundColor={isSelected ? "primary" : "transparent"}
          justifyContent="center"
          alignItems="center"
        >
          {isSelected && (
            <View
              width={8}
              height={8}
              borderRadius="xxl"
              backgroundColor="mainBackground"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
});

CouponCard.displayName = 'CouponCard';

const CouponSection = memo(({
  title,
  coupons,
  cartTotal,
  selectedCouponId,
  onCouponSelect
}: {
  title: string;
  coupons: Coupon[];
  cartTotal: number;
  selectedCouponId: string | null;
  onCouponSelect: (couponId: string) => void;
}) => {
  return (
    <View marginBottom="xl">
      <Text
        fontSize={18}
        fontWeight="600"
        color="textPrimary"
        fontFamily="Poppins-SemiBold"
        marginBottom="m"
      >
        {title}
      </Text>
      
      {coupons.map((coupon) => {
        const isApplicable = cartTotal >= coupon.minOrderPaise;
        const isSelected = selectedCouponId === coupon.id;
        
        return (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            isApplicable={isApplicable}
            isSelected={isSelected}
            onPress={() => onCouponSelect(coupon.id)}
          />
        );
      })}
    </View>
  );
});

CouponSection.displayName = 'CouponSection';

const AllCoupons = () => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  const { total: cartTotal } = useAppSelector((state: RootState) => state.cart);
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchCoupons = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const apiCall = useApiPort({
        intent: "intent_get_all_coupons",
        port: betterwayApiCall({
          method: "GET",
          url: "GET_ALL_COUPONS",
          auth: token,
        }),
        success: (response: any) => {
          console.log("✅ Coupons fetched:", response);
          setCoupons(response || []);
        },
        failure: (error: any) => {
          console.log("❌ Failed to fetch coupons:", error);
        },
      });

      await apiCall();
    } catch (error) {
      console.log('❌ Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCouponSelect = useCallback((couponId: string) => {
    setSelectedCouponId(selectedCouponId === couponId ? null : couponId);
  }, [selectedCouponId]);

  const handleApplyCoupon = useCallback(() => {
    if (selectedCouponId) {
      const selectedCoupon = coupons.find(c => c.id === selectedCouponId);
      if (selectedCoupon) {
        router.push({
          pathname: '/cart',
          params: { 
            selectedCoupon: JSON.stringify(selectedCoupon)
          }
        });
      }
    }
  }, [selectedCouponId, coupons]);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const applicableCoupons = filteredCoupons.filter(coupon => 
    cartTotal >= coupon.minOrderPaise
  );
  
  const nonApplicableCoupons = filteredCoupons.filter(coupon => 
    cartTotal < coupon.minOrderPaise
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="All Coupons" moreAction={false} />
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View paddingHorizontal={pageHorizantalPadding}>
            <View
              flexDirection="row"
              alignItems="center"
              backgroundColor="mainBackground"
              borderRadius="m"
              paddingHorizontal="m"
              marginBottom="l"
              borderWidth={1}
              borderColor="border"
            >
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              <Pressable
                onPress={handleApplyCoupon}
                style={[
                  styles.applyButton,
                  { opacity: selectedCouponId ? 1 : 0.5 }
                ]}
                disabled={!selectedCouponId}
              >
                <Text
                  fontSize={14}
                  fontWeight="600"
                  fontFamily="Poppins-SemiBold"
                  opacity={0.5}
                >
                  Apply
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <View paddingVertical="xl" alignItems="center">
                <Text
                  fontSize={16}
                  fontWeight="500"
                  color="textSecondary"
                  fontFamily="Poppins-Medium"
                  textAlign="center"
                >
                  Loading coupons...
                </Text>
              </View>
            ) : (
              <>
                {applicableCoupons.length > 0 && (
                  <CouponSection
                    title="Restaurant Coupons"
                    coupons={applicableCoupons}
                    cartTotal={cartTotal}
                    selectedCouponId={selectedCouponId}
                    onCouponSelect={handleCouponSelect}
                  />
                )}

                {nonApplicableCoupons.length > 0 && (
                  <CouponSection
                    title="Payment Coupons"
                    coupons={nonApplicableCoupons}
                    cartTotal={cartTotal}
                    selectedCouponId={selectedCouponId}
                    onCouponSelect={handleCouponSelect}
                  />
                )}

                {filteredCoupons.length === 0 && (
                  <View paddingVertical="xl" alignItems="center">
                    <Ionicons name="search-outline" size={60} color="#D3D3D3" />
                    <Text
                      fontSize={18}
                      fontWeight="600"
                      color="textPrimary"
                      fontFamily="Poppins-SemiBold"
                      marginTop="l"
                      marginBottom="s"
                    >
                      No Coupons Found
                    </Text>
                    <Text
                      fontSize={14}
                      fontWeight="400"
                      color="textSecondary"
                      fontFamily="Poppins-Regular"
                      textAlign="center"
                      lineHeight={20}
                    >
                      Try searching with different keywords
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowColor: '#000000',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  applyButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default AllCoupons;
