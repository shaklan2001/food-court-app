import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { useFonts } from '../hooks/useFonts';
import { store } from '../store/store';
import theme from '../theme/theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A20538' }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>SMART CSK</Text>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', fontSize: 16, marginTop: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RootLayoutContent />
        <Toast />
      </ThemeProvider>
    </Provider>
  );
}