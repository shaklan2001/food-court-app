import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, View as RNView, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox, FormContainer } from '../../components/shared';
import { Button, CountryCodeSelector, FileUpload, FormField, PasswordInput, SocialLoginButton, Text, View } from '../../components/ui';
import { betterwayApiCall } from '../../network/useApiPort';
import { useGoogleAuth } from '../../services/googleAuthService';
import { showToast } from '../../utils';

const { width, height } = Dimensions.get('window');
const countryCode = '+91';

const SignUp = memo(() => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isStudentUser, setIsStudentUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [branch, setBranch] = useState('');
    const [currentSemester, setCurrentSemester] = useState('');
    const [studentIdFile, setStudentIdFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [studentIdFileName, setStudentIdFileName] = useState<string | null>(null);

    const getFormattedDob = useCallback(() => {
        if (!day || !month || !year || year.length !== 4) return '';
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }, [day, month, year]);

    const fullPhoneNumber = useMemo(() => `${countryCode}${mobileNumber}`, [mobileNumber]);

    const isNameEmpty = useMemo(() => !name.trim(), [name]);
    const isEmailEmpty = useMemo(() => !email.trim(), [email]);
    const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
    const isMobileNumberEmpty = useMemo(() => !mobileNumber.trim(), [mobileNumber]);
    const isMobileNumberValid = useMemo(() => mobileNumber.length >= 10, [mobileNumber]);
    const isPasswordEmpty = useMemo(() => !password.trim(), [password]);
    const isPasswordValid = useMemo(() => password.length >= 6, [password]);
    const isConfirmPasswordValid = useMemo(() => password === confirmPassword, [password, confirmPassword]);
    
    const isCollegeNameEmpty = useMemo(() => !collegeName.trim(), [collegeName]);
    const isCourseNameEmpty = useMemo(() => !courseName.trim(), [courseName]);
    const isBranchEmpty = useMemo(() => !branch.trim(), [branch]);
    const isCurrentSemesterEmpty = useMemo(() => !currentSemester.trim(), [currentSemester]);
    const isStudentIdFileValid = useMemo(() => !!(studentIdFile && studentIdFileName), [studentIdFile, studentIdFileName]);

    const calculateAge = useCallback((dayStr: string, monthStr: string, yearStr: string): number | null => {
        const dayNum = parseInt(dayStr, 10);
        const monthNum = parseInt(monthStr, 10);
        const yearNum = parseInt(yearStr, 10);

        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
            return null;
        }

        const birthDate = new Date(yearNum, monthNum - 1, dayNum);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }, []);

    // Validate date for form submission
    const validateDate = useCallback((): boolean => {
        if (!day || !month || !year) {
            showToast({
                message: 'Please enter your date of birth',
                type: 'error',
            });
            return false;
        }

        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
            showToast({
                message: 'Please enter a valid date',
                type: 'error',
            });
            return false;
        }

        if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
            showToast({
                message: 'Please enter a valid date',
                type: 'error',
            });
            return false;
        }

        if (year.length !== 4) {
            showToast({
                message: 'Please enter a valid 4-digit year',
                type: 'error',
            });
            return false;
        }

        // Check if date is valid (e.g., Feb 30 is invalid)
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
            showToast({
                message: 'Please enter a valid date',
                type: 'error',
            });
            return false;
        }

        // Check if date is in the future
        if (date > new Date()) {
            showToast({
                message: 'Date of birth cannot be in the future',
                type: 'error',
            });
            return false;
        }

        // Check age (must be at least 13 years old)
        const age = calculateAge(day, month, year);
        if (age === null || age < 13) {
            showToast({
                message: 'You must be at least 13 years old to sign up',
                type: 'error',
            });
            return false;
        }

        return true;
    }, [day, month, year, calculateAge]);

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
            }
        } catch {
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
        // Validate date of birth
        if (!validateDate()) {
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
    }, [isNameEmpty, isEmailEmpty, isEmailValid, isMobileNumberEmpty, isMobileNumberValid, isPasswordEmpty, isPasswordValid, isConfirmPasswordValid, isStudentUser, isCollegeNameEmpty, isCourseNameEmpty, isBranchEmpty, isCurrentSemesterEmpty, isStudentIdFileValid, validateDate]);

    const uploadStudentId = useCallback(async (file: DocumentPicker.DocumentPickerAsset): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.mimeType || 'image/jpeg',
                name: file.name,
            } as unknown as Blob);

            const uploadResponse = await betterwayApiCall({
                method: "POST",
                url: "UPLOAD_STUDENT_ID",
                body: formData,
                auth: null,
            });

            if (uploadResponse?.data?.url) {
                return uploadResponse.data.url;
            }
            return null;
        } catch {
            showToast({
                message: 'Failed to upload student ID',
                type: 'error',
            });
            return null;
        }
    }, []);

    const handleSignUp = useCallback(async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        
        try {
            let studentIdImageUrl = null;

            // Upload student ID if user is a student
            if (isStudentUser && studentIdFile) {
                studentIdImageUrl = await uploadStudentId(studentIdFile);
                
                if (!studentIdImageUrl) {
                    setIsLoading(false);
                    return;
                }
            }

            const createUserBody: {
                name: string;
                email: string;
                phone: string;
                dob: string;
                password: string;
                isStudent: boolean;
                collegeName?: string;
                courseName?: string;
                branch?: string;
                currentSemester?: string;
                studentIdImage?: string;
            } = {
                name,
                email,
                phone: fullPhoneNumber,
                dob: getFormattedDob(),
                password,
                isStudent: isStudentUser,
            };

            if (isStudentUser) {
                createUserBody.collegeName = collegeName;
                createUserBody.courseName = courseName;
                createUserBody.branch = branch;
                createUserBody.currentSemester = currentSemester;
                if (studentIdImageUrl) {
                    createUserBody.studentIdImage = studentIdImageUrl;
                }
            }

            const sendOtpResponse = await betterwayApiCall({
                method: "POST",
                url: "SEND_OTP_TO_PHONE",
                body: {
                    phoneNumber: fullPhoneNumber,
                },
                auth: null,
            });

            if (sendOtpResponse?.data?.message === 'code sent' || sendOtpResponse?.status === 200) {
                await AsyncStorage.removeItem('pending_otp_data');
                await AsyncStorage.setItem('pending_otp_data', JSON.stringify({
                    phone: fullPhoneNumber,
                    flow: 'signUp',
                    createUserPayload: createUserBody,
                }));

                setIsLoading(false);
                
                showToast({
                    message: 'OTP sent to your mobile number.',
                    type: 'success',
                });

                router.push('/otp-verify');
                return;
            }

            throw new Error(sendOtpResponse?.data?.message || 'Failed to send OTP');
        } catch (error) {
            const errorMessage = (error as { message?: string })?.message 
                || (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
                || (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message
                || 'Failed to start verification';
            
            setIsLoading(false);
            showToast({
                message: errorMessage,
                type: 'error',
            });
        }
    }, [validateForm, isStudentUser, studentIdFile, uploadStudentId, name, email, fullPhoneNumber, getFormattedDob, password, collegeName, courseName, branch, currentSemester]);

    // Initialize Google auth hook - Better Auth handles everything internally
    const { signInWithGoogle, isLoading: isGoogleAuthLoading } = useGoogleAuth();

    const handleGoogleSignUp = useCallback(async () => {
        await signInWithGoogle();
    }, [signInWithGoogle]);

    const handleAppleSignUp = useCallback(() => {
        showToast({
            message: 'Apple sign up coming soon',
            type: 'info',
        });
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
                            
                            <View flexDirection="row" gap="s">
                                <View flex={1}>
                                    <FormField
                                        label=""
                                        placeholder="DD"
                                        value={day}
                                        onChangeText={(text) => {
                                            const num = text.replace(/[^0-9]/g, '');
                                            if (num === '' || (parseInt(num, 10) <= 31)) {
                                                setDay(num.length <= 2 ? num : num.slice(0, 2));
                                            }
                                        }}
                                        keyboardType="numeric"
                                        marginBottom="none"
                                    />
                                </View>
                                <View flex={1}>
                                    <FormField
                                        label=""
                                        placeholder="MM"
                                        value={month}
                                        onChangeText={(text) => {
                                            const num = text.replace(/[^0-9]/g, '');
                                            if (num === '' || (parseInt(num, 10) <= 12)) {
                                                setMonth(num.length <= 2 ? num : num.slice(0, 2));
                                            }
                                        }}
                                        keyboardType="numeric"
                                        marginBottom="none"
                                    />
                                </View>
                                <View flex={1.5}>
                                    <FormField
                                        label=""
                                        placeholder="YYYY"
                                        value={year}
                                        onChangeText={(text) => {
                                            const num = text.replace(/[^0-9]/g, '');
                                            setYear(num.length <= 4 ? num : num.slice(0, 4));
                                        }}
                                        keyboardType="numeric"
                                        marginBottom="none"
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
                                        uploadText="Upload your student I'd here"
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
                                <SocialLoginButton
                                    onPress={handleGoogleSignUp}
                                    imageSource={require('../../../assets/images/google-logo.png')}
                                    disabled={isGoogleAuthLoading}
                                />
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
});

export default SignUp;