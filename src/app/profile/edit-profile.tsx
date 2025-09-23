import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../../components/ui";
import Button from "../../components/ui/Button";
import CustomTextInput from "../../components/ui/TextInput";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const InputField = memo(({
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
});

const EditProfile = () => {
    const [name, setName] = useState('Nishant Singh');
    const [position, setPosition] = useState('Student');
    const [profileImage, setProfileImage] = useState(null);

    const handleSaveProfile = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Profile saved:', { name, position });
    }, [name, position]);


    return (
        <View flex={1} backgroundColor="mainBackgroundLight">
            <ScreenHeader title="Edit Profile" moreAction={false} />

            <View flex={1} paddingHorizontal={pageHorizantalPadding} paddingTop="xl">
                <View alignItems="center" marginBottom="xl">
                    <View position="relative">
                        <Image
                            source={profileImage ? { uri: profileImage } : require('@/assets/images/profile.jpg')}
                            style={styles.profileImage}
                        />
                        <Pressable
                            style={styles.editImageButton}
                            onPress={() => {/* TODO: Implement image picker */ }}
                        >
                            <Ionicons name="camera" size={14} color="black" />
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

                    <InputField
                        label="Your Position"
                        value={position}
                        onChangeText={setPosition}
                        placeholder="Enter your position"
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
                        onPress={handleSaveProfile}
                        variant="primary"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'white',
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E5E5',
    }
});

export default EditProfile;
