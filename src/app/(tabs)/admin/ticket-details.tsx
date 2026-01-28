import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { memo, useCallback } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from '../../../components/ui';
import { Theme } from '../../../theme/theme';

const { width, height } = Dimensions.get('window');

const TicketDetails = memo(() => {
    const params = useLocalSearchParams();
    const { id, status, description } = params;
    const theme = useTheme<Theme>();

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    return (
        <View flex={1} backgroundColor="mainBackground">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle='light-content' backgroundColor={theme.colors.primary} translucent />
            
            {/* Header */}
            <View
                backgroundColor="primary"
                paddingTop="xl"
                paddingBottom="m"
                paddingHorizontal="l"
            >
                <SafeAreaView edges={['top']}>
                    <View
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        height={44}
                    >
                        <View position="absolute" left={0} zIndex={1}>
                            <Pressable onPress={handleBack}>
                                <AntDesign name="arrow-left" size={24} color={theme.colors.textOnPrimary} />
                            </Pressable>
                        </View>
                        <Text
                            fontSize={18}
                            fontWeight="600"
                            color="textOnPrimary"
                            fontFamily="Poppins-SemiBold"
                        >
                            Ticket Detail
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Ticket Header Info */}
                <View marginTop="l" marginBottom="m">
                    <View flexDirection="row" alignItems="center" marginBottom="s">
                        <Text
                            fontSize={16}
                            fontWeight="600"
                            color="textPrimary"
                            fontFamily="Poppins-SemiBold"
                            marginRight="m"
                        >
                            Ticket: #{id}
                        </Text>
                        <View
                            paddingHorizontal="m"
                            paddingVertical="xs"
                            borderRadius="l"
                            style={{ backgroundColor: status === 'Pending' ? theme.colors.warning : theme.colors.success }}
                        >
                            <Text
                                fontSize={12}
                                color="textOnPrimary"
                                fontFamily="Poppins-Medium"
                            >
                                {status}
                            </Text>
                        </View>
                    </View>
                    
                    <Text
                        fontSize={16}
                        fontWeight="500"
                        color="textPrimary"
                        fontFamily="Poppins-Medium"
                    >
                        {description}
                    </Text>
                </View>

                {/* Description Card */}
                <View
                    backgroundColor="mainBackground"
                    padding="l"
                    borderRadius="m"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    <Text
                        fontSize={14}
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        lineHeight={22}
                        marginBottom="l"
                    >
                        The application is not working properly and is showing inconsistent behavior across multiple features. Users are facing issues while performing routine actions such as navigation, loading screens, and interacting with core functionalities. In some cases, the application becomes unresponsive or fails to complete actions as expected, which significantly impacts usability and overall user experience.
                        {'\n\n'}
                        This issue appears to occur repeatedly and is not limited to a single user flow, suggesting a broader functional or performance-related problem. Due to this, users are unable to complete their intended tasks efficiently, resulting in workflow disruption and potential user dissatisfaction. A thorough investigation is required to identify the root cause, assess the scope of impact, and implement a fix to restore stable and reliable application performance.
                    </Text>

                    {/* User Info */}
                    <View flexDirection="row" alignItems="center">
                        <Image 
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                        />
                        <View>
                            <Text
                                fontSize={14}
                                fontWeight="600"
                                color="textPrimary"
                                fontFamily="Poppins-SemiBold"
                            >
                                Aman Sharma
                            </Text>
                            <Text
                                fontSize={12}
                                color="textSecondary"
                                fontFamily="Poppins-Regular"
                            >
                                30min later
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Button */}
            <View 
                padding="l" 
                paddingBottom="xl"
                backgroundColor="mainBackground"
            >
                <Button
                    title="Reply"
                    variant="primary"
                    onPress={() => {}}
                />
            </View>
        </View>
    );
});

TicketDetails.displayName = 'TicketDetails';

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});

import { Pressable } from 'react-native';

export default TicketDetails;
