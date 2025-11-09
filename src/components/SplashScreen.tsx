import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { betterwayApiCall } from "../network/useApiPort";
import { logout, setToken, setUser } from "../store/slices/authSlice";
import { View } from "./ui";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedAuth = useRef(false);
  const [dotAnimations] = useState([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]);

  const startDotAnimation = useCallback(() => {
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
  }, [dotAnimations, isCheckingAuth]);

  const checkAuthStatus = useCallback(async () => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");

      if (storedToken) {
        try {
          const profileApiCall = betterwayApiCall({
            method: "GET",
            url: "GET_PROFILE",
            auth: storedToken,
          });

          const response = await profileApiCall;
          
          if (response?.data) {
            const userData = {
              id: response?.data?.id,
              name: response?.data?.name,
              email: response?.data?.email,
              phoneNumber: response?.data?.phoneNumber || response?.data?.phone,
              phoneNumberVerified: response?.data?.phoneNumberVerified,
              emailVerified: response?.data?.emailVerified,
              image: response?.data?.image,
              dob: response?.data?.dob,
              role: response?.data?.role,
              banned: response?.data?.banned,
              banReason: response?.data?.banReason,
              banExpires: response?.data?.banExpires,
              points: response.data.points,
              isStudent: response?.data?.isStudent,
              collegeName: response?.data?.collegeName,
              course: response?.data?.course,
              branch: response?.data?.branch,
              currentSemester: response?.data?.currentSemester,
              createdAt: response?.data?.createdAt,
              updatedAt: response?.data?.updatedAt,
            };
            
            dispatch(setToken(storedToken));
            dispatch(setUser(userData));

            setTimeout(() => {
              setIsCheckingAuth(false);
              router.replace("/(tabs)");
              setTimeout(() => {
                onFinish();
              }, 100);
            }, 1500);
          } else {
            // Clear invalid token
            await AsyncStorage.multiRemove(['auth_token', 'user_data', 'refresh_token']);
            dispatch(logout());
            setTimeout(() => {
              setIsCheckingAuth(false);
              router.replace("/(auth)");
              setTimeout(() => {
                onFinish();
              }, 100);
            }, 1500);
          }
        } catch (apiError: any) {
          console.error('Token validation failed:', apiError?.message);
          // Clear invalid token
          await AsyncStorage.multiRemove(['auth_token', 'user_data', 'refresh_token']);
          dispatch(logout());
          setTimeout(() => {
            setIsCheckingAuth(false);
            router.replace("/(auth)");
            setTimeout(() => {
              onFinish();
            }, 100);
          }, 1500);
          // // Only show toast if it's not a network error or auth error
          // if (!apiError?.message?.includes('Authentication failed')) {
          //   showToast({
          //     message: 'Session expired. Please login again.',
          //     type: 'error',
          //   });
          // }
        }
      } else {
        setTimeout(() => {
          setIsCheckingAuth(false);
          router.replace("/(auth)");
          setTimeout(() => {
            onFinish();
          }, 100);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Auth check error:', error);
      // Clear any stored tokens
      await AsyncStorage.multiRemove(['auth_token', 'user_data', 'refresh_token']).catch((err) => {
        console.error('Error clearing storage:', err);
      });
      dispatch(logout());
      setTimeout(() => {
        setIsCheckingAuth(false);
        router.replace("/(auth)");
        setTimeout(() => {
          onFinish();
        }, 100);
      }, 1500);
    }
  }, [dispatch, router, onFinish]);

  useEffect(() => {
    checkAuthStatus();
    startDotAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/primary_bg.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/font-logo.png")}
                style={styles.chefHat}
                resizeMode="contain"
              />
            </View>

            {/* {isCheckingAuth && (
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
            )} */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A20538",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  chefHat: {
    width: 380,
    height: 240,
    tintColor: "white",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  tagline: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    letterSpacing: 1,
    opacity: 0.9,
    fontFamily: "Poppins-Medium",
  },
  loadingContainer: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 4,
    opacity: 0.3,
  },
});

export default SplashScreen;
