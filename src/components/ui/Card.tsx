import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import React from 'react';
import { Theme } from '../../theme/theme';
import View from './View';

const Card = createRestyleComponent<
    VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof View>,
    Theme
>([createVariant({ themeKey: 'cardVariants' })], View);

export default Card;
