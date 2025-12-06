import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authClient } from '../lib/auth-client';
import { setToken, setUser } from '../store/slices/authSlice';
import { showToast } from '../utils';

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
                provider: 'google',
                callbackURL: '/(tabs)',
            });

            const session = await authClient.getSession();

            if (session?.data?.user) {
                const user = session.data.user;
                const token = session.data.session.token;
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    emailVerified: user.emailVerified,
                    phoneNumber: '',
                    role: 'user',
                    createdAt: user.createdAt.toISOString(),
                    updatedAt: user.updatedAt.toISOString(),
                };

                await AsyncStorage.setItem('user_data', JSON.stringify(userData));

                dispatch(setToken(token));
                dispatch(setUser(userData));

                showToast({
                    message: 'Signed in successfully!',
                    type: 'success',
                });

                router.replace('/(tabs)');
            } else {
                if (!result.error) {
                }
                if (result.error) {
                    throw new Error(result.error.message || 'Sign in failed');
                }
            }

        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            const errorMessage = error.message || 'Google sign-in failed';
            if (!errorMessage.includes("User cancelled")) {
                showToast({
                    message: errorMessage,
                    type: 'error',
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    return {
        signInWithGoogle,
        isLoading,
    };
};
