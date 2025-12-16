import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileUpload, FormField, Text, View } from "../../components/ui";
import Button from "../../components/ui/Button";
import { betterwayApiCall } from "../../network/useApiPort";
import { setUser } from "../../store/slices/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import { showToast } from "../../utils";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from "../cart";

const RegisterStudent = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const [collegeName, setCollegeName] = useState(user?.collegeName || "");
  const [courseName, setCourseName] = useState(user?.course || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [currentSemester, setCurrentSemester] = useState(user?.currentSemester || "");
  const [studentIdFile, setStudentIdFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [studentIdFileName, setStudentIdFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setStudentIdFile(file);
        setStudentIdFileName(file.name);
      }
    } catch {
      showToast({
        message: 'Failed to pick document. Please try again.',
        type: 'error',
      });
    }
  }, []);

  const uploadStudentIdToServer = useCallback(async (file: DocumentPicker.DocumentPickerAsset) => {
    try {
      setUploadingFile(true);
      
      if (!file.uri) {
        throw new Error('File URI is missing');
      }
      
      // Determine file type
      let fileType = file.mimeType;
      if (!fileType) {
        if (file.name?.endsWith('.png')) {
          fileType = 'image/png';
        } else if (file.name?.endsWith('.jpg') || file.name?.endsWith('.jpeg')) {
          fileType = 'image/jpeg';
        } else {
          fileType = 'image/jpeg';
        }
      }
      
      const fileName = file.name || 'student-id.jpg';

      // Create FormData and append file to payload (form-data format)
      // The file is sent in the request body/payload, not in headers
      const formData = new FormData();
      
      // Append file with key 'file' - this matches the API expectation
      // React Native FormData format: { uri, type, name }
      formData.append('file', {
        uri: file.uri,
        type: fileType,
        name: fileName,
      } as any);

      const uploadResponse = await betterwayApiCall({
        method: "POST",
        url: "UPLOAD_STUDENT_ID",
        body: formData,
        auth: token,
      });

      const responseData = uploadResponse?.data;
      
      if (responseData?.success && responseData?.url) {
        setUploadingFile(false);
        return responseData.url;
      } else if (responseData?.url) {
        setUploadingFile(false);
        return responseData.url;
      } else {
        setUploadingFile(false);
        throw new Error(responseData?.error || 'Failed to upload student ID');
      }
    } catch (error: unknown) {
      setUploadingFile(false);
      let errorMessage = 'Failed to upload student ID';
      
      if (error && typeof error === 'object') {
        if ('response' in error) {
          const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
          errorMessage = axiosError.response?.data?.error || 
                        axiosError.response?.data?.message || 
                        errorMessage;
        } else if ('message' in error) {
          errorMessage = String(error.message);
        }
      }
      
      throw new Error(errorMessage);
    }
  }, [token]);

  const handleRegisterStudent = useCallback(async () => {
    if (!token) {
      showToast({
        message: 'Please login to register as student',
        type: 'error',
      });
      return;
    }

    if (!collegeName.trim()) {
      showToast({
        message: 'Please enter your college name',
        type: 'error',
      });
      return;
    }

    if (!courseName.trim()) {
      showToast({
        message: 'Please enter your course name',
        type: 'error',
      });
      return;
    }

    if (!branch.trim()) {
      showToast({
        message: 'Please enter your branch',
        type: 'error',
      });
      return;
    }

    if (!currentSemester.trim()) {
      showToast({
        message: 'Please enter your current semester',
        type: 'error',
      });
      return;
    }

    if (!studentIdFile) {
      showToast({
        message: 'Please upload your student ID card',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Upload student ID first
      const studentIdUrl = await uploadStudentIdToServer(studentIdFile);

      // Update profile with student information
      const body = {
        isStudent: true,
        collegeName: collegeName.trim(),
        course: courseName.trim(),
        branch: branch.trim(),
        currentSemester: currentSemester.trim(),
        studentIdImage: studentIdUrl,
      };

      const response = await betterwayApiCall({
        method: "PATCH",
        url: "EDIT_PROFILE",
        body,
        auth: token,
      });

      setIsLoading(false);
      
      // Update user state
      const updatedUser = {
        id: user?.id || response.data?.id,
        name: user?.name || response.data?.name,
        email: user?.email || response.data?.email,
        phoneNumber: user?.phoneNumber || response.data?.phoneNumber || response.data?.phone,
        phoneNumberVerified: user?.phoneNumberVerified || response.data?.phoneNumberVerified,
        emailVerified: user?.emailVerified || response.data?.emailVerified,
        image: user?.image || response.data?.image,
        dob: user?.dob || response.data?.dob,
        role: user?.role || response.data?.role,
        banned: user?.banned || response.data?.banned,
        banReason: user?.banReason || response.data?.banReason,
        banExpires: user?.banExpires || response.data?.banExpires,
        points: user?.points || response.data?.points,
        isStudent: true,
        collegeName: collegeName.trim(),
        course: courseName.trim(),
        branch: branch.trim(),
        currentSemester: currentSemester.trim(),
        studentIdImage: studentIdUrl,
        createdAt: user?.createdAt || response.data?.createdAt,
        updatedAt: response.data?.updatedAt || user?.updatedAt,
      };
      
      dispatch(setUser(updatedUser));
      
      showToast({
        message: 'Successfully registered as student!',
        type: 'success',
      });
      router.back();
    } catch (error: unknown) {
      setIsLoading(false);
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Failed to register as student';
      showToast({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [token, collegeName, courseName, branch, currentSemester, studentIdFile, user, dispatch, uploadStudentIdToServer]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Register as Student" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            flex={1}
            paddingHorizontal={pageHorizantalPadding}
            paddingTop="xl"
          >
            <View marginBottom="l">
              <Text
                fontSize={16}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                marginBottom="m"
              >
                Please fill in your student details to register as a student.
              </Text>
            </View>

            <FormField
              label="College Name"
              required
              placeholder="Enter your college name"
              value={collegeName}
              onChangeText={setCollegeName}
            />

            <FormField
              label="Course Name"
              required
              placeholder="Enter your course name"
              value={courseName}
              onChangeText={setCourseName}
            />

            <FormField
              label="Branch"
              required
              placeholder="Enter your branch"
              value={branch}
              onChangeText={setBranch}
            />

            <FormField
              label="Current Semester"
              required
              placeholder="Enter your current semester"
              value={currentSemester}
              onChangeText={setCurrentSemester}
              keyboardType="numeric"
            />

            <View marginBottom="l">
              <FileUpload
                label="Student ID Card"
                required
                onPress={handleFileUpload}
                fileName={studentIdFileName || undefined}
                uploadText="Upload your student ID card here"
                description="Upload image or PDF of your student ID card (upto 1MB)"
              />
            </View>

          </View>
        </ScrollView>

        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingHorizontal={pageHorizantalPadding}
          paddingBottom="l"
          backgroundColor="mainBackgroundLight"
          paddingTop="m"
          style={{
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
          }}
        >
          <Button
            title={isLoading ? "Registering..." : "Register as Student"}
            onPress={handleRegisterStudent}
            variant="primary"
            disabled={isLoading || uploadingFile}
            loading={isLoading || uploadingFile}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterStudent;
