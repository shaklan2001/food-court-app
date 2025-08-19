import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { memo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/theme';
import CustomTextInput from './TextInput';
import View from './View';

interface PasswordInputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    height?: number;
    backgroundColor?: keyof Theme['colors'];
    borderColor?: keyof Theme['colors'];
    borderRadius?: keyof Theme['borderRadii'];
    fontSize?: number;
    fontFamily?: string;
}

const PasswordInput = memo(({
    placeholder = '********',
    value,
    onChangeText,
    height = 48,
    backgroundColor = 'mainBackground',
    borderColor = 'inputBorder',
    borderRadius = 'm',
    fontSize = 16,
    fontFamily = 'Inter-Regular',
}: PasswordInputProps) => {
    const theme = useTheme<Theme>();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View position="relative">
            <CustomTextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                height={height}
                paddingRight={50}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
                borderRadius={borderRadius}
                fontSize={fontSize}
                fontFamily={fontFamily}
            />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 16,
                    top: 12,
                    height: 24,
                    width: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => setShowPassword(!showPassword)}
            >
                <AntDesign
                    name={showPassword ? "eye" : "eyeo"}
                    size={20}
                    color={theme.colors.textSecondary}
                />
            </TouchableOpacity>
        </View>
    );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
