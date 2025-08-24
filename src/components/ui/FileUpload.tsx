import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/theme';
import { Text, View } from './index';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

interface FileUploadProps {
    label: string;
    required?: boolean;
    onPress: () => void;
    fileName?: string;
    description?: string;
    marginBottom?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
}

const FileUpload = memo(({
    label,
    required = false,
    onPress,
    fileName,
    description = "(345x255 or larger recommended, upto 1MB each)",
    marginBottom = 'l'
}: FileUploadProps) => {
    const theme = useTheme<Theme>();

    return (
        <View marginBottom={marginBottom}>
            <Text
                fontSize={14}
                fontWeight="400"
                color="textSecondary"
                marginBottom="s"
                fontFamily="Inter-Regular"
            >
                {label} {required && <Text color="primary">*</Text>}
            </Text>

            <TouchableOpacity onPress={onPress}>
                <View
                    borderWidth={2}
                    borderColor="textPrimary"
                    borderRadius="l"
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal="m"
                    paddingVertical="l"
                    minHeight={120}
                    backgroundColor="mainBackground"
                    style={{
                        borderStyle: 'dashed',
                    }}
                >
                    {fileName ? (
                        <View alignItems="center">
                            <AntDesign
                                name="checkcircle"
                                size={32}
                                color={theme.colors.primary}
                                style={{ marginBottom: 8 }}
                            />
                            <Text
                                fontSize={16}
                                fontWeight="500"
                                color="textPrimary"
                                textAlign="center"
                                fontFamily="Inter-Medium"
                                marginBottom="xs"
                            >
                                {fileName}
                            </Text>
                            <Text
                                fontSize={12}
                                fontWeight="400"
                                color="textSecondary"
                                textAlign="center"
                                fontFamily="Inter-Regular"
                            >
                                Tap to change file
                            </Text>
                        </View>
                    ) : (
                        <View alignItems="center">
                            <SimpleLineIcons name="cloud-upload" size={60} color={"#CCCCCC"} />
                            <Text
                                fontSize={14}
                                marginTop="m"
                                fontWeight="500"
                                color="textPrimary"
                                textAlign="center"
                                fontFamily="Inter-Medium"
                                marginBottom="xs"
                            >
                                Upload your student I'd here
                            </Text>
                            <Text
                                fontSize={12}
                                fontWeight="400"
                                color="textSecondary"
                                textAlign="center"
                                fontFamily="Inter-Regular"
                                marginBottom="m"
                            >
                                {description}
                            </Text>
                            <View
                                backgroundColor="primary"
                                paddingHorizontal="l"
                                paddingVertical="s"
                                borderRadius="s"
                            >
                                <Text
                                    fontSize={14}
                                    fontWeight="600"
                                    color="textOnPrimary"
                                    fontFamily="Inter-Medium"
                                >
                                    Browse now
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
