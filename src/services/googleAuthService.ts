import { useCallback, useState } from 'react';
import { authClient } from '../lib/auth-client';
import { showToast } from '../utils';

interface UseGoogleAuthReturn {
    signInWithGoogle: () => Promise<void>;
    isLoading: boolean;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
    const [isLoading, setIsLoading] = useState(false);

    const signInWithGoogle = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/(tabs)',
            });
            await authClient.getSession();
            console.log("oath login result !!!!!!!!!", result);
            console.log("oath login session !!!!!!!!!", await authClient.getCookie());
            console.log("oath login session !!!!!!!!!", await authClient.getSession());

            if (result.error) {
                throw new Error(result.error.message || 'Sign in failed');
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
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    return {
        signInWithGoogle,
        isLoading,
    };
};
