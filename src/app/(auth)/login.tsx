import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ImageBackground, Platform, Pressable, View as RNView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button, CountryCodeSelector, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
import { useGoogleAuth } from '../../services/googleAuthService';
import { setToken, setUser } from '../../store/slices/authSlice';
import { showToast } from '../../utils';
const { width, height } = Dimensions.get('window');

const Login = memo(() => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');

    useEffect(() => {
        const clearOldData = async () => {
            try {
                await AsyncStorage.multiRemove(['pending_signup_data', 'pending_otp_data']);
            } catch (error) {
                console.warn('Failed to clear old signup/otp data:', error);
            }
        };
        clearOldData();
    }, []);

    const isEmailValid = useMemo(() => {
        return /\S+@\S+\.\S+/.test(email);
    }, [email]);

    const isEmailEmpty = useMemo(() => {
        return !email.trim();
    }, [email]);

    const isPasswordEmpty = useMemo(() => {
        return !password.trim();
    }, [password]);

    const isMobileNumberValid = useMemo(() => {
        return mobileNumber.length >= 10;
    }, [mobileNumber]);

    const isMobileNumberEmpty = useMemo(() => {
        return !mobileNumber.trim();
    }, [mobileNumber]);

    const loginData = useMemo(() => ({
        phone: mobileNumber,
        flow: 'login',
    }), [mobileNumber]);

    const loginUser = useCallback(() => {
        const loginApiCall = useApiPort({
            intent: 'Email Login',
            port: betterwayApiCall({
                method: "POST",
                url: "SIGN_IN_EMAIL",
                body: {
                    email,
                    password,
                },
                auth: null,
            }),
            success: (data) => {
                if (data?.token && data?.user) {
                    dispatch(setToken(data.token));
                    dispatch(setUser({
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        phoneNumber: data.phoneNumber || data.user.phoneNumber || data.user.phone,
                        image: data.user.image,
                        emailVerified: data.user.emailVerified,
                        role: data.role || data.user.role,
                        createdAt: data.user.createdAt,
                        updatedAt: data.user.updatedAt,
                    }));
                    router.push('/(tabs)');
                } else {
                    showToast({
                        message: data?.message || 'Invalid credentials',
                        type: 'error',
                    });
                }
            },
            failure: (error) => {
                showToast({
                    message: error?.response?.data?.message || error?.message || 'Login failed',
                    type: 'error',
                });
            },
            print: 'all',
        });
        return loginApiCall();
    }, [email, password, dispatch]);

    const handleLogin = useCallback(() => {
        if (isEmailEmpty) {
            showToast({
                message: 'Please enter your email',
                type: 'error',
            });
            return;
        }
        if (isPasswordEmpty) {
            showToast({
                message: 'Please enter your password',
                type: 'error',
            });
            return;
        }
        if (!isEmailValid) {
            showToast({
                message: 'Please enter a valid email address',
                type: 'error',
            });
            return;
        }
        
        setIsLoading(true);
        loginUser().finally(() => setIsLoading(false));
    }, [isEmailEmpty, isPasswordEmpty, isEmailValid, loginUser]);

    const handleForgotPassword = useCallback(() => {
        console.log('Forgot password pressed');
    }, []);

    // Initialize Google auth hook - Better Auth handles everything internally
    const { signInWithGoogle, isLoading: isGoogleAuthLoading } = useGoogleAuth();

    const handleGoogleLogin = useCallback(async () => {
        await signInWithGoogle();
    }, [signInWithGoogle]);

    const handleAppleLogin = useCallback(() => {
        showToast({
            message: 'Apple sign-in coming soon',
            type: 'info',
        });
    }, []);

    const handleSignUp = useCallback(() => {
        router.push('/sign-up');
    }, []);

    const handlePhoneNumberLogin = useCallback(() => {
        setIsPhoneLogin(true);
    }, []);

    const handleEmailLogin = useCallback(() => {
        setIsPhoneLogin(false);
    }, []);

    const handleSendOTP = useCallback(async () => {
        setIsLoading(true);
        if (isMobileNumberEmpty) {
            showToast({
                message: 'Please enter your mobile number',
                type: 'error',
            });
            setIsLoading(false);
            return;
        }
        if (!isMobileNumberValid) {
            showToast({
                message: 'Please enter a valid mobile number',
                type: 'error',
            });
            setIsLoading(false);
            return;
        }

        try {
            await AsyncStorage.setItem('pending_otp_data', JSON.stringify(loginData));

            const response = await betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phoneNumber: mobileNumber,
                },
                auth: null,
            });

            if (response?.data?.message === 'code sent' || response?.status === 200) {
                setTimeout(() => {
                    router.push('/otp-verify');
                }, 100);
            } else {
                showToast({
                    message: response?.data?.message || 'Failed to send OTP',
                    type: 'error',
                });
            }
        } catch (error: any) {
            showToast({
                message: error?.message || 'Failed to send OTP',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [mobileNumber, isMobileNumberEmpty, isMobileNumberValid, loginData]);

    return (
        <ImageBackground
            source={require('../../../assets/images/primary_bg.webp')}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar barStyle='dark-content' backgroundColor="black" translucent />
            <View style={{ flex: 1 }}>
                <View
                    justifyContent="center"
                    alignItems="center"
                    minHeight={height * 0.25}
                >
                    <Image
                        source={require('../../../assets/images/font-logo.png')}
                        style={styles.image}
                    />
                </View>

                <View
                    backgroundColor="mainBackgroundLight"
                    style={styles.container}
                    flex={1}
                >
                    <View
                        padding="l"
                        paddingTop="xl"
                        style={styles.header}
                    >
                        <Text
                            fontSize={24}
                            fontWeight="500"
                            color="textPrimary"
                            textAlign="left"
                            marginBottom="l"
                            fontFamily="Poppins-SemiBold"
                            lineHeight={28}
                        >
                            Login
                        </Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        style={styles.scrollView}
                    >
                        {!isPhoneLogin ? (
                            <>
                                <View marginBottom="l">
                                    <Text
                                        fontSize={14}
                                        fontWeight="400"
                                        color="textSecondary"
                                        marginBottom="s"
                                        fontFamily="Poppins-Regular"
                                    >
                                        Email <Text color="primary">*</Text>
                                    </Text>
                                    <FormField
                                        label=""
                                        placeholder="Enter your email"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
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
                                        Password <Text color="primary">*</Text>
                                    </Text>
                                    <PasswordInput
                                        value={password}
                                        onChangeText={setPassword}
                                        backgroundColor="inputBackground"
                                    />
                                </View>

                                <View marginTop="s" marginBottom="m">
                                    <Button
                                        title={"LOGIN"}
                                        variant="primary"
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                        loading={isLoading}
                                    />
                                </View>

                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <View alignItems="center" marginBottom="l">
                                        <Text
                                            fontSize={16}
                                            fontWeight="400"
                                            color="loginBackground"
                                            fontFamily="Poppins-Regular"
                                        >
                                            Forgot password?
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <View marginBottom="l">
                                    <Text
                                        fontSize={14}
                                        fontWeight="400"
                                        color="textSecondary"
                                        marginBottom="s"
                                        fontFamily="Poppins-Regular"
                                    >
                                        Mobile number <Text color="primary">*</Text>
                                    </Text>
                                    <View flexDirection="row" gap="s">
                                        <CountryCodeSelector />
                                        <View flex={1}>
                                            <FormField
                                                label=""
                                                placeholder="Mobile number"
                                                value={mobileNumber}
                                                onChangeText={setMobileNumber}
                                                keyboardType="phone-pad"
                                                marginBottom="xs"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View marginTop="s" marginBottom="m">
                                    <Button
                                        title={"SEND OTP"}
                                        variant="primary"
                                        onPress={handleSendOTP}
                                        disabled={isLoading}
                                        loading={isLoading}
                                    />
                                </View>
                            </>
                        )}

                        <View alignItems="center" marginBottom="l">
                            <View flexDirection="row" alignItems="center" gap="s">
                                <Text
                                    fontSize={16}
                                    fontWeight="400"
                                    color="textSecondary"
                                    marginBottom="m"
                                    fontFamily="Poppins-Regular"
                                >
                                    Login with 
                                </Text>
                                <Pressable onPress={isPhoneLogin ? handleEmailLogin : handlePhoneNumberLogin}>
                                    <Text
                                        fontSize={16}
                                        fontWeight="bold"
                                        color="primary"
                                        marginBottom="m"
                                        fontFamily="Poppins-SemiBold"
                                    >
                                        {isPhoneLogin ? 'Email' : 'Phone Number'}
                                    </Text>
                                </Pressable>
                            </View>

                            <View flexDirection="row" gap="m">
                                <SocialLoginButton
                                    onPress={handleGoogleLogin}
                                    imageSource={require('../../../assets/images/google-logo.png')}
                                    disabled={isGoogleAuthLoading}
                                />
                                {Platform.OS === 'ios' && <SocialLoginButton
                                    onPress={handleAppleLogin}
                                    imageSource={require('../../../assets/images/apple-logo.png')}
                                />}
                            </View>
                        </View>

                        <View alignItems="center">
                            <Text
                                fontSize={16}
                                fontWeight="400"
                                color="textSecondary"
                                textAlign="center"
                                fontFamily="Poppins-Regular"
                            >
                                Don&apos;t have an account?{' '}
                                <Text
                                    fontSize={16}
                                    fontWeight="700"
                                    color="textPrimary"
                                    textDecorationLine="underline"
                                    fontFamily="Poppins-Bold"
                                    onPress={handleSignUp}
                                >
                                    Sign Up
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {(isGoogleAuthLoading || isLoading) && (
                <RNView 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                >
                    <ActivityIndicator size="large" color="#ffffff" />
                    {isGoogleAuthLoading && (
                        <Text 
                            style={{ color: 'white', marginTop: 10, fontFamily: 'Poppins-Medium' }}
                        >
                            Signing in with Google...
                        </Text>
                    )}
                </RNView>
            )}
        </ImageBackground>
    );
});

Login.displayName = 'Login';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width,
        height,
    },
    image: {
        height: 135,
        width: '90%',
        resizeMode: 'contain',
    },
    container: {
        borderTopLeftRadius: 60,
    },
    header: {
        marginBottom: -20,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        flexGrow: 1,
    },
    scrollView: {
        flex: 1,
    },
});

export default Login;