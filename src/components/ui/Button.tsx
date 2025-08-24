import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
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
        <TouchableOpacity {...props} activeOpacity={0.8}>
            <ButtonBox variant={variant}>
                <Text variant={textVariant} color={getTextColor()}>
                    {title}
                </Text>
            </ButtonBox>
        </TouchableOpacity>
    );
};

export default Button;
