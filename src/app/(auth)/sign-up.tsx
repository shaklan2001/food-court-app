import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@shopify/restyle';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Alert, Dimensions, ImageBackground, Modal, Platform, Pressable, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Checkbox, FormContainer } from '../../components/shared';
import { Button, CountryCodeSelector, FileUpload, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall, useApiPort } from '../../network/useApiPort';
import { Theme } from '../../theme/theme';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');
const countryCode = '+91';

const SignUp = memo(() => {
    const theme = useTheme<Theme>();
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
        if (mobileNumber.length < 10) {
            showToast({
                message: 'Please enter a valid 10-digit mobile number',
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

        if (isStudentUser) {
            if (!collegeName.trim()) {
                showToast({
                    message: 'Please enter your college name',
                    type: 'error',
                });
                return false;
            }
            if (!courseName.trim()) {
                showToast({
                    message: 'Please enter your course name',
                    type: 'error',
                });
                return false;
            }
            if (!branch.trim()) {
                showToast({
                    message: 'Please enter your branch',
                    type: 'error',
                });
                return false;
            }
            if (!currentSemester.trim()) {
                showToast({
                    message: 'Please enter your current semester',
                    type: 'error',
                });
                return false;
            }
            if (!studentIdFile || !studentIdFileName) {
                showToast({
                    message: 'Please upload your student ID',
                    type: 'error',
                });
                return false;
            }
        }

        return true;
    }, [name, email, mobileNumber, dob, password, confirmPassword, isStudentUser, collegeName, courseName, branch, currentSemester, studentIdFile, studentIdFileName]);

    const sendOTP = useCallback(() => {
        return useApiPort({
            intent: "intent_send_otp_to_phone",
            port: betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phoneNumber: mobileNumber,
                },
                auth: null,
            }),
            success: (response) => {
                setIsLoading(false);
                showToast({
                    message: response?.message || 'OTP sent to your phone!',
                    type: 'success',
                });
                router.push('/otp-verify');
            },
            failure: (error) => {
                showToast({
                    message: error?.message || 'Failed to send OTP',
                    type: 'error',
                });
            },
        })();
    }, [countryCode, mobileNumber]);

    const handleSignUp = useCallback(async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        
        try {
            const fullPhoneNumber = `${countryCode}${mobileNumber}`;
            const signupData = {
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
            };
            
            await AsyncStorage.setItem('pending_signup_data', JSON.stringify(signupData));
            sendOTP();
        } catch (error: any) {
            setIsLoading(false);
            showToast({
                message: error?.message || 'Failed to send OTP',
                type: 'error',
            });
        }
    }, [validateForm, countryCode, mobileNumber, name, email, dob, password, isStudentUser, collegeName, courseName, branch, currentSemester, studentIdFile, formatDateForAPI, sendOTP]);

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
                            top={75}
                            left={24}
                            zIndex={1}
                        >
                            <Pressable onPress={handleBack}>
                                <AntDesign name="arrow-left" size={28} color="white" />
                            </Pressable>
                        </View>
                        <View alignItems="center" marginTop="l">
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