import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { authClient } from "../lib/auth-client";
import { setToken, setUser } from "../store/slices/authSlice";
import { showToast } from "../utils";

interface UseGoogleAuthReturn {
  signInWithGoogle: () => Promise<void>;
  isLoading: boolean;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)",
      });
      if (result.error) {
        throw new Error(result.error.message || "Sign in failed");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed";
      if (!errorMessage.includes("User cancelled")) {
        showToast({
          message: errorMessage,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
      // Wait a bit for Better Auth to complete the OAuth flow and store session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const user = session.data.user;
          // Get Better Auth cookie (not the session token)
          const cookies = authClient.getCookie();
          
          const userData = {
            id: user.id,
            name: user.name || '',
            email: user.email || '',
            image: user.image || undefined,
            emailVerified: user.emailVerified || false,
            phoneNumber: "",
            phoneNumberVerified: false,
            role: "user",
            points: 0,
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
          };

          await AsyncStorage.setItem("user_data", JSON.stringify(userData));
          
          // Store the cookie string for fallback (though API will use getCookie())
          if (cookies) {
            await AsyncStorage.setItem("auth_token", cookies);
            dispatch(setToken(cookies));
          }
          
          dispatch(setUser(userData));

          showToast({
            message: "Signed in successfully!",
            type: "success",
          });

          router.replace("/(tabs)");
        }
      } catch {
        // Session might not be ready yet, but OAuth completed
        // User will be redirected and AuthGuard will check session
      }
    }
  }, [dispatch]);

  return {
    signInWithGoogle,
    isLoading,
  };
};
