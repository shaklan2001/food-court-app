# Food Court App

A React Native mobile application for food court management.

## Features

- **Login Screen**: Modern login interface with mobile number and password authentication
- **Custom Button Component**: Reusable button component with theme support
- **Font Integration**: SF Pro Display and Inter font families
- **Theme System**: Comprehensive theming with custom colors including #A20538
- **Background Image**: Custom background image for the login screen

## Screens

### Login Screen
- Mobile number input with country code selector
- Password input with visibility toggle
- Login button with custom styling
- Social login options (Google, Apple)
- Forgot password link
- Sign up navigation

## Components

### Button Component
Located at `src/components/ui/Button.tsx`
- Supports multiple variants (primary, secondary, outline)
- Uses theme colors for consistent styling
- Customizable text variants

## Theme

The app uses a comprehensive theme system with:
- Custom color palette including #A20538 for the login button
- Typography variants
- Spacing and border radius scales
- Button and card variants

## Fonts

- **SF Pro Display**: Used for branding and headings
- **Inter**: Used for body text and form elements

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS or Android:
   ```bash
   npm run ios
   # or
   npm run android
   ```

## Project Structure

```
src/
├── app/                 # App screens and navigation
│   ├── login.tsx       # Login screen
│   └── _layout.tsx     # Root layout with font loading
├── components/          # Reusable UI components
│   └── ui/             # UI component library
├── theme/               # Theme configuration
├── hooks/               # Custom React hooks
└── constants/           # App constants
```

## Dependencies

- React Native
- Expo Router
- Redux Toolkit
- Shopify Restyle (theming)
- Expo Font (font loading)
