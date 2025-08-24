import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/theme';
import { Text, View } from '../ui';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onToggle: (checked: boolean) => void;
    size?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: keyof Theme['colors'];
}

const Checkbox = memo(({
    label,
    checked,
    onToggle,
    size = 20,
    fontSize = 14,
    fontFamily = "Inter-Regular",
    color = "textSecondary",
}: CheckboxProps) => {
    const theme = useTheme<Theme>();

    return (
        <TouchableOpacity
            onPress={() => onToggle(!checked)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
            <View
                width={size}
                height={size}
                borderWidth={2}
                borderColor="textSecondary"
                borderRadius="xs"
                marginRight="s"
                justifyContent="center"
                alignItems="center"
            >
                {checked && (
                    <AntDesign name="check" size={size * 0.7} color={theme.colors.primary} />
                )}
            </View>
            <Text
                fontSize={fontSize}
                fontWeight="400"
                color={color}
                fontFamily={fontFamily}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
