import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="sign-up"
                options={{
                    headerShown: false,
                    title: 'Sign Up',
                }}
            />
            <Stack.Screen
                name="otp-verify"
                options={{
                    headerShown: false,
                    title: 'OTP Verify',
                }}
            />
        </Stack>
    );
}
