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

        // Prevent logging during logout to avoid DevLauncher crashes
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
