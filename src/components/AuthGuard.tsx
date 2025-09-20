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
    // If user is not logged in, redirect to auth
    if (!user || !token) {
      router.replace('/(auth)');
    }
  }, [user, token, router]);

  // If user is logged in, show the app
  if (user && token) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
};
