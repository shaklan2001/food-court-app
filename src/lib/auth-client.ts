import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

// Better Auth base URL - should point to your Better Auth backend
// If your backend uses the default path, it should be: https://backend.smartcsk.in/api/auth
// If your backend is NOT a Better Auth server, this won't work and you need to set up Better Auth on the backend
const BASE_URL = "https://backend.smartcsk.in";

export const authClient = createAuthClient({
    baseURL: BASE_URL,
    plugins: [
        expoClient({
            scheme: "foodcourtapp",
            storagePrefix: "foodcourtapp",
            storage: SecureStore,
        }),
    ],
});
