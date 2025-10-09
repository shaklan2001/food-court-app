import { router } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Dimensions, Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button, CountryCodeSelector, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
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

    const loginUser = () =>
        useApiPort({
            intent: "intent_login_user",
            port: betterwayApiCall({
                method: "POST",
                url: "SIGN_IN_EMAIL",
                body: {
                    email,
                    password,
                },
                auth: null,
            }),
            success: (response) => {
                setIsLoading(false);
                
                if (response?.token && response?.user) {
                    dispatch(setToken(response.token));
                    dispatch(setUser({
                        id: response.user.id,
                        email: response.user.email,
                        name: response.user.name,
                        phoneNumber: response.user.phoneNumber || response.user.phone,
                        image: response.user.image,
                        emailVerified: response.user.emailVerified,
                        createdAt: response.user.createdAt,
                        updatedAt: response.user.updatedAt,
                    }));
                    router.push('/(tabs)');
                } else {
                    showToast({
                        message: 'Invalid credentials',
                        type: 'error',
                    });
                }
            },
            failure: (error) => {
                setIsLoading(false);
                showToast({
                    message: error?.message || 'Login failed',
                    type: 'error',
                });
            },
            print: "error",
        })();

    const handleLogin = useCallback(() => {
        if (!email.trim()) {
            showToast({
                message: 'Please enter your email',
                type: 'error',
            });
            return;
        }
        if (!password.trim()) {
            showToast({
                message: 'Please enter your password',
                type: 'error',
            });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast({
                message: 'Please enter a valid email address',
                type: 'error',
            });
            return;
        }
        
        setIsLoading(true);
        loginUser();
    }, [email, password]);

    const handleForgotPassword = () => {
        console.log('Forgot password pressed');
    };

    const handleGoogleLogin = () => {
        console.log('Google login pressed');
    };

    const handleAppleLogin = () => {
        console.log('Apple login pressed');
    };

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    const handlePhoneNumberLogin = () => {
        setIsPhoneLogin(true);
    };

    const handleEmailLogin = () => {
        setIsPhoneLogin(false);
    };

    const handleSendOTP = useCallback(() => {
        if (!mobileNumber.trim()) {
            showToast({
                message: 'Please enter your mobile number',
                type: 'error',
            });
            return;
        }
        if (mobileNumber.length < 10) {
            showToast({
                message: 'Please enter a valid mobile number',
                type: 'error',
            });
            return;
        }
        
        console.log('Sending OTP to:', mobileNumber);
        showToast({
            message: 'OTP sent successfully!',
            type: 'success',
        });
        
        setTimeout(() => {
            router.push('/otp-verify');
        }, 1000);
    }, [mobileNumber]);

    return (
        <ImageBackground
            source={require('../../../assets/images/primary_bg.webp')}
            style={{ flex: 1, width, height }}
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
                        style={{
                            height: 135,
                            width: '90%',
                            resizeMode: 'contain',
                        }}
                    />
                </View>

                <View
                    backgroundColor="mainBackgroundLight"
                    style={{
                        borderTopLeftRadius: 60,
                    }}
                    flex={1}
                >
                    <View
                        padding="l"
                        paddingTop="xl"
                        style={{
                            marginBottom: -20,
                        }}
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
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: 40,
                            flexGrow: 1,
                        }}
                        style={{ flex: 1 }}
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
                                Don't have an account?{' '}
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
        </ImageBackground>
    );
});

Login.displayName = 'Login';

export default Login;