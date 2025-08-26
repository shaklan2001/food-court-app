// import { flexStyle } from "@/util/CommonCompute";
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <>
            <Stack
                initialRouteName="index"
                screenOptions={() => ({
                    headerShown: false,
                    // headerTitleStyle: flexStyle.headerTitleStyle,
                })}
            >
                <Stack.Screen name="index" />
                {/* <Stack.Screen name="consultation/index" />
                <Stack.Screen name="diet/index" />
                <Stack.Screen name="procedures/index" />
                <Stack.Screen name="medicines/index" />
                <Stack.Screen name="orderMedicine/index" /> */}
            </Stack>
        </>
    );
}