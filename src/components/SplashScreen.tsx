import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../store/slices/authSlice';
import { RootState } from '../store/store';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  console.log('user', user);
  console.log('token', token);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dotAnimations] = useState([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]);

  useEffect(() => {
    checkAuthStatus();
    startDotAnimation();
  }, []);

  const startDotAnimation = () => {
    const animateDot = (index: number) => {
      Animated.sequence([
        Animated.timing(dotAnimations[index], {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimations[index], {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isCheckingAuth) {
          animateDot(index);
        }
      });
    };

    dotAnimations.forEach((_, index) => {
      setTimeout(() => animateDot(index), index * 200);
    });
  };

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user_data');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        dispatch(setToken(storedToken));
        dispatch(setUser(userData));
        
        setTimeout(() => {
          router.replace('/(tabs)');
          onFinish();
        }, 2000);
      } else {
        setTimeout(() => {
          router.replace('/(auth)');
          onFinish();
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setTimeout(() => {
        router.replace('/(auth)');
        onFinish();
      }, 2000);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/primary_bg.webp')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/font-logo.png')} 
            style={styles.chefHat}
            resizeMode="contain"
          />
        </View>
        
        {isCheckingAuth && (
          <View style={styles.loadingContainer}>
            {dotAnimations.map((animation, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    opacity: animation,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A20538',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(162, 5, 56, 0.7)', // Semi-transparent overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  chefHat: {
    width: 300,
    height: 180,
    tintColor: 'white',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  tagline: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.9,
    fontFamily: 'Poppins-Medium',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
    opacity: 0.3,
  },
});

export default SplashScreen;
