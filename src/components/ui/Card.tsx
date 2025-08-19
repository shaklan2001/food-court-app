import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import React from 'react';
import { Theme } from '../../theme/theme';
import Box from './View';

const Card = createRestyleComponent<
    VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
    Theme
>([createVariant({ themeKey: 'cardVariants' })], Box);

export default Card;
