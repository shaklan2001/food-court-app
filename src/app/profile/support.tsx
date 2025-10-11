import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback } from "react";
import { Linking, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const SupportItem = ({ icon, title, subtitle, onPress }: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => {
  return (
      <Pressable onPress={onPress} style={styles.supportItem}>
        <View flexDirection="row" alignItems="center" paddingVertical="m">
          <View
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
            backgroundColor="primary"
            borderRadius="m"
            marginRight="m"
          >
            <Ionicons name={icon as any} size={20} color="white" />
          </View>
          <View flex={1}>
            <Text
              fontSize={16}
              fontWeight="500"
              color="textPrimary"
              fontFamily="Poppins-Medium"
              marginBottom="xs"
            >
              {title}
            </Text>
            <Text
              fontSize={12}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
            >
              {subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D3D3D3" />
        </View>
      </Pressable>
  );
};

const Support = () => {

  const handleCallSupport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('tel:+1234567890');
  }, []);

  const handleEmailSupport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('mailto:support@foodcourt.com');
  }, []);

  const handleLiveChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleFAQ = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="Support" moreAction={false} />
          <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
            <View backgroundColor="mainBackground" borderRadius="l" marginBottom="m">
              <SupportItem
                icon="call-outline"
                title="Call Support"
                subtitle="Speak with our support team"
                onPress={handleCallSupport}
              />
              <View borderTopWidth={1} style={{ borderTopColor: '#F0F0F0' }} />
              
              <SupportItem
                icon="mail-outline"
                title="Email Support"
                subtitle="Send us an email"
                onPress={handleEmailSupport}
              />
              <View borderTopWidth={1} style={{ borderTopColor: '#F0F0F0' }} />
              
              <SupportItem
                icon="chatbubble-outline"
                title="Live Chat"
                subtitle="Chat with us instantly"
                onPress={handleLiveChat}
              />
              <View borderTopWidth={1} style={{ borderTopColor: '#F0F0F0' }} />
              
              <SupportItem
                icon="help-circle-outline"
                title="FAQ"
                subtitle="Find answers to common questions"
                onPress={handleFAQ}
              />
            </View>

            <View backgroundColor="mainBackground" borderRadius="l" padding="l">
              <Text
                fontSize={16}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                marginBottom="m"
              >
                Support Hours
              </Text>
              <Text
                fontSize={14}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                lineHeight={20}
                marginBottom="s"
              >
                Monday - Friday: 9:00 AM - 6:00 PM
              </Text>
              <Text
                fontSize={14}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                lineHeight={20}
              >
                Saturday - Sunday: 10:00 AM - 4:00 PM
              </Text>
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  supportItem: {
    paddingHorizontal: 16,
  },
});

export default Support;
