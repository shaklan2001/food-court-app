import { Stack } from "expo-router"
import { Text, View } from "../components/ui"

const Notifications = () => {
  return (
    <>
        <Stack.Screen options={{ headerShown: false }} />
        <View flex={1} bg="mainBackgroundLight" justifyContent="center" alignItems="center">
        <Text variant="header" color="primary">
            Notifications
        </Text>
        </View>
    </>
  )
}

export default Notifications