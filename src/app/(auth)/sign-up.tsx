import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Dimensions, ImageBackground, Modal, Platform, Pressable, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Checkbox, FormContainer } from '../../components/shared';
import { Button, CountryCodeSelector, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall } from '../../network/useApiPort';
import { setUser } from '../../store/slices/authSlice';
import { Theme } from '../../theme/theme';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');

const SignUp = memo(() => {
    const theme = useTheme<Theme>();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isStudentUser, setIsStudentUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const formatDateForAPI = useCallback((dateString: string) => {
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
    }, []);

    const formatDateForDisplay = useCallback((dateString: string) => {
        if (!dateString) return '';

        if (dateString.includes('-') && dateString.length === 10) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }

        return dateString;
    }, []);

    const handleDateSelect = useCallback((day: any) => {
        const selectedDate = day.dateString;
        setDob(formatDateForDisplay(selectedDate));
        setShowCalendar(false);
    }, [formatDateForDisplay]);

    const handleCalendarPress = useCallback(() => {
        setShowCalendar(true);
    }, []);

    const createUser = useCallback(async () => {
        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "CREATE_USER",
                body: {
                    name,
                    email,
                    phone: mobileNumber,
                    dob: formatDateForAPI(dob),
                    password,
                    isStudent: isStudentUser,
                },
                auth: null,
            });
            
            console.log('API Response:', response);
            
            if (response?.data?.success && response?.data?.user) {
                const userData = response.data.user;
                
                dispatch(setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone,
                    dob: userData.dob,
                    isStudent: userData.isStudent,
                    image: userData.image,
                }));
                
                showToast({
                    message: 'Account created successfully!',
                    type: 'success',
                });

                setTimeout(() => {
                    setIsLoading(false);
                    if (isStudentUser) {
                        router.push('/student-sign-up');
                    } else {
                        router.push('/(tabs)');
                    }
                }, 1500);
            } else {
                setIsLoading(false);
                showToast({
                    message: response?.data?.message || 'Failed to create account',
                    type: 'error',
                });
            }
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to create account',
                type: 'error',
            });
        }
    }, [name, email, mobileNumber, dob, password, isStudentUser, dispatch, formatDateForAPI]);

    const validateForm = useCallback(() => {
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
    }, [name, email, mobileNumber, dob, password, confirmPassword]);

    const handleSignUp = useCallback(() => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        createUser();
    }, [validateForm, createUser]);

    const handleGoogleSignUp = useCallback(() => {
        console.log('Google sign up pressed');
    }, []);

    const handleAppleSignUp = useCallback(() => {
        console.log('Apple sign up pressed');
    }, []);

    const handleLogin = useCallback(() => {
        router.push('/login');
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

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
                    <View
                        justifyContent="center"
                        alignItems="center"
                        paddingTop="xl"
                        paddingBottom="l"
                        minHeight={height * 0.15}
                    >
                        <View
                            position="absolute"
                            top={70}
                            left={24}
                            zIndex={1}
                        >
                            <Pressable onPress={handleBack}>
                                <AntDesign name="arrow-left" size={28} color="white" />
                            </Pressable>
                        </View>
                        <View alignItems="center">
                            <Text
                                fontSize={42}
                                fontWeight="medium"
                                color="textOnPrimary"
                                textAlign="center"
                                fontFamily="Poppins-Medium"
                                lineHeight={54}
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
                                fontSize={12}
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
                                fontSize={12}
                                fontWeight="400"
                                color="textSecondary"
                                marginBottom="s"
                                fontFamily="Poppins-Regular"
                            >
                                DOB <Text color="primary">*</Text>
                            </Text>
                            <View position="relative">
                                <Pressable onPress={handleCalendarPress}>
                                    <FormField
                                        label=""
                                        placeholder="DD/MM/YYYY"
                                        value={dob}
                                        onChangeText={setDob}
                                        marginBottom="xs"
                                        paddingRight={50}
                                        editable={false}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={handleCalendarPress}
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
                                </Pressable>
                            </View>
                        </View>

                        <View marginBottom="l">
                            <Text
                                fontSize={12}
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
                                fontSize={12}
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
                                title="Signup"
                                variant="primary"
                                onPress={handleSignUp}
                                loading={isLoading}
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
                              {Platform.OS === 'android' && <SocialLoginButton
                                    onPress={handleGoogleSignUp}
                                    imageSource={require('../../../assets/images/google-logo.png')}
                                />}
                                {Platform.OS === 'ios' && <SocialLoginButton
                                    onPress={handleAppleSignUp}
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
                                Already have an account?{' '}
                                <Text
                                    fontSize={16}
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

            <Modal
                visible={showCalendar}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCalendar(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 20,
                            margin: 20,
                            width: width * 0.9,
                            maxHeight: height * 0.7,
                        }}
                    >
                        <View
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            marginBottom="l"
                        >
                            <Text
                                fontSize={18}
                                fontWeight="600"
                                color="textPrimary"
                                fontFamily="Poppins-SemiBold"
                            >
                                Select Date of Birth
                            </Text>
                            <Pressable onPress={() => setShowCalendar(false)}>
                                <AntDesign name="close" size={24} color={theme.colors.textSecondary} />
                            </Pressable>
                        </View>
                        
                        <Calendar
                            onDayPress={handleDateSelect}
                            theme={{
                                backgroundColor: 'white',
                                calendarBackground: 'white',
                                textSectionTitleColor: theme.colors.textPrimary,
                                selectedDayBackgroundColor: theme.colors.primary,
                                selectedDayTextColor: 'white',
                                todayTextColor: theme.colors.primary,
                                dayTextColor: theme.colors.textPrimary,
                                textDisabledColor: theme.colors.textSecondary,
                                dotColor: theme.colors.primary,
                                selectedDotColor: 'white',
                                arrowColor: theme.colors.primary,
                                disabledArrowColor: theme.colors.textSecondary,
                                monthTextColor: theme.colors.textPrimary,
                                indicatorColor: theme.colors.primary,
                                textDayFontFamily: 'Poppins-Regular',
                                textMonthFontFamily: 'Poppins-SemiBold',
                                textDayHeaderFontFamily: 'Poppins-Medium',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14,
                            }}
                            maxDate={new Date().toISOString().split('T')[0]}
                            initialDate={dob ? formatDateForAPI(dob) : new Date().toISOString().split('T')[0]}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
});

SignUp.displayName = 'SignUp';

export default SignUp;