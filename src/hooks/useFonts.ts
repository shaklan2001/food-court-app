import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
    const [fontsLoaded] = useExpoFonts({
        'Poppins-Bold': require('../../assets/font/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../../assets/font/Poppins-Medium.ttf'),
        'Poppins-Regular': require('../../assets/font/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('../../assets/font/Poppins-SemiBold.ttf'),
    });

    return fontsLoaded;
};
