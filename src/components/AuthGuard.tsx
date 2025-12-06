import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUser } from '../store/slices/authSlice';
import { RootState } from '../store/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user && token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUserData = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          dispatch(setToken(storedToken));
          dispatch(setUser(parsedUser));
          setIsCheckingSession(false);
        } else {
          setIsCheckingSession(false);
          router.replace('/(auth)');
        }
      } catch {
        setIsCheckingSession(false);
        router.replace('/(auth)');
      }
    };

    checkAuth();
  }, [user, token, router, dispatch]);

  if (isCheckingSession) {
    return null;
  }

  const hasAuth = user && token;
  if (!hasAuth) {
    return null;
  }

  return <>{children}</>;
};
