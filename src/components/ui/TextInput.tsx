import { useTheme } from '@shopify/restyle';
import React, { memo, useState } from 'react';
import { TextInput as RNTextInput, View as RNView, TextInputProps } from 'react-native';
import { Theme } from '../../theme/theme';
import Text from './Text';

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
    placeholderFontSize?: number;
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
    placeholderFontSize = 14,
    ...props
}: CustomTextInputProps) => {
    const theme = useTheme<Theme>();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <RNView
            style={{
                backgroundColor: theme.colors[backgroundColor],
                borderWidth: 1,
                borderColor: theme.colors[borderColor],
                borderRadius: theme.borderRadii[borderRadius],
                height,
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            {!value && !isFocused && placeholder && (
                <RNView
                    style={{
                        position: 'absolute',
                        left: 16,
                        right: paddingRight,
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                >
                    <Text
                        fontSize={placeholderFontSize}
                        fontFamily={fontFamily}
                        color="inputPlaceholder"
                        style={{ opacity: 0.7 }}
                    >
                        {placeholder}
                    </Text>
                </RNView>
            )}
            <RNTextInput
                style={{
                    backgroundColor: 'transparent',
                    paddingHorizontal: 16,
                    fontSize,
                    fontFamily,
                    height,
                    paddingRight,
                    textAlignVertical: 'center',
                    color: theme.colors.textPrimary,
                }}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                scrollEnabled={false}
                multiline={false}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </RNView>
    );
});

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
