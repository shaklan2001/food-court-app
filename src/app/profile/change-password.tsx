import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import CustomTextInput from "../../components/ui/TextInput";
import { betterwayApiCall } from "../../network/useApiPort";
import { RootState, useAppSelector } from "../../store/store";
import { showToast } from "../../utils";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from "../cart";

const PasswordField = memo(
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
        <PasswordInput
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

PasswordField.displayName = "PasswordField";

const ChangePassword = () => {
  const { user, token } = useAppSelector((state: RootState) => state.auth);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTPAndChangePassword = useCallback(async () => {
    // Validation
    if (!user?.phoneNumber) {
      showToast({
        message: 'Phone number not found',
        type: 'error',
      });
      return;
    }

    if (!newPassword.trim()) {
      showToast({
        message: 'Please enter new password',
        type: 'error',
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        message: 'Password must be at least 6 characters',
        type: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        message: 'Passwords do not match',
        type: 'error',
      });
      return;
    }

    // If OTP not sent yet, send it first
    if (!otpSent) {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        const response = await betterwayApiCall({
          method: "POST",
          url: "PASSWORD_RESET_OTP",
          body: {
            phoneNumber: user.phoneNumber,
          },
          auth: token,
        });

        setIsLoading(false);
        
        if (response?.data?.status) {
          setOtpSent(true);
          showToast({
            message: 'OTP sent to your phone',
            type: 'success',
          });
        } else {
          showToast({
            message: response?.data?.message || 'Failed to send OTP',
            type: 'error',
          });
        }
      } catch (error: any) {
        setIsLoading(false);
        showToast({
          message: error?.response?.data?.message || 'Failed to send OTP',
          type: 'error',
        });
      }
      return;
    }

    // If OTP is sent, verify and change password
    if (!otp.trim()) {
      showToast({
        message: 'Please enter OTP',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await betterwayApiCall({
        method: "POST",
        url: "RESET_PASSWORD",
        body: {
          phoneNumber: user.phoneNumber,
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        },
        auth: token,
      });

      setIsLoading(false);

      if (response?.data?.status || response?.data?.success) {
        showToast({
          message: 'Password changed successfully',
          type: 'success',
        });
        router.back();
      } else {
        showToast({
          message: response?.data?.message || 'Failed to change password',
          type: 'error',
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      showToast({
        message: error?.response?.data?.message || 'Failed to change password',
        type: 'error',
      });
    }
  }, [user, token, newPassword, confirmPassword, otp, otpSent]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Change Password" moreAction={false} />

        <View
          flex={1}
          paddingHorizontal={pageHorizantalPadding}
          paddingTop="xl"
        >
          <View marginBottom="xl">
            <PasswordField
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />

            {otpSent && (
              <View marginBottom="l">
                <Text
                  fontSize={12}
                  fontWeight="400"
                  color="textSecondary"
                  fontFamily="Poppins-Regular"
                  marginBottom="s"
                >
                  OTP (sent to {user?.phoneNumber})
                </Text>
                <CustomTextInput
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  height={50}
                  fontSize={14}
                  fontFamily="Poppins-Regular"
                />
              </View>
            )}
          </View>

          <View
            position="absolute"
            bottom={50}
            left={0}
            right={0}
            paddingHorizontal={"l"}
          >
            <Button
              title={
                isLoading 
                  ? (otpSent ? "Verifying..." : "Sending OTP...") 
                  : (otpSent ? "Verify OTP & Change Password" : "Change Password")
              }
              onPress={handleSendOTPAndChangePassword}
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
