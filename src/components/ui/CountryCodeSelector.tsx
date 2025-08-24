import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/theme';
import Text from './Text';
import View from './View';

interface CountryCodeSelectorProps {
    onPress?: () => void;
    countryCode?: string;
    flag?: string;
    width?: number;
    height?: number;
}

const CountryCodeSelector = memo(({
    onPress,
    countryCode = '+91',
    flag = '🇮🇳',
    width = 85,
    height = 48,
}: CountryCodeSelectorProps) => {
    const theme = useTheme<Theme>();

    return (
        <TouchableOpacity onPress={onPress}>
            <View
                flexDirection="row"
                alignItems="center"
                backgroundColor="mainBackground"
                borderWidth={1}
                borderColor="inputBorder"
                borderRadius="s"
                paddingHorizontal="s"
                height={height}
                minWidth={width}
                justifyContent="space-between"
            >
                <View flexDirection="row" alignItems="center">
                    <View
                        width={20}
                        height={20}
                        borderRadius="m"
                        overflow="hidden"
                        marginRight="xs"
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor="transparent"
                    >
                        <Text fontSize={14}>{flag}</Text>
                    </View>
                    <Text
                        fontSize={16}
                        fontWeight="400"
                        color="textPrimary"
                        fontFamily="Inter-Regular"
                    >
                        {countryCode}
                    </Text>
                </View>
                <AntDesign name="down" size={12} color={theme.colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );
});

CountryCodeSelector.displayName = 'CountryCodeSelector';

export default CountryCodeSelector;
