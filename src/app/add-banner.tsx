import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Alert, Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, FileUpload, FormField, Text, View } from '../components/ui';
import { betterwayApiCall } from '../network/useApiPort';
import { RootState, useAppSelector } from '../store/store';
import { showToast } from '../utils';

const { width, height } = Dimensions.get('window');

const AddBanner = memo(() => {
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [bannerTitle, setBannerTitle] = useState('');
    const [bannerFile, setBannerFile] = useState<any>(null);
    const [bannerFileName, setBannerFileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = useCallback(async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setBannerFile(file);
                setBannerFileName(file.name);
                console.log('Banner file selected:', file);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    }, []);

    const validateForm = useCallback(() => {
        if (!bannerTitle.trim()) {
            showToast({
                message: 'Please enter banner title',
                type: 'error',
            });
            return false;
        }
        if (!bannerFile) {
            showToast({
                message: 'Please upload banner image',
                type: 'error',
            });
            return false;
        }
        return true;
    }, [bannerTitle, bannerFile]);

    const handleCreateBanner = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', bannerTitle);
            
            // Append the image file
            if (bannerFile) {
                formData.append('image', {
                    uri: bannerFile.uri,
                    type: bannerFile.mimeType || 'image/jpeg',
                    name: bannerFile.name || 'banner.jpg',
                } as any);
            }

            const response = await betterwayApiCall({
                method: "POST",
                url: "CREATE_BANNER",
                auth: token,
                body: formData,
            });

            if (response?.status === 200 || response?.data) {
                showToast({
                    message: 'Banner created successfully!',
                    type: 'success',
                });
                // Clear form
                setBannerTitle('');
                setBannerFile(null);
                setBannerFileName(null);
                // Navigate back
                setTimeout(() => {
                    router.back();
                }, 1000);
            } else {
                showToast({
                    message: response?.data?.message || 'Failed to create banner',
                    type: 'error',
                });
            }
        } catch (error) {
            showToast({
                message: (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || 'Failed to create banner',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [validateForm, bannerTitle, bannerFile, token]);

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ImageBackground
                source={require('../../assets/images/primary_bg.webp')}
                style={{
                    width,
                    height,
                }}
                resizeMode="cover"
            >
                <StatusBar barStyle='light-content' backgroundColor="#A20538" translucent />
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{ flex: 1 }}>
                                {/* Header */}
                                <View
                                    justifyContent="center"
                                    alignItems="center"
                                    paddingTop="xl"
                                    paddingBottom="l"
                                    minHeight={height * 0.15}
                                >
                                    <View
                                        position="absolute"
                                        top={60}
                                        left={24}
                                        zIndex={1}
                                    >
                                        <Pressable onPress={handleBack}>
                                            <AntDesign name="arrow-left" size={28} color="white" />
                                        </Pressable>
                                    </View>
                                    <View alignItems="center">
                                        <Text
                                            fontSize={32}
                                            fontWeight="bold"
                                            color="textOnPrimary"
                                            textAlign="center"
                                            fontFamily="Poppins-Bold"
                                            lineHeight={42}
                                        >
                                            Add Banner
                                        </Text>
                                    </View>
                                </View>

                                {/* Form Container */}
                                <View
                                    backgroundColor="mainBackgroundLight"
                                    flex={1}
                                    style={{
                                        borderTopLeftRadius: 60,
                                    }}
                                >
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollContent}
                                    >
                                        <View marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                marginBottom="s"
                                                fontFamily="Poppins-Regular"
                                            >
                                                Banner Title <Text color="primary">*</Text>
                                            </Text>
                                            <FormField
                                                label=""
                                                placeholder="Enter banner title"
                                                value={bannerTitle}
                                                onChangeText={setBannerTitle}
                                                marginBottom="xs"
                                            />
                                        </View>

                                        <View marginBottom="l">
                                            <FileUpload
                                                label="Banner Image"
                                                required
                                                onPress={handleFileUpload}
                                                fileName={bannerFileName || undefined}
                                                description="(1920x1080 or larger recommended, up to 5MB)"
                                                uploadText="Upload your banner image here"
                                            />
                                        </View>

                                        <View marginTop="l" marginBottom="xl">
                                            <Button
                                                title="ADD BANNER"
                                                variant="primary"
                                                onPress={handleCreateBanner}
                                                disabled={isLoading}
                                                loading={isLoading}
                                            />
                                        </View>

                                        <View alignItems="center" marginBottom="l">
                                            <Text
                                                fontSize={14}
                                                fontWeight="400"
                                                color="textSecondary"
                                                textAlign="center"
                                                fontFamily="Poppins-Regular"
                                                lineHeight={20}
                                            >
                                                Create promotional banners for your app
                                            </Text>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
});

AddBanner.displayName = 'AddBanner';

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        flexGrow: 1,
    },
});

export default AddBanner;

