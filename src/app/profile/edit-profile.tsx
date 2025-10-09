import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Alert, Dimensions, Image, Modal, Pressable, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import Button from "../../components/ui/Button";
import CustomTextInput from "../../components/ui/TextInput";
import { betterwayApiCall } from "../../network/useApiPort";
import { setUser } from "../../store/slices/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import { Theme } from "../../theme/theme";
import { showToast } from "../../utils";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from "../cart";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const InputField = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
  }) => {
    return (
      <View marginBottom="l">
        <Text
          fontSize={12}
          fontWeight="400"
          color="textSecondary"
          fontFamily="Poppins-Regular"
          marginBottom="s"
        >
          {label}
        </Text>
        <CustomTextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          height={50}
          fontSize={14}
          fontFamily="Poppins-Regular"
        />
      </View>
    );
  },
);

InputField.displayName = "InputField";

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const theme = useTheme<Theme>();
  const [name, setName] = useState(user?.name || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [profileImage, setProfileImage] = useState(user?.image || null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleImageSelect = useCallback((imageUri: string) => {
    setProfileImage(imageUri);
    setUploadingImage(false);
  }, []);

  const handleImagePicker = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      "Select Image",
      "Choose how you want to select your profile image",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Camera", 
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              
              if (!result.canceled && result.assets[0]) {
                setUploadingImage(true);
                handleImageSelect(result.assets[0].uri);
              }
            } else {
              showToast({
                message: 'Camera permission is required',
                type: 'error',
              });
            }
          },
        },
        { 
          text: "Gallery", 
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              
              if (!result.canceled && result.assets[0]) {
                setUploadingImage(true);
                handleImageSelect(result.assets[0].uri);
              }
            } else {
              showToast({
                message: 'Gallery permission is required',
                type: 'error',
              });
            }
          },
        },
      ],
    );
  }, [handleImageSelect]);

  const formatDateForDisplay = useCallback((dateString: string) => {
    if (!dateString) return '';
    
    if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  }, []);

  const formatDateForAPI = useCallback((dateString: string) => {
    if (!dateString) return '';
    
    if (dateString.includes('/') && dateString.length === 10) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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

  const uploadImageToServer = useCallback(async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const uploadResponse = await betterwayApiCall({
        method: "POST",
        url: "UPLOAD_STUDENT_ID",
        body: formData,
        auth: token,
      });

      if (uploadResponse?.data?.success && uploadResponse?.data?.url) {
        return uploadResponse.data.url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to upload image');
    }
  }, [token]);

  const handleSaveProfile = useCallback(async () => {
    if (!token) {
      showToast({
        message: 'Please login to update profile',
        type: 'error',
      });
      return;
    }

    if (!name.trim()) {
      showToast({
        message: 'Please enter your name',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      let imageUrl = profileImage;
      
      if (profileImage && profileImage.startsWith('file://')) {
        imageUrl = await uploadImageToServer(profileImage);
      }

      const body = {
        name: name.trim(),
        dob: formatDateForAPI(dob),
        ...(imageUrl && { image: imageUrl }),
      };

      const editProfileApiCall = betterwayApiCall({
        method: "PATCH",
        url: "EDIT_PROFILE",
        body,
        auth: token,
      });

      const response = await editProfileApiCall;
      setIsLoading(false);
      
      const updatedUser = {
        id: user?.id || response.data?.id,
        name: name.trim(),
        email: user?.email || response.data?.email,
        phoneNumber: user?.phoneNumber || response.data?.phoneNumber || response.data?.phone,
        phoneNumberVerified: user?.phoneNumberVerified || response.data?.phoneNumberVerified,
        emailVerified: user?.emailVerified || response.data?.emailVerified,
        image: imageUrl,
        dob: formatDateForAPI(dob),
        role: user?.role || response.data?.role,
        banned: user?.banned || response.data?.banned,
        banReason: user?.banReason || response.data?.banReason,
        banExpires: user?.banExpires || response.data?.banExpires,
        points: user?.points || response.data?.points,
        isStudent: user?.isStudent || response.data?.isStudent,
        collegeName: user?.collegeName || response.data?.collegeName,
        course: user?.course || response.data?.course,
        branch: user?.branch || response.data?.branch,
        currentSemester: user?.currentSemester || response.data?.currentSemester,
        createdAt: user?.createdAt || response.data?.createdAt,
        updatedAt: response.data?.updatedAt || user?.updatedAt,
      };
      
      dispatch(setUser(updatedUser));
      
      showToast({
        message: 'Profile updated successfully',
        type: 'success',
      });
      router.back();
    } catch (error: any) {
      setIsLoading(false);
      showToast({
        message: error?.response?.data?.message || error?.message || 'Failed to update profile',
        type: 'error',
      });
    }
  }, [token, name, profileImage, dob, user, dispatch, formatDateForAPI, uploadImageToServer]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Edit Profile" moreAction={false} />

        <View
          flex={1}
          paddingHorizontal={pageHorizantalPadding}
          paddingTop="xl"
        >
          <View alignItems="center" marginBottom="xl">
            <View position="relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 3,
            }}
            >
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("@/assets/images/profile.jpg")
                }
                style={styles.profileImage}
              />
              <Pressable
                style={[
                  styles.editImageButton,
                  uploadingImage && { opacity: 0.5 },
                ]}
                onPress={handleImagePicker}
                disabled={uploadingImage}
              >
                <Ionicons 
                  name={uploadingImage ? "hourglass-outline" : "camera"} 
                  size={14} 
                  color="black"
                />
              </Pressable>
            </View>
          </View>

          <View marginBottom="xl">
            <InputField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />

            <View marginBottom="l">
              <Text
                fontSize={12}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                marginBottom="s"
              >
                Date of Birth
              </Text>
              <View position="relative">
                <Pressable onPress={handleCalendarPress}>
                  <CustomTextInput
                    placeholder="DD/MM/YYYY"
                    value={dob}
                    onChangeText={setDob}
                    height={50}
                    fontSize={14}
                    fontFamily="Poppins-Regular"
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
                  <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                </Pressable>
              </View>
            </View>
          </View>

          <View
            position="absolute"
            bottom={50}
            left={0}
            right={0}
            paddingHorizontal={"l"}
          >
            <Button
              title={isLoading ? "Updating..." : "Update Profile"}
              onPress={handleSaveProfile}
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </View>
      </View>

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
              width: screenWidth * 0.9,
              maxHeight: screenHeight * 0.7,
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
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
});

export default EditProfile;
