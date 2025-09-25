import * as Haptics from 'expo-haptics';
import { memo, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/ui";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const PasswordField = memo(({
  label,
  value,
  onChangeText,
  placeholder
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
});

PasswordField.displayName = 'PasswordField';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Change password pressed');
  }, []);

  return (
    <View flex={1} backgroundColor="mainBackgroundLight">
      <ScreenHeader title="Change Password" moreAction={false} />

      <View flex={1} paddingHorizontal={pageHorizantalPadding} paddingTop="xl">
        <View marginBottom="xl">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
          />
        </View>

        <View position='absolute'
          bottom={50}
          left={0}
          right={0}
          paddingHorizontal={'l'}
        >
          <Button
            title="Save"
            onPress={handleChangePassword}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChangePassword;
