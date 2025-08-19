import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import { Theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Login = () => {
    const theme = useTheme<Theme>();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Handle login logic here
        console.log('Login pressed:', { mobileNumber, password });
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic
        console.log('Forgot password pressed');
    };

    const handleGoogleLogin = () => {
        // Handle Google login
        console.log('Google login pressed');
    };

    const handleAppleLogin = () => {
        // Handle Apple login
        console.log('Apple login pressed');
    };

    const handleSignUp = () => {
        // Navigate to sign up screen
        console.log('Sign up pressed');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/primary_bg.webp')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.safeArea}>
                {/* Top Branding Section */}
                <View style={styles.brandingSection}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>SMART CSK</Text>
                        <Text style={styles.taglineText}>YOUR DAILY FOOD COURT APP</Text>
                    </View>
                </View>

                {/* Login Form Section */}
                <View style={styles.formSection}>
                    <Text style={styles.loginTitle}>Login</Text>

                    {/* Mobile Number Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mobile number*</Text>
                        <View style={styles.mobileInputRow}>
                            <View style={styles.countryCodeContainer}>
                                <Text style={styles.countryCode}>🇮🇳 +91</Text>
                                <Text style={styles.dropdownIcon}>▼</Text>
                            </View>
                            <TextInput
                                style={styles.mobileInput}
                                placeholder="Mobile number"
                                placeholderTextColor={theme.colors.inputPlaceholder}
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password*</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="123456789"
                                placeholderTextColor={theme.colors.inputPlaceholder}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIconText}>👁️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <Button
                        title="LOGIN"
                        variant="primary"
                        onPress={handleLogin}
                        style={styles.loginButton}
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Social Login */}
                    <View style={styles.socialLoginContainer}>
                        <Text style={styles.socialLoginText}>Login with</Text>
                        <View style={styles.socialButtonsRow}>
                            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                                <Text style={styles.googleText}>G</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                                <Text style={styles.appleText}>🍎</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                            Don't have an account?{' '}
                            <Text style={styles.signUpLink} onPress={handleSignUp}>
                                Sign Up
                            </Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    safeArea: {
        flex: 1,
    },
    brandingSection: {
        flex: 0.65, // Slightly increase to ensure subheading is visible
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50, // Reduce padding to fit content better
        paddingBottom: 30, // Add bottom padding for spacing
        minHeight: height * 0.25, // Ensure minimum height for branding
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 46,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12, // Increase margin to separate from tagline
        fontFamily: 'SF-Pro-Display-Black',
    },
    taglineText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'SF-Pro-Display-Regular',
        lineHeight: 15, // Add line height for better readability
    },
    formSection: {
        backgroundColor: '#F8F8F8',
        borderTopLeftRadius: 60,
        padding: 24,
        paddingTop: 32,
        minHeight: height * 0.55, // Reduce from 0.6 to 0.55 to give more space for branding
    },
    loginTitle: {
        fontSize: 30,
        fontWeight: '600',
        color: '#010101',
        textAlign: 'left',
        marginBottom: 32,
        fontFamily: 'Inter-Medium',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B7280',
        marginBottom: 8,
        fontFamily: 'Inter-Regular',
    },
    mobileInputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FAF0EF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        minWidth: 80,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '400',
        color: '#010101',
        marginRight: 4,
        fontFamily: 'Inter-Regular',
    },
    dropdownIcon: {
        fontSize: 12,
        color: '#6B7280',
    },
    mobileInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FAF0EF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    passwordInputContainer: {
        position: 'relative',
    },
    passwordInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FAF0EF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 14,
    },
    eyeIconText: {
        fontSize: 20,
    },
    loginButton: {
        marginTop: 8,
        marginBottom: 16,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#A20538',
        fontFamily: 'Inter-Regular',
    },
    socialLoginContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    socialLoginText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6B7280',
        marginBottom: 16,
        fontFamily: 'Inter-Regular',
    },
    socialButtonsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    socialButton: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    appleText: {
        fontSize: 20,
    },
    signUpContainer: {
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },
    signUpLink: {
        fontSize: 16,
        fontWeight: '700',
        color: '#010101',
        textDecorationLine: 'underline',
        fontFamily: 'Inter-Bold',
    },
});

export default Login;