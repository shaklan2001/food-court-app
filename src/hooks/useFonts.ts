import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
    const [fontsLoaded] = useExpoFonts({
        'Poppins-Black': require('../../assets/font/Poppins-Black.ttf'),
        'Poppins-Bold': require('../../assets/font/Poppins-Bold.ttf'),
        'Poppins-ExtraBold': require('../../assets/font/Poppins-ExtraBold.ttf'),
        'Poppins-ExtraLight': require('../../assets/font/Poppins-ExtraLight.ttf'),
        'Poppins-Light': require('../../assets/font/Poppins-Light.ttf'),
        'Poppins-Medium': require('../../assets/font/Poppins-Medium.ttf'),
        'Poppins-Regular': require('../../assets/font/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('../../assets/font/Poppins-SemiBold.ttf'),
        'Poppins-SemiBoldItalic': require('../../assets/font/Poppins-SemiBoldItalic.ttf'),
        'Poppins-Thin': require('../../assets/font/Poppins-Thin.ttf'),
    });

    return fontsLoaded;
};
