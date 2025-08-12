# Shopify Restyle Integration Guide

## Overview
This project now uses Shopify Restyle for consistent, theme-based UI components. Your primary color **#FF0000** (red) has been integrated throughout the theme system.

## Quick Start

### Import Components
```tsx
import { Box, Text, Card, Button } from '../components/ui';
```

### Basic Usage
```tsx
<Box flex={1} backgroundColor="mainBackground" padding="m">
  <Text variant="header">Welcome</Text>
  <Card variant="primary">
    <Text variant="body" color="textOnPrimary">
      Content goes here
    </Text>
  </Card>
  <Button title="Click me" variant="primary" onPress={() => {}} />
</Box>
```

## Theme Structure

### Colors
- **Primary Colors**: `primary` (#FF0000), `redLight`, `redDark`
- **Background**: `mainBackground`, `cardPrimaryBackground`, `cardSecondaryBackground`
- **Text**: `textPrimary`, `textSecondary`, `textOnPrimary`
- **UI Elements**: `buttonPrimary`, `border`, `success`, `danger`, `warning`, `info`

### Spacing Scale
- `xs`: 4px
- `s`: 8px  
- `m`: 16px
- `l`: 24px
- `xl`: 40px
- `xxl`: 80px

### Text Variants
- `header`: Large bold text (34px)
- `subheader`: Medium bold text (28px)
- `body`: Regular text (16px)
- `caption`: Small text (12px)
- `button`: Button text styling

### Component Variants

#### Card Variants
- `primary`: Red background with your primary color
- `secondary`: Light gray background with border
- `elevated`: White background with shadow

#### Button Variants  
- `primary`: Red background button
- `secondary`: Gray background button
- `outline`: Transparent with red border

## Responsive Design
The theme includes breakpoints for responsive design:
```tsx
<Box
  flexDirection={{
    phone: 'column',
    tablet: 'row',
  }}
>
  {/* Content adapts to screen size */}
</Box>
```

## Available Components

### Box
Flexible container component:
```tsx
<Box 
  flex={1}
  backgroundColor="mainBackground"
  padding="m"
  borderRadius="l"
>
  {/* Content */}
</Box>
```

### Text
Typography component with variants:
```tsx
<Text variant="header" color="primary">
  Header Text
</Text>
```

### Card
Predefined card layouts:
```tsx
<Card variant="primary">
  <Text variant="body" color="textOnPrimary">
    Card content
  </Text>
</Card>
```

### Button
Interactive button component:
```tsx
<Button 
  title="Click Me"
  variant="primary"
  onPress={() => console.log('Pressed')}
/>
```

## Customization
To modify the theme, edit `/src/theme/theme.ts` and adjust:
- Colors in the `palette` object
- Spacing values
- Text variants
- Component variants

## Examples
Check out:
- `/src/app/(tabs)/index.tsx` - Updated home screen with Restyle
- `/src/components/examples/RestyleExample.tsx` - Comprehensive example

The theme system ensures consistent styling across your entire food court app while maintaining flexibility for customization.
