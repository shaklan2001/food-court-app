import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import * as Clipboard from 'expo-clipboard';
import { router, Stack } from 'expo-router';
import * as SMS from 'expo-sms';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from '../../components/ui';
import { Theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

interface OTPVerifyProps { }

const OTPVerify = memo(({ }: OTPVerifyProps) => {
    const theme = useTheme<Theme>();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef<TextInput[]>([]);

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



    // Handle OTP input change
    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-focus previous input on backspace
        if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };



    // Verify OTP
    const handleVerifyOTP = () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        // TODO: Implement OTP verification API call
        console.log('Verifying OTP:', otpString);
        Alert.alert('Success', 'OTP verified successfully!');

        // Navigate to next screen after verification
        setTimeout(() => {
            router.push('/(tabs)/(home)');
        }, 1000);
    };

    // Resend OTP
    const handleResendOTP = () => {
        if (isResendDisabled) return;

        // TODO: Implement resend OTP API call
        console.log('Resending OTP...');
        setTimer(30);
        setIsResendDisabled(true);
        Alert.alert('Success', 'OTP resent successfully!');
    };

    // Auto-fill from SMS
    const handleAutoFillFromSMS = async () => {
        try {
            // Check if SMS is available
            const isAvailable = await SMS.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'SMS is not available on this device');
                return;
            }

            // Try to read from clipboard first (common way to get OTP)
            const clipboardContent = await Clipboard.getStringAsync();
            if (clipboardContent && /^\d{6}$/.test(clipboardContent)) {
                const otpArray = clipboardContent.split('');
                setOtp(otpArray);
                Alert.alert('Success', 'OTP auto-filled from clipboard!');
                return;
            }

            // If no OTP in clipboard, show manual option
            Alert.alert(
                'Auto-fill OTP',
                'No OTP found in clipboard. You can:\n1. Copy the OTP from SMS and try again\n2. Enter manually',
                [
                    { text: 'Copy from Clipboard', onPress: handleClipboardPaste },
                    { text: 'Enter Manually', style: 'cancel' }
                ]
            );
        } catch (error) {
            console.error('Error accessing SMS:', error);
            Alert.alert('Error', 'Unable to access SMS. Please enter OTP manually.');
        }
    };

    // Handle clipboard paste
    const handleClipboardPaste = async () => {
        try {
            const clipboardContent = await Clipboard.getStringAsync();
            if (clipboardContent && /^\d{6}$/.test(clipboardContent)) {
                const otpArray = clipboardContent.split('');
                setOtp(otpArray);
                Alert.alert('Success', 'OTP auto-filled from clipboard!');
                // Focus last input after auto-fill
                inputRefs.current[5]?.focus();
            } else {
                Alert.alert('Error', 'No valid 6-digit OTP found in clipboard');
            }
        } catch (error) {
            console.error('Error reading clipboard:', error);
            Alert.alert('Error', 'Unable to read clipboard');
        }
    };

    // Go back
    const handleBack = () => {
        router.back();
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
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
                                            <AntDesign name="arrowleft" size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <View alignItems="center">
                                        <Text
                                            fontSize={36}
                                            fontWeight="600"
                                            color="textOnPrimary"
                                            textAlign="center"
                                            fontFamily="Poppins-Bold"
                                            lineHeight={43}
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
