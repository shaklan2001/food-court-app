import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
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
    width = 65,
    height = 48,
}: CountryCodeSelectorProps) => {
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
                        marginBottom="xs"
                    >
                        <Text fontSize={14}>{flag}</Text>
                    </View>
                    <Text
                        fontSize={14}
                        fontSize={14}
                        fontWeight="400"
                        color="textPrimary"
                        fontFamily="Poppins-Regular"
                        fontFamily="Poppins-Regular"
                    >
                        {countryCode}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

CountryCodeSelector.displayName = 'CountryCodeSelector';

export default CountryCodeSelector;
