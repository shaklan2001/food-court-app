import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    dob?: string;
    isStudent?: boolean;
    image?: string;
    collegeName?: string;
    course?: string;
    branch?: string;
    currentSemester?: string;
    emailVerified?: boolean;
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
            state.error = null;
            // Clear persisted data
            AsyncStorage.multiRemove(['auth_token', 'user_data']);
        },
    },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;