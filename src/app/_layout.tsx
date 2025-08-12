import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import theme from '../theme/theme';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}