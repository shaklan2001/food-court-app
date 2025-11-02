import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@shopify/restyle';
import * as Clipboard from 'expo-clipboard';
import { router, Stack } from 'expo-router';
import { memo, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Button, Text, View } from '../../components/ui';
import { betterwayApiCall } from '../../network/useApiPort';
import { setToken, setUser } from '../../store/slices/authSlice';
import { Theme } from '../../theme/theme';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');

const OTPVerify = memo(() => {
    const theme = useTheme<Theme>();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState<{ phone: string } | null>(null);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    const getTimerDuration = (attemptNumber: number): number => {
        switch (attemptNumber) {
            case 1:
                return 30;
            case 2:
                return 120;
            case 3:
                return 300;
            default:
                return 30;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const loginData = await AsyncStorage.getItem('pending_otp_data');
                if (loginData) {
                    const parsedData = JSON.parse(loginData);
                    setLoginData(parsedData);
                    return;
                }

                showToast({
                    message: 'Session expired. Please try again.',
                    type: 'error',
                });
                router.push('/login');
            } catch (error) {
                const errorMessage = (error as { message?: string })?.message || 'Session expired. Please try again.';
                showToast({
                    message: errorMessage,
                    type: 'error',
                });
                router.push('/login');
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0 && isResendDisabled && !maxAttemptsReached) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 && !maxAttemptsReached) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer, isResendDisabled, maxAttemptsReached]);

    useEffect(() => {
        const checkClipboardForOTP = async () => {
            try {
                const clipboardContent = await Clipboard.getStringAsync();
                if (clipboardContent && /^\d{6}$/.test(clipboardContent)) {
                    const otpArray = clipboardContent.split('');
                    setOtp(otpArray);
                }
            } catch {
                
            }
        };

        checkClipboardForOTP();
        const clipboardInterval = setInterval(checkClipboardForOTP, 3000);
        return () => clearInterval(clipboardInterval);
    }, []);



    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            showToast({
                message: 'Please enter a valid 6-digit OTP',
                type: 'error',
            });
            return;
        }
        
        if (!loginData) {
            showToast({
                message: 'Session expired. Please try again.',
                type: 'error',
            });
            router.push('/login');
            return;
        }

        setIsLoading(true);

        try {
            const verifyResponse = await betterwayApiCall({
                method: "POST",
                url: "VERIFY_OTP_TO_PHONE",
                body: {
                    phoneNumber: loginData.phone,
                    code: otpString,
                    disableSession: false,
                    updatePhoneNumber: false,
                },
                auth: null,
            });

            if (!verifyResponse?.data?.status) {
                setIsLoading(false);
                showToast({
                    message: verifyResponse?.data?.message || 'Invalid OTP',
                    type: 'error',
                });
                return;
            }

            showToast({
                message: 'OTP verified successfully!',
                type: 'success',
            });

            // Login flow - OTP verified, user gets logged in automatically
            if (verifyResponse?.data?.token && verifyResponse?.data?.user) {
                const userData = verifyResponse.data.user;
                const token = verifyResponse.data.token;
                const role = verifyResponse.data.role || userData.role;
                const phoneNumber = verifyResponse.data.phoneNumber || userData.phoneNumber || userData.phone;

                dispatch(setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    phoneNumber: phoneNumber,
                    phoneNumberVerified: userData.phoneNumberVerified,
                    emailVerified: userData.emailVerified,
                    role: role,
                    image: userData.image,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                }));

                dispatch(setToken(token));
                
                await AsyncStorage.removeItem('pending_otp_data');
                
                showToast({
                    message: 'Login successful!',
                    type: 'success',
                });
                
                setTimeout(() => {
                    setIsLoading(false);
                    router.push('/(tabs)');
                }, 1500);
            } else {
                // Fallback to login screen if no token/user data
                await AsyncStorage.removeItem('pending_otp_data');
                setIsLoading(false);
                
                showToast({
                    message: 'Phone number verified! Please login with your email and password.',
                    type: 'success',
                });
                
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
        } catch (error) {
            const errorMessage = (error as { message?: string })?.message || 'Failed to verify OTP';
            setIsLoading(false);
            showToast({
                message: errorMessage,
                type: 'error',
            });
        }
    };

    const handleResendOTP = async () => {
        if (isResendDisabled || !loginData || maxAttemptsReached) return;
        const newAttemptNumber = resendAttempts + 1;
        
        if (newAttemptNumber > 3) {
            setMaxAttemptsReached(true);
            showToast({
                message: 'Maximum resend attempts reached. Please contact support.',
                type: 'error',
            });
            return;
        }

        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phoneNumber: loginData.phone,
                },
                auth: null,
            });

            if (response?.data?.message === 'code sent' || response?.status === 200) {
                const newTimerDuration = getTimerDuration(newAttemptNumber);
                setTimer(newTimerDuration);
                setIsResendDisabled(true);
                setResendAttempts(newAttemptNumber);
                
                if (newAttemptNumber >= 3) {
                    setMaxAttemptsReached(true);
                }
                
                showToast({
                    message: `OTP resent successfully! Next resend available in ${newTimerDuration === 30 ? '30 seconds' : newTimerDuration === 120 ? '2 minutes' : '5 minutes'}.`,
                    type: 'success',
                });
            } else {
                showToast({
                    message: response?.data?.message || 'Failed to resend OTP',
                    type: 'error',
                });
            }
        } catch (error) {
            const errorMessage = (error as { message?: string })?.message || 'Failed to resend OTP';
            showToast({
                message: errorMessage,
                type: 'error',
            });
        }
    };

    return (
        <>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <ImageBackground
                source={require('../../../assets/images/primary_bg.webp')}
                style={{ flex: 1, width, height }}
                resizeMode="cover"
            >
                <StatusBar barStyle='dark-content' backgroundColor="black" translucent />
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{ flex: 1 }}>
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
                                        <TouchableOpacity onPress={handleBack}>
                                            <AntDesign name="arrow-left" size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <View alignItems="center">
                                        <Text
                                            fontSize={42}
                                            fontWeight="medium"
                                            color="textOnPrimary"
                                            textAlign="center"
                                            fontFamily="Poppins-Medium"
                                            lineHeight={43}
                                            marginLeft="l"
                                        >
                                            OTP Verify
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    backgroundColor="mainBackgroundLight"
                                    style={{
                                        borderTopLeftRadius: 60,
                                    }}
                                    flex={1}
                                    padding="l"
                                    paddingTop="xl"
                                >
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <Text
                                            fontSize={14}
                                            fontWeight="400"
                                            color="textSecondary"
                                            marginBottom="m"
                                            fontFamily="Poppins-Regular"
                                        >
                                            Submit OTP
                                        </Text>
                                        <View flexDirection="row" gap="s" marginBottom="l" justifyContent="center">
                                            {otp.map((digit, index) => (
                                                <TextInput
                                                    key={index}
                                                    ref={(ref) => {
                                                        if (ref) inputRefs.current[index] = ref;
                                                    }}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderWidth: 1,
                                                        borderColor: digit ? theme.colors.primary : theme.colors.inputBorder,
                                                        borderRadius: 8,
                                                        textAlign: 'center',
                                                        fontSize: 20,
                                                        fontWeight: '600',
                                                        backgroundColor: theme.colors.mainBackground,
                                                        color: theme.colors.textPrimary,
                                                    }}
                                                    value={digit}
                                                    onChangeText={(value) => handleOtpChange(value, index)}
                                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                                    keyboardType="number-pad"
                                                    maxLength={1}
                                                    autoFocus={index === 0}
                                                    selectionColor={theme.colors.primary}
                                                />
                                            ))}
                                        </View>

                                        <View alignItems="center" marginBottom="xl">
                                            {!maxAttemptsReached ? (
                                                timer > 0 ? (
                                                    <Text
                                                        fontSize={14}
                                                        fontWeight="400"
                                                        color="textSecondary"
                                                        fontFamily="Poppins-Regular"
                                                    >
                                                        Resend OTP in:{' '}
                                                        <Text
                                                            fontSize={14}
                                                            fontWeight="600"
                                                            color="danger"
                                                            fontFamily="Poppins-Bold"
                                                        >
                                                            {timer > 60 ? `${Math.floor(timer / 60)} Min ${timer % 60} Sec` : `${timer} Sec`}
                                                        </Text>
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        fontSize={14}
                                                        fontWeight="400"
                                                        color="textSecondary"
                                                        fontFamily="Poppins-Regular"
                                                        textAlign="center"
                                                        onPress={handleResendOTP}
                                                        style={{ textDecorationLine: 'underline' }}
                                                    >
                                                        Request Again
                                                    </Text>
                                                )
                                            ) : (
                                                <Text
                                                    fontSize={14}
                                                    fontWeight="600"
                                                    color="danger"
                                                    fontFamily="Poppins-Bold"
                                                    textAlign="center"
                                                >
                                                    Maximum resend attempts reached
                                                </Text>
                                            )}
                                        </View>
                                        <View marginBottom="l">
                                            <Button
                                                title="Verify OTP"
                                                variant="primary"
                                                onPress={handleVerifyOTP}
                                                loading={isLoading}
                                                disabled={isLoading}
                                            />
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

OTPVerify.displayName = 'OTPVerify';

export default OTPVerify;
