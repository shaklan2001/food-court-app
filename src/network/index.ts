import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, isCancel } from "axios";

const isProd = true;
const BASE_URL = isProd
    ? "https://backend.smartcsk.in"
    : "http://localhost:8000";


export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isLoggingOut = false;

export const setLoggingOut = (value: boolean) => {
    isLoggingOut = value;
};

apiClient.interceptors.request.use(
    async (config) => {
        if (isLoggingOut) {
            console.log('🚫 Blocking API request during logout:', config.url);
            return Promise.reject(new axios.Cancel('Request cancelled due to logout'));
        }

        // Use Better Auth cookie for authentication (like oauth-test project)
        if (!config.headers['Cookie']) {
            try {
                // Import authClient dynamically to avoid circular dependencies
                const { authClient } = await import("../lib/auth-client");
                const cookies = authClient.getCookie();
                
                if (cookies) {
                    // Better Auth cookie format - pass it in Cookie header
                    config.headers['Cookie'] = cookies;
                    // Also set credentials to omit to prevent browser from interfering
                    config.withCredentials = false;
                } else {
                    // Fallback to AsyncStorage token if Better Auth cookie not available
                    const token = await AsyncStorage.getItem('auth_token');
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.warn('Failed to attach auth cookie/token:', error);
                // Fallback to AsyncStorage if Better Auth fails
                try {
                    const token = await AsyncStorage.getItem('auth_token');
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                } catch (fallbackError) {
                    console.warn('Failed to attach fallback auth token:', fallbackError);
                }
            }
        }

        console.log('🌐 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            data: config.data,
            headers: config.headers,
        });
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    (error: AxiosError) => {
        if (isCancel(error)) {
            console.log('⚠️ API Request cancelled:', error.message);
            return Promise.reject(error);
        }

        if (error.response?.status === 401 || error.response?.status === 500) {
            const errorData = error.response?.data;
            if (typeof errorData === 'string' && errorData.includes('Unauthorized')) {
                console.log('🔒 Auth error detected - token may be invalid');
                return Promise.reject({
                    ...error,
                    response: {
                        ...error.response,
                        data: { message: 'Authentication failed. Please login again.' },
                    },
                });
            }
        }

        if (!isLoggingOut) {
            console.log('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                data: error.response?.data,
                message: error.message,
            });
        }

        return Promise.reject(error);
    },
);
