import { createTheme } from '@shopify/restyle';

const palette = {
    purpleLight: '#8C6FF7',
    purplePrimary: '#5A31F4',
    purpleDark: '#3F22AB',
    chearyRed: '#A20538',

    greenLight: '#56DCBA',
    greenPrimary: '#0ECD9D',
    greenDark: '#0A906E',

    black: '#0B0B0B',
    white: '#FFFFFF',
    whiteLight: '#F8F8F8',

    redPrimary: '#FF0000',
    redLight: '#FF6666',
    redDark: '#CC0000',
    redLighter: '#FAF0EF',

    loginButton: '#A20538',

    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#e5e5e5',
    gray300: '#d1d5db',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
};

const theme = createTheme({
    colors: {
        primary: palette.chearyRed,
        mainBackground: palette.white,
        mainBackgroundLight: palette.whiteLight,
        cardPrimaryBackground: palette.redPrimary,
        cardSecondaryBackground: palette.gray100,
        textPrimary: palette.black,
        textSecondary: palette.gray600,
        textOnPrimary: palette.white,
        buttonPrimary: palette.loginButton,
        buttonSecondary: palette.gray200,
        border: palette.redLighter,
        secondary: palette.gray500,
        success: palette.greenPrimary,
        danger: palette.redDark,
        warning: '#FFA500',
        info: palette.purplePrimary,
        transparent: 'transparent',
        loginBackground: palette.loginButton,
        inputBackground: palette.white,
        inputBorder: palette.redLighter,
        inputPlaceholder: palette.gray500,
        backgroundColor: palette.white,
        crousalDot: palette.gray300,

        red: 'red',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
        xxl: 80,
    },
    borderRadii: {
        xs: 2,
        s: 4,
        m: 8,
        l: 16,
        xl: 24,
        xxl: 32,
    },
    textVariants: {
        defaults: {
            fontSize: 16,
            lineHeight: 24,
            color: 'textPrimary',
        },
        header: {
            fontWeight: 'bold',
            fontSize: 34,
            lineHeight: 42.5,
            color: 'textPrimary',
        },
        subheader: {
            fontWeight: '600',
            fontSize: 28,
            lineHeight: 36,
            color: 'textPrimary',
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: 'textPrimary',
        },
        caption: {
            fontSize: 12,
            lineHeight: 16,
            color: 'textSecondary',
        },
        button: {
            fontSize: 16,
            fontWeight: '600',
            color: 'textOnPrimary',
        },
    },
    cardVariants: {
        primary: {
            backgroundColor: 'cardPrimaryBackground',
            padding: 'm',
            borderRadius: 'm',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        secondary: {
            backgroundColor: 'cardSecondaryBackground',
            padding: 'm',
            borderRadius: 'm',
            borderWidth: 1,
            borderColor: 'border',
        },
        elevated: {
            backgroundColor: 'mainBackground',
            padding: 'l',
            borderRadius: 'l',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
    },
    buttonVariants: {
        primary: {
            backgroundColor: 'buttonPrimary',
            padding: 'm',
            borderRadius: 'm',
            justifyContent: 'center',
            alignItems: 'center',
        },
        secondary: {
            backgroundColor: 'buttonSecondary',
            padding: 'm',
            borderRadius: 'm',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'border',
        },
        outline: {
            backgroundColor: 'transparent',
            padding: 'm',
            borderRadius: 'm',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'primary',
        },
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
    },
});

export type Theme = typeof theme;
export default theme;
