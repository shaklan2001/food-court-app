import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { router, Stack } from 'expo-router';
import { memo, useState } from 'react';
import { Dimensions, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox, FormContainer } from '../../components/shared';
import { Button, CountryCodeSelector, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
import { Theme } from '../../theme/theme';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');

interface SignUpProps { }

const SignUp = memo(({ }: SignUpProps) => {
    const theme = useTheme<Theme>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isStudentUser, setIsStudentUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatDateForAPI = (dateString: string) => {
        if (!dateString) return '';

        if (dateString.includes('-') && dateString.length === 10) {
            return dateString;
        }

        const parts = dateString.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        return dateString;
    };

    const createUser = () =>
        useApiPort({
            intent: "intent_create_user",
            port: betterwayApiCall({
                method: "POST",
                url: "CREATE_USER",
                body: {
                    name,
                    email,
                    phone: mobileNumber,
                    dob: formatDateForAPI(dob),
                    password,
                    isStudent: isStudentUser
                },
                auth: null,
            }),
            success: (response) => {
                setIsLoading(false);
                if (response?.status) {
                    showToast({
                        message: 'Account created successfully!',
                        type: 'success',
                    });

                    setTimeout(() => {
                        if (isStudentUser) {
                            router.push('/student-sign-up');
                        } else {
                            router.push('/login');
                        }
                    }, 1500);
                } else {
                    showToast({
                        message: response?.message || 'Failed to create account',
                        type: 'error',
                    });
                }
            },
            failure: (error) => {
                setIsLoading(false);
                showToast({
                    message: error?.message || 'Failed to create account',
                    type: 'error',
                });
            },
            print: "error",
        })();

    const validateForm = () => {
        if (!name.trim()) {
            showToast({
                message: 'Please enter your name',
                type: 'error',
            });
            return false;
        }
        if (!email.trim()) {
            showToast({
                message: 'Please enter your email',
                type: 'error',
            });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast({
                message: 'Please enter a valid email address',
                type: 'error',
            });
            return false;
        }
        if (!mobileNumber.trim()) {
            showToast({
                message: 'Please enter your mobile number',
                type: 'error',
            });
            return false;
        }
        if (!dob.trim()) {
            showToast({
                message: 'Please enter your date of birth',
                type: 'error',
            });
            return false;
        }
        if (!password.trim()) {
            showToast({
                message: 'Please enter a password',
                type: 'error',
            });
            return false;
        }
        if (password.length < 6) {
            showToast({
                message: 'Password must be at least 6 characters long',
                type: 'error',
            });
            return false;
        }
        if (password !== confirmPassword) {
            showToast({
                message: 'Passwords do not match',
                type: 'error',
            });
            return false;
        }
        return true;
    };

    const handleSignUp = () => {
        // if (!validateForm()) {
        //     return;
        // }
        // setIsLoading(true);
        // createUser();
        router.push('/student-sign-up');
    };

    const handleGoogleSignUp = () => {
        console.log('Google sign up pressed');
    };

    const handleAppleSignUp = () => {
        console.log('Apple sign up pressed');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleBack = () => {
        console.log('Back pressed');
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
                                fontSize={32}
                                fontWeight="600"
                                color="textOnPrimary"
                                textAlign="center"
                                fontFamily="Poppins-Medium"
                                lineHeight={43}
                            >
                                Signup
                            </Text>
                        </View>
                    </View>

                    <FormContainer>
                        <FormField
                            label="Name"
                            required
                            placeholder="John Adward"
                            value={name}
                            onChangeText={setName}
                        />

                        <FormField
                            label="Email"
                            required
                            placeholder="123@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

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

                        <View marginBottom="l">
                            <Text
                                fontSize={14}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="s"
                                fontFamily="Poppins-Regular"
                            >
                                DOB <Text color="primary">*</Text>
                            </Text>
                            <View position="relative">
                                <FormField
                                    label=""
                                    placeholder="DD/MM/YYYY"
                                    value={dob}
                                    onChangeText={setDob}
                                    marginBottom="xs"
                                    paddingRight={50}
                                />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: 12,
                                        height: 24,
                                        width: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AntDesign name="calendar" size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
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
                                Confirm Password <Text color="primary">*</Text>
                            </Text>
                            <PasswordInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <View marginBottom="l">
                            <Checkbox
                                label="If Student User"
                                checked={isStudentUser}
                                onToggle={setIsStudentUser}
                            />
                        </View>

                        <View marginTop="s" marginBottom="l">
                            <Button
                                title={isLoading ? "Creating Account..." : "Signup"}
                                variant="primary"
                                onPress={handleSignUp}
                                disabled={isLoading}
                            />
                        </View>

                        <View alignItems="center" marginBottom="l">
                            <Text
                                fontSize={16}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="m"
                                fontFamily="Poppins-Regular"
                            >
                                Sign up with
                            </Text>
                            <View flexDirection="row" gap="m">
                                <SocialLoginButton
                                    onPress={handleGoogleSignUp}
                                    imageSource={require('../../../assets/images/google-logo.png')}
                                />
                                <SocialLoginButton
                                    onPress={handleAppleSignUp}
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
                                fontFamily="Poppins-Regular"
                            >
                                Already have an account?{' '}
                                <Text
                                    fontSize={14}
                                    fontWeight="700"
                                    color="textPrimary"
                                    textDecorationLine="underline"
                                    fontFamily="Poppins-Bold"
                                    onPress={handleLogin}
                                >
                                    Login
                                </Text>
                            </Text>
                        </View>
                    </FormContainer>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
});

SignUp.displayName = 'SignUp';

export default SignUp;