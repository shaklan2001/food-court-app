import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { memo, useState } from 'react';
import { Alert, Dimensions, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormContainer } from '../../components/shared';
import { Button, FileUpload, FormField, Text, View } from '../../components/ui';

const { width, height } = Dimensions.get('window');

interface StudentSignUpProps { }

const StudentSignUp = memo(({ }: StudentSignUpProps) => {
  const [collegeName, setCollegeName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [branch, setBranch] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [studentIdFile, setStudentIdFile] = useState<string | null>(null);

  const handleSignUp = () => {
    router.push('/');
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setStudentIdFile(file.name);
        console.log('File selected:', file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
    console.log('Back pressed');
  };

  const handleLogin = () => {
    router.push('/login');
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
                fontWeight="medium"
                color="textOnPrimary"
                textAlign="center"
                fontFamily="Poppins-Medium"
                lineHeight={43}
                marginLeft="xl"
              >
                For Students
              </Text>
            </View>
          </View>

          <FormContainer>
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

            <FileUpload
              label="Student I'd"
              required
              onPress={handleFileUpload}
              fileName={studentIdFile || undefined}
            />

            <View marginTop="s" marginBottom="l">
              <Button
                title="Signup"
                variant="primary"
                onPress={handleSignUp}
              />
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

StudentSignUp.displayName = 'StudentSignUp';

export default StudentSignUp;