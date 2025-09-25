import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import LogoutModal from "../../components/LogoutModal";
import { Text, View } from "../../components/ui";
import { logout } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const ProfileMenuItem = memo(({
  icon,
  title,
  onPress,
  isLogout = false
}: {
  icon: string;
  title: string;
  onPress: () => void;
  isLogout?: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View flexDirection="row" alignItems="center" justifyContent="space-between" paddingVertical="m">
        <View flexDirection="row" alignItems="center">
          <View
            width={24}
            height={24}
            justifyContent="center"
            alignItems="center"
            marginRight="m"
          >
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={isLogout ? "#FF0000" : "#000000"} 
            />
          </View>
          <Text
            fontSize={16}
            fontWeight="400"
            color={isLogout ? "red" : "textPrimary"}
            fontFamily="Poppins-Regular"
          >
            {title}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isLogout ? "#FF0000" : "#000000"} 
        />
      </View>
    </Pressable>
  );
});

ProfileMenuItem.displayName = 'ProfileMenuItem';

const Profile = () => {
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleEditProfilePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile/edit-profile');
  }, []);

  const handleMenuPress = useCallback((menuItem: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Pressed: ${menuItem}`);
    
    switch (menuItem) {
      case 'Favourites':
        router.push('/profile/favourites');
        break;
      case 'Your Orders':
        router.push('/profile/orders');
        break;
      case 'About Section':
        router.push('/profile/about');
        break;
      case 'Change Password':
        router.push('/profile/change-password');
        break;
      case 'Support':
        router.push('/profile/support');
        break;
      case 'Feedback':
        router.push('/profile/feedback');
        break;
      default:
        console.log(`Pressed: ${menuItem}`);
    }
  }, []);

  const handleLogoutPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLogoutModal(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(logout());
    setShowLogoutModal(false);
    router.replace('/(auth)/');
  }, [dispatch]);

  const handleLogoutCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLogoutModal(false);
  }, []);

  return (
    <View flex={1} backgroundColor="mainBackgroundLight">
       <ScreenHeader title="Profile" />

        <View paddingHorizontal={pageHorizantalPadding} marginBottom="l">
          <View flexDirection="row" alignItems="center" marginBottom="l">
            <Image
              source={require('@/assets/images/profile.jpg')}
              style={styles.profileImage}
            />
            <View flex={1} marginLeft="m">
              <Text
                fontSize={18}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
              >
                Prince Narula
              </Text>
              <Text
                fontSize={12}
                fontWeight="400"
                color="primary"
                fontFamily="Poppins-Regular"
                marginBottom="s"
              >
                Student
              </Text>
              <Pressable onPress={handleEditProfilePress} style={styles.editButton}>
                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="primary"
                  paddingVertical="s"
                  paddingHorizontal="m"
                  borderRadius="m"
                >
                  <Feather name="edit-3" size={20} color="white" />
                  <Text
                    fontSize={14}
                    fontWeight="500"
                    color="textOnPrimary"
                    fontFamily="Poppins-Medium"
                    marginLeft="xs"
                  >
                    Edit Profile
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View backgroundColor="transparent" borderRadius="l" marginHorizontal={pageHorizantalPadding}>
          <ProfileMenuItem
            icon="heart-outline"
            title="Favourites"
            onPress={() => handleMenuPress('Favourites')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="bag-outline"
            title="Your Orders"
            onPress={() => handleMenuPress('Your Orders')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="information-circle-outline"
            title="About Section"
            onPress={() => handleMenuPress('About Section')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => handleMenuPress('Change Password')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="headset-outline"
            title="Support"
            onPress={() => handleMenuPress('Support')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="chatbubble-outline"
            title="Feedback"
            onPress={() => handleMenuPress('Feedback')}
          />
          <View borderTopWidth={1} style={{ borderTopColor: '#D3D3D3' }} />
          
          <ProfileMenuItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogoutPress}
            isLogout={true}
          />
        </View>

        <LogoutModal
          visible={showLogoutModal}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  menuItem: {
    paddingHorizontal: 16,
  },
});

export default Profile;
