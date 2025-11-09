import { useAppSelector } from "@/src/store/store";
import { Redirect, Stack } from "expo-router";

export default function AdminLayout() {
    const role = useAppSelector((state) => state.auth.user?.role?.toLowerCase());

    if (role && role !== 'admin') {
        return <Redirect href="/(tabs)/(home)" />;
    }

    return (
        <>
            <Stack
                initialRouteName="index"
                screenOptions={() => ({
                    headerShown: false,
                })}
            >
                <Stack.Screen name="index" />
            </Stack>
        </>
    );
}