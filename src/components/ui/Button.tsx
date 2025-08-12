import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../theme/theme';
import Box from './Box';
import Text from './Text';

const ButtonBox = createRestyleComponent<
    VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
    Theme
>([createVariant({ themeKey: 'buttonVariants' })], Box);

interface ButtonProps extends
    VariantProps<Theme, 'buttonVariants'>,
    TouchableOpacityProps {
    title: string;
    textVariant?: keyof Theme['textVariants'];
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    textVariant = 'button',
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

    return (
        <TouchableOpacity {...props}>
            <ButtonBox variant={variant}>
                <Text variant={textVariant} color={getTextColor()}>
                    {title}
                </Text>
            </ButtonBox>
        </TouchableOpacity>
    );
};

export default Button;
