import React, { memo } from 'react';
import { View } from 'react-native';
import Text from './Text';
import CustomTextInput from './TextInput';

interface FormFieldProps {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    height?: number;
    paddingRight?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontSize?: number;
    fontFamily?: string;
    marginBottom?: string | 'none';
}

const FormField = memo(({
    label,
    required = false,
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
    fontFamily = 'Inter-Regular',
    marginBottom = 'l',
    ...props
}: FormFieldProps) => {
    return (
        <View marginBottom={marginBottom === 'none' ? undefined : marginBottom}>
            {label && (
                <Text
                    fontSize={14}
                    fontWeight="400"
                    color="textSecondary"
                    marginBottom="s"
                    fontFamily="Inter-Regular"
                >
                    {label} {required && <Text color="primary">*</Text>}
                </Text>
            )}
            <CustomTextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                height={height}
                paddingRight={paddingRight}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
                borderRadius={borderRadius}
                fontSize={fontSize}
                fontFamily={fontFamily}
                {...props}
            />
        </View>
    );
});

FormField.displayName = 'FormField';

export default FormField;
