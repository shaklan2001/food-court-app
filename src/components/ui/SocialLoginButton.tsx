import { memo } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, Pressable } from 'react-native';
import View from './View';

interface SocialLoginButtonProps {
    onPress: () => void;
    imageSource: ImageSourcePropType;
    width?: number;
    height?: number;
    imageWidth?: number;
    imageHeight?: number;
    disabled?: boolean;
    loading?: boolean;
}

const SocialLoginButton = memo(({
    onPress,
    imageSource,
    width = 64,
    height = 64,
    imageWidth = 26,
    imageHeight = 26,
    disabled = false,
    loading = false,
}: SocialLoginButtonProps) => {
    return (
        <Pressable onPress={onPress} disabled={disabled || loading}>
            <View
                width={width}
                height={height}
                backgroundColor="inputBackground"
                borderRadius="m"
                justifyContent="center"
                alignItems="center"
                opacity={disabled || loading ? 0.6 : 1}
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
                {loading ? (
                    <ActivityIndicator size="small" color="#666" />
                ) : (
                    <Image
                        source={imageSource}
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            resizeMode: 'contain',
                        }}
                    />
                )}
            </View>
        </Pressable>
    );
});

SocialLoginButton.displayName = 'SocialLoginButton';

export default SocialLoginButton;
