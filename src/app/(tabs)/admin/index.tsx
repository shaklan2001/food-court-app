import { Text, View } from '@/src/components/ui';
import { RootState } from '@/src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const AdminButton = memo(({ icon, title, onPress }: { icon: 'pricetag' | 'image'; title: string; onPress: () => void }) => {
    return (
        <Pressable onPress={onPress} style={{
            flex: 1,
        }}>
            <ImageBackground
                source={require('../../../../assets/images/admin-bg.png')}
                style={{
                    width: '100%',
                    height: '90%',
                    borderRadius: 16,
                }}
                resizeMode="cover"
                imageStyle={{
                    borderRadius: 26,
                }}
            >
                <View
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                >
                    <View
                        width={56}
                        height={56}
                        borderRadius="xxl"
                        backgroundColor="mainBackground"
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="s"
                    >
                        <Ionicons name={icon} size={28} color="#A20538" />
                    </View>
                    <Text
                        fontSize={16}
                        fontWeight="600"
                        color="textOnPrimary"
                        fontFamily="Poppins-SemiBold"
                        textAlign="center"
                    >
                        {title}
                    </Text>
                </View>
            </ImageBackground>
        </Pressable>
    );
});

const Admin = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const firstName = user?.name?.split(' ')[0] || 'Admin';

    const handleCouponCreation = () => {
        router.push('/coupon-creation');
    };

    const handleAddBanner = () => {
        router.push('/add-banner');
    };

    return (
        <View flex={1} backgroundColor="mainBackgroundLight">
            <StatusBar barStyle="light-content" backgroundColor="#A20538" />
            
            <View
                backgroundColor="primary"
                paddingTop='xl'
                paddingBottom="l"
                paddingHorizontal="l"
                alignItems="center"
                style={styles.header}
            >
                    <View alignItems="center" width="100%" paddingTop="l">
                        <Image
                            source={require('../../../../assets/images/font-logo.png')}
                            style={{
                                height: 120,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View paddingHorizontal="l" marginTop="xl">
                    <Text
                        fontSize={16}
                        fontWeight="400"
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        marginBottom="xs"
                    >
                        Hi {firstName}👋
                    </Text>
                    <Text
                        fontSize={24}
                        fontWeight="bold"
                        color="textPrimary"
                        fontFamily="Poppins-Bold"
                        lineHeight={32}
                    >
                        Welcome To Admin Panel
                    </Text>
                </View>

                {/* Action Buttons */}
                <View 
                    paddingHorizontal="l" 
                    marginTop="xl"
                    flexDirection="row"
                    gap="m"
                >
                    <AdminButton
                        icon="pricetag"
                        title="Coupon Creation"
                        onPress={handleCouponCreation}
                    />
                    <AdminButton
                        icon="image"
                        title="Add Banner"
                        onPress={handleAddBanner}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
});

AdminButton.displayName = 'AdminButton';

export default Admin;
