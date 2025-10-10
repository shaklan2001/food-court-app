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
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
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
    const inputRefs = useRef<TextInput[]>([]);

    // Load signup data from AsyncStorage
    useEffect(() => {
        const loadSignupData = async () => {
            try {
                const data = await AsyncStorage.getItem('pending_signup_data');
                if (data) {
                    setSignupData(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error loading signup data:', error);
            }
        };
        loadSignupData();
    }, []);

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0 && isResendDisabled) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer, isResendDisabled]);

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

        if (!signupData) {
            showToast({
                message: 'Signup data not found. Please try again.',
                type: 'error',
            });
            router.push('/sign-up');
            return;
        }

        setIsLoading(true);

        try {
            const verifyResponse = await betterwayApiCall({
                method: "POST",
                url: "VERIFY_OTP_TO_PHONE",
                body: {
                    phone: signupData.phone,
                    otp: otpString,
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
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to verify OTP',
                type: 'error',
            });
        }
    };

    const handleResendOTP = () => {
        if (isResendDisabled || !signupData) return;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useApiPort({
            intent: "intent_send_otp_to_phone",
            port: betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phone: signupData.phone,
                },
                auth: null,
            }),
            success: () => {
                setTimer(30);
                setIsResendDisabled(true);
                showToast({
                    message: 'OTP resent successfully!',
                    type: 'success',
                });
            },
            failure: (error) => {
                showToast({
                    message: error?.response?.data?.message || 'Failed to resend OTP',
                    type: 'error',
                });
            },
        })();
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
                                                    {timer} Sec
                                                </Text>
                                            </Text>
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
                                        <View alignItems="center">
                                            <Text
                                                fontSize={13}
                                                fontWeight="400"
                                                color="textSecondary"
                                                textAlign="center"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Didn't receive the code yet?{' '}
                                                <Text
                                                    fontSize={13}
                                                    fontWeight="700"
                                                    color="textPrimary"
                                                    textDecorationLine="underline"
                                                    fontFamily="Poppins-Bold"
                                                    onPress={handleResendOTP}
                                                >
                                                    Request Again
                                                </Text>
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

OTPVerify.displayName = 'OTPVerify';

export default OTPVerify;
