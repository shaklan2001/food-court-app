import { Stack } from "expo-router";

export default function OrderLaterLayout() {
    return (
        <>
            <Stack
                initialRouteName="index"
                screenOptions={() => ({
                    headerShown: false,
                })}
            >
                <Stack.Screen 
                    name="index" 
                    options={{
                        title: "Select Time",
                    }}
                />
                <Stack.Screen 
                    name="select-menu" 
                    options={{
                        title: "Select Menu",
                    }}
                />
                <Stack.Screen 
                    name="confirmation" 
                    options={{
                        title: "Confirmation",
                    }}
                />
            </Stack>
        </>
    );
}