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

interface OTPVerifyProps { }

const OTPVerify = memo(({ }: OTPVerifyProps) => {
    const theme = useTheme<Theme>();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [signupData, setSignupData] = useState<any>(null);
    const [loginData, setLoginData] = useState<any>(null);
    const [currentFlow, setCurrentFlow] = useState<'signup' | 'login' | null>(null);
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
                // Try to load signup data first
                const signupData = await AsyncStorage.getItem('pending_signup_data');
                if (signupData) {
                    const parsedData = JSON.parse(signupData);
                    setSignupData(parsedData);
                    setCurrentFlow('signup');
                    return;
                }

                // If no signup data, try to load login data
                const loginData = await AsyncStorage.getItem('pending_otp_data');
                if (loginData) {
                    const parsedData = JSON.parse(loginData);
                    setLoginData(parsedData);
                    setCurrentFlow('login');
                    return;
                }

                // If neither exists, redirect back to login
                showToast({
                    message: 'Session expired. Please try again.',
                    type: 'error',
                });
                router.push('/login');
            } catch (error) {
                console.error('Error loading data:', error);
                router.push('/login');
            }
        };
        loadData();
    }, []);

    // Timer countdown effect
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

    // Check clipboard for OTP when app becomes active
    useEffect(() => {
        const checkClipboardForOTP = async () => {
            try {
                const clipboardContent = await Clipboard.getStringAsync();
                if (clipboardContent && /^\d{6}$/.test(clipboardContent)) {
                    const otpArray = clipboardContent.split('');
                    setOtp(otpArray);
                }
            } catch (error) {
                console.log('Clipboard check failed:', error);
            }
        };

        // Check clipboard when component mounts
        checkClipboardForOTP();

        // Set up interval to check clipboard every few seconds
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

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleBack = () => {
        router.back();
    };

    const uploadStudentId = async (studentIdFile: any) => {
        try {
            if (!studentIdFile) return null;

            const formData = new FormData();
            formData.append('file', {
                uri: studentIdFile.uri,
                type: studentIdFile.type || 'image/jpeg',
                name: studentIdFile.name,
            } as any);

            const response = await betterwayApiCall({
                method: "POST",
                url: "UPLOAD_STUDENT_ID",
                body: formData,
                auth: null,
            });

            if (response?.data?.success && response?.data?.url) {
                return response.data.url;
            } else {
                throw new Error('Failed to upload student ID');
            }
        } catch (error: any) {
            showToast({
                message: error?.message || 'Failed to upload student ID',
                type: 'error',
            });
        }
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

        const currentData = currentFlow === 'signup' ? signupData : loginData;
        
        if (!currentData) {
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
                    phone: currentData.phone,
                    code: otpString,
                    disableSession: false,
                    updatePhoneNumber: true,
                },
                auth: null,
            });


            if (!verifyResponse?.data?.success) {
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

            if (currentFlow === 'signup') {
                // Handle signup flow
                let studentIdImageUrl = null;
                if (signupData.isStudent && signupData.studentIdFile) {
                    studentIdImageUrl = await uploadStudentId(signupData.studentIdFile);
                    
                    if (!studentIdImageUrl) {
                        throw new Error('Failed to upload student ID');
                    }
                }

                const body: any = {
                    name: signupData.name,
                    email: signupData.email,
                    phone: signupData.phone,
                    dob: signupData.dob,
                    password: signupData.password,
                    isStudent: signupData.isStudent,
                };

                if (signupData.isStudent) {
                    body.collegeName = signupData.collegeName;
                    body.course = signupData.courseName;
                    body.branch = signupData.branch;
                    body.currentSemester = parseInt(signupData.currentSemester);
                    body.studentIdImage = studentIdImageUrl;
                }

                const createUserResponse = await betterwayApiCall({
                    method: "POST",
                    url: "CREATE_USER",
                    body,
                    auth: null,
                });

                if (createUserResponse?.data?.success && createUserResponse?.data?.user) {
                    const userData = createUserResponse.data.user;
                    const token = createUserResponse.data.token;

                    dispatch(setUser({
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        phoneNumber: userData.phoneNumber || userData.phone,
                        dob: userData.dob,
                        isStudent: userData.isStudent,
                        image: userData.image,
                    }));

                    if (token) {
                        dispatch(setToken(token));
                    }

                    await AsyncStorage.removeItem('pending_signup_data');

                    showToast({
                        message: 'Account created successfully!',
                        type: 'success',
                    });

                    setTimeout(() => {
                        setIsLoading(false);
                        router.push('/(tabs)');
                    }, 1500);
                } else {
                    setIsLoading(false);
                    showToast({
                        message: createUserResponse?.data?.message || 'Failed to create account',
                        type: 'error',
                    });
                }
            } else {
                // Handle login flow - redirect to login with email/password
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
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to verify OTP',
                type: 'error',
            });
        }
    };

    const handleResendOTP = async () => {
        const currentData = currentFlow === 'signup' ? signupData : loginData;
        
        if (isResendDisabled || !currentData || maxAttemptsReached) return;

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
                    phoneNumber: currentData.phone,
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
        } catch (error: any) {
            showToast({
                message: error?.message || 'Failed to resend OTP',
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
