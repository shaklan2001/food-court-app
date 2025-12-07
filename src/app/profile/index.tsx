import { authClient } from '@/src/lib/auth-client';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutModal from "../../components/LogoutModal";
import { Text, View } from "../../components/ui";
import { setLoggingOut } from "../../network";
import { logout } from "../../store/slices/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const ProfileMenuItem = memo(({
  icon,
  title,
  onPress,
  isLogout = false,
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
  const { user, token } = useAppSelector((state: RootState) => state.auth);

  const handleEditProfilePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile/edit-profile');
  }, []);

  const handleMenuPress = useCallback((menuItem: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
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
      case 'Privacy Policy':
        router.push('/profile/privacy-policy');
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

  const handleLogoutConfirm = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowLogoutModal(false);
  
      // 1️⃣ Call authClient.signOut() to clear BOTH server and client state
      try {
         await authClient.signOut();
      } catch (apiError) {
         console.warn('Sign-out failed:', apiError);
      }

      // 2️⃣ Block requests immediately to prevent background fetch failures
      setLoggingOut(true);
  
      // 3️⃣ Clear storage safely
      try {
        await AsyncStorage.multiRemove(['auth_token', 'user_data', 'refresh_token']);
      } catch (storageError) {
        console.warn('Storage cleanup failed:', storageError);
      }
  
      // 4️⃣ Clear Redux auth state
      dispatch(logout());
  
      // 5️⃣ Small delay to ensure UI unmounts
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // 6️⃣ Navigate to login
      router.replace('/(auth)/login');
      
      // Reset logging out flag after a safe delay, though we are now on login screen
      setTimeout(() => setLoggingOut(false), 2000);
  
    } catch (error) {
      console.error('Error during logout:', error);
      try {
        router.replace('/(auth)/login');
      } catch (navError) {
        console.error('Emergency navigation failed:', navError);
        router.push('/(auth)/login');
      } finally {
        setLoggingOut(false);
      }
    }
  }, [dispatch, token]);
  

  const handleLogoutCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLogoutModal(false);
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Profile" />

          <View paddingHorizontal={pageHorizantalPadding} marginBottom="l">
            <View flexDirection="row" alignItems="center" marginBottom="l">
              <Image
                source={user?.image ? { uri: user.image } : require('../../../assets/images/profile.jpg')}
                style={styles.profileImage}
              />
              <View flex={1} marginLeft="m">
                <Text
                  fontSize={18}
                  fontWeight="600"
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                >
                  {user?.name}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight="400"
                  color="primary"
                  fontFamily="Poppins-Regular"
                  marginBottom="s"
                >
                  {user?.isStudent ? 'Student' : 'Non-Student'}
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
              title="Help & Support"
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
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() => handleMenuPress('Privacy Policy')}
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
    </SafeAreaView>
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
