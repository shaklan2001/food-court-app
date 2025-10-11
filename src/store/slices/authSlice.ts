import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    phoneNumberVerified?: boolean | null;
    emailVerified?: boolean;
    image?: string | null;
    dob?: string;
    role?: string;
    banned?: boolean;
    banReason?: string | null;
    banExpires?: string | null;
    points?: number;
    isStudent?: boolean;
    collegeName?: string;
    course?: string;
    branch?: string;
    currentSemester?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isTokenValidating: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    isTokenValidating: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            // Persist user data
            AsyncStorage.setItem('user_data', JSON.stringify(action.payload));
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            // Persist token
            AsyncStorage.setItem('auth_token', action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.error = null;
            state.isLoading = false;
            state.isTokenValidating = false;
            AsyncStorage.multiRemove(['auth_token', 'user_data', 'refresh_token']).catch(err => {
                console.error('Error clearing AsyncStorage:', err);
            });
        },
    },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;