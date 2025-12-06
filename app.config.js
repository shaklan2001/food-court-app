export default {
    expo: {
        name: "Food Court App",
        slug: "food-court-app",
        version: "1.0.1",
        sdkVersion: "54.0.0",
        orientation: "portrait",
        owner: "team-csk",
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
            "./assets/font/Poppins-Bold.ttf",
            "./assets/font/Poppins-Medium.ttf",
            "./assets/font/Poppins-Regular.ttf",
            "./assets/font/Poppins-SemiBold.ttf",
        ],
        ios: {
            "infoPlist": {
                "ITSAppUsesNonExemptEncryption": false,
                NSAppTransportSecurity: {
                    NSAllowsArbitraryLoads: true,
                    NSExceptionDomains: {
                        "backend.smartcsk.in": {
                            NSExceptionAllowsInsecureHTTPLoads: true
                        }
                    }
                }
            },
            supportsTablet: true,
            bundleIdentifier: "com.yuvan97.foodcourtapp",
            allowFontScaling: false,

        },
        android: {
            package: "com.yuvan97.foodcourtapp",
            versionCode: 8,
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            allowFontScaling: false,
        },
        web: {},
        plugins: [
            "expo-router",
            "expo-dev-client"
        ],
        extra: {
            router: {},
            eas: {
                projectId: "343f521e-0f93-4422-867d-d4adcef2768d"
            },
            googleSignIn: {
                expoClientId: "455680765065-ukgd4t7s3um3ue7jm1msmfjh0varpj6l.apps.googleusercontent.com",
                androidClientId: "455680765065-cj7t51ao8dnpql05i6ti1nk24cbkofii.apps.googleusercontent.com",
                iosClientId: "455680765065-33tc4f7uqjukufs8m5oipmjqj6i31ibk.apps.googleusercontent.com",
            }
        },
        userInterfaceStyle: "light",
        scheme: "foodcourtapp"
    }
};
