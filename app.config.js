export default {
    expo: {
        name: "Food Court App",
        slug: "food-court-app",
        version: "1.0.0",
        sdkVersion: "54.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        fonts: [
            "./assets/font/Poppins-Black.ttf",
            "./assets/font/Poppins-Bold.ttf",
            "./assets/font/Poppins-ExtraBold.ttf",
            "./assets/font/Poppins-ExtraLight.ttf",
            "./assets/font/Poppins-Light.ttf",
            "./assets/font/Poppins-Medium.ttf",
            "./assets/font/Poppins-Regular.ttf",
            "./assets/font/Poppins-SemiBold.ttf",
            "./assets/font/Poppins-SemiBoldItalic.ttf",
            "./assets/font/Poppins-Thin.ttf",
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.yuvan97.foodcourtapp"
        },
        android: {
            package: "com.yuvan97.foodcourtapp",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            }
        },
        web: {},
        plugins: [
            "expo-router"
        ],
        extra: {
            router: {},
            eas: {
                projectId: "343f521e-0f93-4422-867d-d4adcef2768d"
            },
            googleSignIn: {
                clientId: "555524338727-8fcingoq1ko1fkpfu29io45ghbkd581g.apps.googleusercontent.com"
            }
        },
        userInterfaceStyle: "light",
        scheme: "foodcourtapp"
    }
};
