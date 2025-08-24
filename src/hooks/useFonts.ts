import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
    const [fontsLoaded] = useExpoFonts({
        'SF-Pro-Display-Black': require('../../assets/fonts/SF-Pro-Display-Black.otf'),
        'SF-Pro-Display-Regular': require('../../assets/fonts/SF-Pro-Display-Regular.otf'),
        'SF-Pro-Display-Semibold': require('../../assets/fonts/SF-Pro-Display-Semibold.otf'),
        'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    });

    return fontsLoaded;
};
