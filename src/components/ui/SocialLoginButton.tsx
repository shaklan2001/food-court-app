import React, { memo } from 'react';
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import View from './View';

interface SocialLoginButtonProps {
    onPress: () => void;
    imageSource: ImageSourcePropType;
    width?: number;
    height?: number;
    imageWidth?: number;
    imageHeight?: number;
}

const SocialLoginButton = memo(({
    onPress,
    imageSource,
    width = 64,
    height = 64,
    imageWidth = 26,
    imageHeight = 26,
}: SocialLoginButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                width={width}
                height={height}
                backgroundColor="inputBackground"
                borderRadius="m"
                justifyContent="center"
                alignItems="center"
                style={{
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                }}
            >
                <Image
                    source={imageSource}
                    style={{
                        width: imageWidth,
                        height: imageHeight,
                        resizeMode: 'contain'
                    }}
                />
            </View>
        </TouchableOpacity>
    );
});

SocialLoginButton.displayName = 'SocialLoginButton';

export default SocialLoginButton;
