import { useTheme } from '@shopify/restyle';
import React, { memo, useState } from 'react';
import { Dimensions, ImageBackground, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from '../components/ui';
import { Theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface LoginProps { }

const Login = memo(({ }: LoginProps) => {
    const theme = useTheme<Theme>();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        console.log('Login pressed:', { mobileNumber, password });
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
        console.log('Sign up pressed');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/primary_bg.webp')}
            style={{ flex: 1, width, height }}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    flex={0.65}
                    justifyContent="center"
                    alignItems="center"
                    paddingTop="xl"
                    paddingBottom="l"
                    minHeight={height * 0.25}
                >
                    <View alignItems="center">
                        <Text
                            fontSize={46}
                            fontWeight="900"
                            color="textOnPrimary"
                            textAlign="center"
                            marginBottom="m"
                            fontFamily="SF-Pro-Display-Black"
                        >
                            SMART CSK
                        </Text>
                        <Text
                            fontSize={16}
                            fontWeight="400"
                            color="textOnPrimary"
                            textAlign="center"
                            fontFamily="SF-Pro-Display-Regular"
                            lineHeight={15}
                        >
                            YOUR DAILY FOOD COURT APP
                        </Text>
                    </View>
                </View>

                <View
                    backgroundColor="mainBackground"
                    borderTopLeftRadius="xl"
                    padding="l"
                    paddingTop="xl"
                    minHeight={height * 0.55}
                >
                    <Text
                        fontSize={30}
                        fontWeight="600"
                        color="textPrimary"
                        textAlign="left"
                        marginBottom="xl"
                        fontFamily="Inter-Medium"
                    >
                        Login
                    </Text>

                    <View marginBottom="l">
                        <Text
                            fontSize={14}
                            fontWeight="400"
                            color="textSecondary"
                            marginBottom="s"
                            fontFamily="Inter-Regular"
                        >
                            Mobile number*
                        </Text>
                        <View flexDirection="row" gap="s">
                            <View
                                flexDirection="row"
                                alignItems="center"
                                backgroundColor="inputBackground"
                                borderWidth={1}
                                borderColor="inputBorder"
                                borderRadius="s"
                                paddingHorizontal="s"
                                paddingVertical="m"
                                minWidth={80}
                            >
                                <Text
                                    fontSize={16}
                                    fontWeight="400"
                                    color="textPrimary"
                                    marginRight="xs"
                                    fontFamily="Inter-Regular"
                                >
                                    🇮🇳 +91
                                </Text>
                                <Text fontSize={12} color="textSecondary">
                                    ▼
                                </Text>
                            </View>
                            <View flex={1}>
                                <TextInput
                                    style={{
                                        backgroundColor: theme.colors.inputBackground,
                                        borderWidth: 1,
                                        borderColor: theme.colors.inputBorder,
                                        borderRadius: 8,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                        fontSize: 16,
                                        fontFamily: 'Inter-Regular',
                                    }}
                                    placeholder="Mobile number"
                                    placeholderTextColor={theme.colors.inputPlaceholder}
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                    keyboardType="phone-pad"
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
                            Password*
                        </Text>
                        <View position="relative">
                            <TextInput
                                style={{
                                    backgroundColor: theme.colors.inputBackground,
                                    borderWidth: 1,
                                    borderColor: theme.colors.inputBorder,
                                    borderRadius: 8,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    fontSize: 16,
                                    fontFamily: 'Inter-Regular',
                                    paddingRight: 50,
                                }}
                                placeholder="123456789"
                                placeholderTextColor={theme.colors.inputPlaceholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 16,
                                    top: 14,
                                }}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={{ fontSize: 20 }}>👁️</Text>
                            </TouchableOpacity>
                        </View>
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
                            <TouchableOpacity onPress={handleGoogleLogin}>
                                <View
                                    width={48}
                                    height={48}
                                    backgroundColor="inputBackground"
                                    borderWidth={1}
                                    borderColor="border"
                                    borderRadius="s"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Text fontSize={20} fontWeight="bold" color="info">
                                        G
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAppleLogin}>
                                <View
                                    width={48}
                                    height={48}
                                    backgroundColor="inputBackground"
                                    borderWidth={1}
                                    borderColor="border"
                                    borderRadius="s"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Text fontSize={20}>🍎</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View alignItems="center">
                        <Text
                            fontSize={16}
                            fontWeight="400"
                            color="textSecondary"
                            textAlign="center"
                            fontFamily="Inter-Regular"
                        >
                            Don't have an account?{' '}
                            <Text
                                fontSize={16}
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
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
});

Login.displayName = 'Login';

export default Login;