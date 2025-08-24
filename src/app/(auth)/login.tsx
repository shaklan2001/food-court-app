import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import { Alert, Dimensions, Image, ImageBackground, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, CountryCodeSelector, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
const { width, height } = Dimensions.get('window');

interface LoginProps { }

const Login = memo(({ }: LoginProps) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login pressed:', { mobileNumber, password });

        router.push('/otp-verify');

        // if (mobileNumber.trim() && password.trim()) {
        //     router.push('/otp-verify');
        // } else {
        //     Alert.alert('Error', 'Please enter mobile number and password');
        // }
    };

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

    return (
        <ImageBackground
            source={require('../../../assets/images/primary_bg.webp')}
            style={{ flex: 1, width, height }}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    justifyContent="center"
                    alignItems="center"
                    minHeight={height * 0.25}
                >
                    <Image
                        source={require('../../../assets/images/font-logo.png')}
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
                            fontSize={20}
                            fontWeight="600"
                            color="textPrimary"
                            textAlign="left"
                            marginBottom="l"
                            fontFamily="SF-Pro"
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
                        <View marginBottom="l">
                            <Text
                                fontSize={14}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="s"
                                fontFamily="Inter-Regular"
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

                        <View marginBottom="l">
                            <Text
                                fontSize={14}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="s"
                                fontFamily="Inter-Regular"
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
                                title="LOGIN"
                                variant="primary"
                                onPress={handleLogin}
                            />
                        </View>

                        <TouchableOpacity onPress={handleForgotPassword}>
                            <View alignItems="center" marginBottom="l">
                                <Text
                                    fontSize={16}
                                    fontWeight="400"
                                    color="loginBackground"
                                    fontFamily="Inter-Regular"
                                >
                                    Forgot password?
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View alignItems="center" marginBottom="l">
                            <Text
                                fontSize={16}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="m"
                                fontFamily="Inter-Regular"
                            >
                                Login with
                            </Text>
                            <View flexDirection="row" gap="m">
                                <SocialLoginButton
                                    onPress={handleGoogleLogin}
                                    imageSource={require('../../../assets/images/google-logo.png')}
                                />
                                <SocialLoginButton
                                    onPress={handleAppleLogin}
                                    imageSource={require('../../../assets/images/apple-logo.png')}
                                />
                            </View>
                        </View>

                        <View alignItems="center">
                            <Text
                                fontSize={14}
                                fontWeight="400"
                                color="textSecondary"
                                textAlign="center"
                                fontFamily="Inter-Regular"
                            >
                                Don't have an account?{' '}
                                <Text
                                    fontSize={14}
                                    fontWeight="700"
                                    color="textPrimary"
                                    textDecorationLine="underline"
                                    fontFamily="Inter-Bold"
                                    onPress={handleSignUp}
                                >
                                    Sign Up
                                </Text>
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
});

Login.displayName = 'Login';

export default Login;