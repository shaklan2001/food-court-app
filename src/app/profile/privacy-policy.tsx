import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Privacy Policy" moreAction={false} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View paddingHorizontal={pageHorizantalPadding} paddingTop="l" paddingBottom="xl">
            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
              marginBottom="l"
            >
              At Cafe Shiv Kalesh, your privacy matters to us. We collect basic information like your name, contact details, and address only to process your food orders and improve our services.
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
              marginBottom="l"
            >
              Your data is kept secure and never shared with anyone except trusted partners like payment gateways or delivery services.
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
            >
              By using our app, you agree to our data practices. For any questions, reach out at support@cafeshivkalesh.com
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

