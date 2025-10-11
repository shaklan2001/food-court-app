import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@shopify/restyle';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Calendar, Checkbox, FormContainer } from '../../components/shared';
import { Button, CountryCodeSelector, FileUpload, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall } from '../../network/useApiPort';
import { setPendingPhoneNumber } from '../../store/slices/authSlice';
import { Theme } from '../../theme/theme';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');
const countryCode = '+91';

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
    // Student-specific fields
    const [collegeName, setCollegeName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [branch, setBranch] = useState('');
    const [currentSemester, setCurrentSemester] = useState('');
    const [studentIdFile, setStudentIdFile] = useState<any>(null);
    const [studentIdFileName, setStudentIdFileName] = useState<string | null>(null);

    // Clear old AsyncStorage data when component mounts
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

    const fullPhoneNumber = useMemo(() => `${countryCode}${mobileNumber}`, [mobileNumber]);
    
    const signupData = useMemo(() => ({
        phone: fullPhoneNumber,
        name,
        email,
        dob: formatDateForAPI(dob),
        password,
        isStudent: isStudentUser,
        collegeName,
        courseName,
        branch,
        currentSemester,
        studentIdFile: studentIdFile ? {
            uri: studentIdFile.uri,
            type: studentIdFile.mimeType,
            name: studentIdFile.name,
        } : null,
        flow: 'signup',
    }), [fullPhoneNumber, name, email, dob, password, isStudentUser, collegeName, courseName, branch, currentSemester, studentIdFile, formatDateForAPI]);

    const isNameEmpty = useMemo(() => !name.trim(), [name]);
    const isEmailEmpty = useMemo(() => !email.trim(), [email]);
    const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
    const isMobileNumberEmpty = useMemo(() => !mobileNumber.trim(), [mobileNumber]);
    const isMobileNumberValid = useMemo(() => mobileNumber.length >= 10, [mobileNumber]);
    const isDobEmpty = useMemo(() => !dob.trim(), [dob]);
    const isPasswordEmpty = useMemo(() => !password.trim(), [password]);
    const isPasswordValid = useMemo(() => password.length >= 6, [password]);
    const isConfirmPasswordValid = useMemo(() => password === confirmPassword, [password, confirmPassword]);
    
    const isCollegeNameEmpty = useMemo(() => !collegeName.trim(), [collegeName]);
    const isCourseNameEmpty = useMemo(() => !courseName.trim(), [courseName]);
    const isBranchEmpty = useMemo(() => !branch.trim(), [branch]);
    const isCurrentSemesterEmpty = useMemo(() => !currentSemester.trim(), [currentSemester]);
    const isStudentIdFileValid = useMemo(() => !!(studentIdFile && studentIdFileName), [studentIdFile, studentIdFileName]);

    const formatDateForDisplay = useCallback((dateString: string) => {
        if (!dateString) return '';

        if (dateString.includes('-') && dateString.length === 10) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }

        return dateString;
    }, []);


    const handleCalendarPress = useCallback(() => {
        setShowCalendar(true);
    }, []);

    const handleFileUpload = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setStudentIdFile(file);
                setStudentIdFileName(file.name);
                console.log('File selected:', file);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick document. Please try again.');
        }
    }, []);

    const validateForm = useCallback(() => {
        if (isNameEmpty) {
            showToast({
                message: 'Please enter your name',
                type: 'error',
            });
            return false;
        }
        if (isEmailEmpty) {
            showToast({
                message: 'Please enter your email',
                type: 'error',
            });
            return false;
        }
        if (!isEmailValid) {
            showToast({
                message: 'Please enter a valid email address',
                type: 'error',
            });
            return false;
        }
        if (isMobileNumberEmpty) {
            showToast({
                message: 'Please enter your mobile number',
                type: 'error',
            });
            return false;
        }
        if (!isMobileNumberValid) {
            showToast({
                message: 'Please enter a valid 10-digit mobile number',
                type: 'error',
            });
            return false;
        }
        if (isDobEmpty) {
            showToast({
                message: 'Please enter your date of birth',
                type: 'error',
            });
            return false;
        }
        if (isPasswordEmpty) {
            showToast({
                message: 'Please enter a password',
                type: 'error',
            });
            return false;
        }
        if (!isPasswordValid) {
            showToast({
                message: 'Password must be at least 6 characters long',
                type: 'error',
            });
            return false;
        }
        if (!isConfirmPasswordValid) {
            showToast({
                message: 'Passwords do not match',
                type: 'error',
            });
            return false;
        }

        if (isStudentUser) {
            if (isCollegeNameEmpty) {
                showToast({
                    message: 'Please enter your college name',
                    type: 'error',
                });
                return false;
            }
            if (isCourseNameEmpty) {
                showToast({
                    message: 'Please enter your course name',
                    type: 'error',
                });
                return false;
            }
            if (isBranchEmpty) {
                showToast({
                    message: 'Please enter your branch',
                    type: 'error',
                });
                return false;
            }
            if (isCurrentSemesterEmpty) {
                showToast({
                    message: 'Please enter your current semester',
                    type: 'error',
                });
                return false;
            }
            if (!isStudentIdFileValid) {
                showToast({
                    message: 'Please upload your student ID',
                    type: 'error',
                });
                return false;
            }
        }

        return true;
    }, [isNameEmpty, isEmailEmpty, isEmailValid, isMobileNumberEmpty, isMobileNumberValid, isDobEmpty, isPasswordEmpty, isPasswordValid, isConfirmPasswordValid, isStudentUser, isCollegeNameEmpty, isCourseNameEmpty, isBranchEmpty, isCurrentSemesterEmpty, isStudentIdFileValid]);

    const sendOTP = useCallback(async () => {
        try {
            const response = await betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phoneNumber: mobileNumber,
                },
                auth: null,
            });

            if (response?.data?.message === 'code sent' || response?.status === 200) {
                setIsLoading(false);
                showToast({
                    message: response?.data?.message || 'OTP sent to your phone!',
                    type: 'success',
                });
                router.push('/otp-verify');
            } else {
                setIsLoading(false);
                showToast({
                    message: response?.data?.message || 'Failed to send OTP',
                    type: 'error',
                });
            }
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to send OTP',
                type: 'error',
            });
        }
    }, [mobileNumber]);

    const handleSignUp = useCallback(async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        
        try {
            // Store phone number in Redux
            dispatch(setPendingPhoneNumber(fullPhoneNumber));
            // Store all signup data in AsyncStorage
            await AsyncStorage.setItem('pending_signup_data', JSON.stringify(signupData));
            sendOTP();
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to send OTP',
                type: 'error',
            });
        }
    }, [validateForm, signupData, sendOTP, dispatch, fullPhoneNumber]);

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
                style={styles.background}
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
                                    style={styles.calendarIcon}
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

                        {isStudentUser && (
                            <>
                                <FormField
                                    label="College Name"
                                    required
                                    placeholder="Your college name"
                                    value={collegeName}
                                    onChangeText={setCollegeName}
                                />

                                <FormField
                                    label="Course Name"
                                    required
                                    placeholder="Your course name"
                                    value={courseName}
                                    onChangeText={setCourseName}
                                />

                                <FormField
                                    label="Branch"
                                    required
                                    placeholder="Your branch name"
                                    value={branch}
                                    onChangeText={setBranch}
                                />

                                <FormField
                                    label="Current Semester"
                                    required
                                    placeholder="Semester year"
                                    value={currentSemester}
                                    onChangeText={setCurrentSemester}
                                    keyboardType="numeric"
                                />

                                <View marginBottom="l">
                                    <FileUpload
                                        label="Student I'd"
                                        required
                                        onPress={handleFileUpload}
                                        fileName={studentIdFileName || undefined}
                                    />
                                </View>
                            </>
                        )}

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
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>

            <Calendar
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onDateSelect={(dateString) => {
                    setDob(formatDateForDisplay(dateString));
                }}
                title="Select Date of Birth"
                maxDate={new Date().toISOString().split('T')[0]}
                initialDate={dob ? formatDateForAPI(dob) : new Date().toISOString().split('T')[0]}
            />
        </>
    );
});

SignUp.displayName = 'SignUp';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width,
        height,
    },
    calendarIcon: {
        position: 'absolute',
        right: 16,
        top: 12,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SignUp;