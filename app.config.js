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
            versionCode: 4,
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
                clientId: "555524338727-8fcingoq1ko1fkpfu29io45ghbkd581g.apps.googleusercontent.com"
            }
        },
        userInterfaceStyle: "light",
        scheme: "foodcourtapp"
    }
};
