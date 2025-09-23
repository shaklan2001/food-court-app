import { memo } from 'react';
import { Theme } from '../../theme/theme';
import Text from './Text';
import CustomTextInput from './TextInput';
import View from './View';

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
    backgroundColor?: keyof Theme['colors'];
    borderColor?: keyof Theme['colors'];
    borderRadius?: keyof Theme['borderRadii'];
    fontSize?: number;
    fontFamily?: string;
    marginBottom?: keyof Theme['spacing'] | 'none';
    editable?: boolean;
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
    backgroundColor = 'mainBackground' as keyof Theme['colors'],
    borderColor = 'inputBorder' as keyof Theme['colors'],
    borderRadius = 'm' as keyof Theme['borderRadii'],
    fontSize = 14,
    fontFamily = 'Poppins-Regular',
    marginBottom = 'l' as keyof Theme['spacing'],
    editable = true,
    ...props
}: FormFieldProps) => {
    return (
        <View marginBottom={marginBottom === 'none' ? undefined : marginBottom}>
            {label && (
                <Text
                    fontSize={12}
                    fontWeight="400"
                    color="textSecondary"
                    marginBottom="s"
                    fontFamily="Poppins-Regular"
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
                editable={editable}
                {...props}
            />
        </View>
    );
});

FormField.displayName = 'FormField';

export default FormField;
