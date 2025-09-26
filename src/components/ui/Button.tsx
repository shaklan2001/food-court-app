import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../theme/theme';
import Text from './Text';
import View from './View';

const ButtonBox = createRestyleComponent<
    VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof View>,
    Theme
>([createVariant({ themeKey: 'buttonVariants' })], View);

interface ButtonProps extends
    VariantProps<Theme, 'buttonVariants'>,
    TouchableOpacityProps {
    title: string;
    textVariant?: Exclude<keyof Theme['textVariants'], 'defaults'>;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    textVariant = 'button',
    loading = false,
    disabled,
    ...props
}) => {
    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return 'textOnPrimary';
            case 'outline':
                return 'primary';
            case 'secondary':
            default:
                return 'textPrimary';
        }
    };

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity {...props} activeOpacity={0.8} disabled={isDisabled}>
            <ButtonBox variant={variant} opacity={isDisabled ? 0.7 : 1}>
                <View flexDirection="row" alignItems="center" justifyContent="center">
                    {loading && (
                        <ActivityIndicator 
                            size="small" 
                            color={variant === 'primary' ? '#FFFFFF' : '#A20538'} 
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text variant={textVariant} color={getTextColor()}>
                        {title}
                    </Text>
                </View>
            </ButtonBox>
        </TouchableOpacity>
    );
};

export default Button;
