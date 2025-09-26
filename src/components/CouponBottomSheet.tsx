import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { betterwayApiCall } from "../network/useApiPort";
import { RootState, useAppSelector } from "../store/store";
import { DiscountIcon } from "../utils/Svgs";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { Text, View } from "./ui";

export interface Coupon {
  id: string;
  code: string;
  minOrderPaise: number;
  discountPercent: number;
  maxDiscountPaise: number;
}

interface CouponBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCouponSelect: (coupon: Coupon) => void;
  cartTotal: number;
}

const CouponCard = memo(({
  coupon,
  isApplicable,
  isSelected,
  onPress,
}: {
  coupon: Coupon;
  isApplicable: boolean;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const discountAmount = Math.min(
    (coupon.minOrderPaise * coupon.discountPercent) / 100,
    coupon.maxDiscountPaise,
  ) / 100;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isApplicable}
      style={[
        styles.couponCard,
        { opacity: isApplicable ? 1 : 0.6 },
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
  onCouponSelect,
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

const CouponBottomSheet: React.FC<CouponBottomSheetProps> = ({
  visible,
  onClose,
  onCouponSelect,
  cartTotal,
}) => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const snapPoints = useMemo(() => ['50%', '85%'], []);

  const fetchCoupons = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await betterwayApiCall({
        method: "GET",
        url: "GET_ALL_COUPONS",
        auth: token,
      });
      setCoupons(response?.data || []);
    } catch (error) {
      console.log('❌ Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (visible) {
      fetchCoupons();
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, fetchCoupons]);

  const handleCouponSelect = useCallback((couponId: string) => {
    setSelectedCouponId(selectedCouponId === couponId ? null : couponId);
  }, [selectedCouponId]);

  const handleApplyCoupon = useCallback(() => {
    if (selectedCouponId) {
      const selectedCoupon = coupons.find(c => c.id === selectedCouponId);
      if (selectedCoupon) {
        onCouponSelect(selectedCoupon);
        onClose();
      }
    }
  }, [selectedCouponId, coupons, onCouponSelect, onClose]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const applicableCoupons = filteredCoupons.filter(coupon => 
    cartTotal >= coupon.minOrderPaise,
  );
  
  const nonApplicableCoupons = filteredCoupons.filter(coupon => 
    cartTotal < coupon.minOrderPaise,
  );

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
    >
      {/* Header */}
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={pageHorizantalPadding}
        paddingVertical="m"
        borderBottomWidth={1}
        borderBottomColor="border"
      >
        <Text
          fontSize={20}
          fontWeight="600"
          color="textPrimary"
          fontFamily="Poppins-SemiBold"
        >
          All Coupons
        </Text>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Search bar */}
      <View paddingHorizontal={pageHorizantalPadding} paddingVertical="m">
        <View
          flexDirection="row"
          alignItems="center"
          backgroundColor="mainBackground"
          borderRadius="m"
          paddingHorizontal="m"
          borderWidth={1}
          borderColor="border"
        >
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder="Search coupons"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            onFocus={() => {
              setTimeout(() => {
                bottomSheetRef.current?.snapToIndex(1);
              }, 100);
            }}
          />
        </View>
      </View>

      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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

            {filteredCoupons.length === 0 && !loading && (
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
      </BottomSheetScrollView>

      {/* Apply button */}
      {selectedCouponId && (
        <View
          backgroundColor="mainBackground"
          paddingHorizontal={pageHorizantalPadding}
          paddingVertical="m"
          borderTopWidth={1}
          borderTopColor="border"
        >
          <Pressable
            onPress={handleApplyCoupon}
            style={styles.applyButton}
          >
            <Text
              fontSize={16}
              fontWeight="600"
              color="textOnPrimary"
              fontFamily="Poppins-SemiBold"
            >
              Apply Coupon
            </Text>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
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
    backgroundColor: '#A20538',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CouponBottomSheet;