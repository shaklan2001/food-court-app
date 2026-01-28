import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, FormField, Text, View } from '../../../components/ui';
import { betterwayApiCall } from '../../../network/useApiPort';
import { RootState, useAppSelector } from '../../../store/store';
import { showToast } from '../../../utils';

const { width, height } = Dimensions.get('window');

const CouponCreation = memo(() => {
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [couponCode, setCouponCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [minOrderAmount, setMinOrderAmount] = useState('');
    const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inset = useSafeAreaInsets();

    const validateForm = useCallback(() => {
        if (!couponCode.trim()) {
            showToast({
                message: 'Please enter coupon code',
                type: 'error',
            });
            return false;
        }
        if (!discountPercent.trim()) {
            showToast({
                message: 'Please enter discount percentage',
                type: 'error',
            });
            return false;
        }
        if (Number(discountPercent) <= 0 || Number(discountPercent) > 100) {
            showToast({
                message: 'Discount percentage must be between 1-100',
                type: 'error',
            });
            return false;
        }
        if (!minOrderAmount.trim()) {
            showToast({
                message: 'Please enter minimum order amount',
                type: 'error',
            });
            return false;
        }
        if (!maxDiscountAmount.trim()) {
            showToast({
                message: 'Please enter maximum discount amount',
                type: 'error',
            });
            return false;
        }
        return true;
    }, [couponCode, discountPercent, minOrderAmount, maxDiscountAmount]);

    const handleCreateCoupon = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "CREATE_COUPON",
                auth: token,
                body: {
                    code: couponCode.toUpperCase(),
                    discountPercent: Number(discountPercent),
                    minOrderPaise: Number(minOrderAmount) * 100,
                    maxDiscountPaise: Number(maxDiscountAmount) * 100,
                    description: description.trim() || undefined,
                },
            });

            if (response?.status === 200 || response?.data) {
                showToast({
                    message: 'Coupon created successfully!',
                    type: 'success',
                });
                // Clear form
                setCouponCode('');
                setDiscountPercent('');
                setMinOrderAmount('');
                setMaxDiscountAmount('');
                setDescription('');
                // Navigate back
                setTimeout(() => {
                    router.back();
                }, 1000);
            } else {
                showToast({
                    message: response?.data?.message || 'Failed to create coupon',
                    type: 'error',
                });
            }
        } catch (error: any) {
            showToast({
                message: error?.response?.data?.message || error?.message || 'Failed to create coupon',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [validateForm, couponCode, discountPercent, minOrderAmount, maxDiscountAmount, description, token]);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ImageBackground
                source={require('../../../../assets/images/primary_bg.webp')}
                style={{
                    width,
                    height,
                    marginTop: 12
                }}
                resizeMode="cover"
            >
                <StatusBar barStyle='light-content' backgroundColor="#A20538" translucent />
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{ flex: 1 }}>
                                {/* Header */}
                                <View
                                    justifyContent="center"
                                    alignItems="center"
                                    paddingTop="xl"
                                    paddingBottom="l"
                                    minHeight={height * 0.15}
                                >
                                    <View
                                        position="absolute"
                                        top={60}
                                        left={24}
                                        zIndex={1}
                                    >
                                        <Pressable onPress={handleBack}>
                                            <AntDesign name="arrow-left" size={28} color="white" />
                                        </Pressable>
                                    </View>
                                    <View alignItems="center">
                                        <Text
                                            fontSize={32}
                                            fontWeight="bold"
                                            color="textOnPrimary"
                                            textAlign="center"
                                            fontFamily="Poppins-Bold"
                                            lineHeight={42}
                                            marginLeft="xl"
                                        >
                                            Coupon Creation
                                        </Text>
                                    </View>
                                </View>

                                {/* Form Container */}
                                <View
                                    backgroundColor="mainBackgroundLight"
                                    flex={1}
                                    style={{
                                        borderTopLeftRadius: 60,
                                    }}
                                >
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContent}
                                    >
                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Coupon Code <Text color="primary">*</Text>
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter coupon code (e.g. SAVE20)"
                                                value={couponCode}
                                                onChangeText={setCouponCode}
                                                autoCapitalize="characters"
                                                marginBottom="xs"
                                            />
                                        </View>

                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Discount Percentage <Text color="primary">*</Text>
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter discount % (1-100)"
                                                value={discountPercent}
                                                onChangeText={setDiscountPercent}
                                                keyboardType="numeric"
                                                marginBottom="xs"
                                            />
                                        </View>

                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Minimum Order Amount (₹) <Text color="primary">*</Text>
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter minimum order amount"
                                                value={minOrderAmount}
                                                onChangeText={setMinOrderAmount}
                                                keyboardType="numeric"
                                                marginBottom="xs"
                                            />
                                        </View>

                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Maximum Discount Amount (₹) <Text color="primary">*</Text>
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter maximum discount amount"
                                                value={maxDiscountAmount}
                                                onChangeText={setMaxDiscountAmount}
                                                keyboardType="numeric"
                                                marginBottom="xs"
                                            />
                                        </View>

                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Description (Optional)
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter coupon description"
                                                value={description}
                                                onChangeText={setDescription}
                                                marginBottom="xs"
                                                multiline
                                                numberOfLines={3}
                                            />
                                        </View>

                                        <View marginTop="l" marginBottom="xl">
                                            <Button
                                                title="CREATE COUPON"
                                                variant="primary"
                                                onPress={handleCreateCoupon}
                                                disabled={isLoading}
                                                loading={isLoading}
                                            />
                                        </View>

                                        <View alignItems="center" marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                textAlign="center"
                                                fontFamily="Poppins-Regular"
                                                lineHeight={20}
                                            >
                                                Create promotional coupons for your customers
                                            </Text>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
});

CouponCreation.displayName = 'CouponCreation';

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        flexGrow: 1,
    },
});

export default CouponCreation;

