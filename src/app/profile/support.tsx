import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
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
        <View flexDirection="row" alignItems="center" paddingVertical="l">
          <View
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
            backgroundColor='mainBackground'
            borderRadius="m"
            marginRight="m"
          >
            <Ionicons name={icon as any} size={22} color="black" />
          </View>
          <View flex={1}>
            <Text
              fontSize={16}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="xs"
            >
              {title}
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
            >
              {subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#000000" />
        </View>
      </Pressable>
  );
};

const Support = () => {
  const handleFAQ = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile/fandq');
  }, []);

  const handleSupportTicket = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile/supportTicket');
  }, []);

  const handleContactSupport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to contact support screen when implemented
    console.log('Navigate to Contact Support');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="Help & Support" />
          <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
            <View backgroundColor="transparent" borderRadius="l">
              <SupportItem
                icon="help-circle"
                title="FAQ"
                subtitle="Find quick answers here."
                onPress={handleFAQ}
              />
              <View borderTopWidth={1} borderTopColor='textPrimary' opacity={0.2} />
              
              <SupportItem
                icon="document-text"
                title="Raise a Support Ticket"
                subtitle="Submit a support request here."
                onPress={handleSupportTicket}
              />
              <View borderTopWidth={1} borderTopColor='textPrimary' opacity={0.2} />
              
              <SupportItem
                icon="headset"
                title="Contact Support"
                subtitle="Reach out to Support."
                onPress={handleContactSupport}
              />
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
