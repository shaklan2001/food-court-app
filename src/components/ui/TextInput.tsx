import { useTheme } from '@shopify/restyle';
import React, { memo } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { Theme } from '../../theme/theme';

interface CustomTextInputProps extends TextInputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    height?: number;
    paddingRight?: number;
    backgroundColor?: keyof Theme['colors'];
    borderColor?: keyof Theme['colors'];
    borderRadius?: keyof Theme['borderRadii'];
    fontSize?: number;
    fontFamily?: string;
}

const CustomTextInput = memo(({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    height = 48,
    paddingRight = 16,
    backgroundColor = 'mainBackground',
    borderColor = 'inputBorder',
    borderRadius = 'm',
    fontSize = 16,
    fontFamily = 'Poppins-Regular',
    ...props
}: CustomTextInputProps) => {
    const theme = useTheme<Theme>();

    return (
        <RNTextInput
            style={{
                backgroundColor: theme.colors[backgroundColor],
                borderWidth: 1,
                borderColor: theme.colors[borderColor],
                borderRadius: theme.borderRadii[borderRadius],
                paddingHorizontal: 16,
                fontSize,
                fontFamily,
                height,
                paddingRight,
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            {...props}
        />
    );
});

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
