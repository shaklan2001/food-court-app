export default {
    expo: {
        name: "Food Court App",
        slug: "food-court-app",
        version: "1.0.0",
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
