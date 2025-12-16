import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: "Profile",
        }} 
      />
      <Stack.Screen 
        name="favourites" 
        options={{ 
          headerShown: false,
          title: "Favourites",
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          headerShown: false,
          title: "Your Orders",
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          headerShown: false,
          title: "About Section",
        }} 
      />
      <Stack.Screen 
        name="change-password" 
        options={{ 
          headerShown: false,
          title: "Change Password",
        }} 
      />
      <Stack.Screen 
        name="support" 
        options={{ 
          headerShown: false,
          title: "Support",
        }} 
      />
      <Stack.Screen 
        name="feedback" 
        options={{ 
          headerShown: false,
          title: "Feedback",
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          headerShown: false,
          title: "Privacy Policy",
        }} 
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          headerShown: false,
          title: "Edit Profile",
        }} 
      />
      <Stack.Screen 
        name="register-student" 
        options={{ 
          headerShown: false,
          title: "Register as Student",
        }} 
      />
    </Stack>
  );
}
