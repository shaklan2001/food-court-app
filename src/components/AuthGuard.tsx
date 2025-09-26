import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || !token) {
      router.replace('/(auth)');
    }
  }, [user, token, router]);

  if (user && token) {
    return <>{children}</>;
  }

  return null;
};
