import { StyleSheet } from "react-native";
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const About = () => {
  return (
    <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="About Section" moreAction={false} />

        <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
          <View backgroundColor="mainBackground" borderRadius="l" padding="l" marginBottom="m">
            <Text
              fontSize={18}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="m"
            >
              App Information
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
              marginBottom="s"
            >
              Version: 1.0.0
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
              marginBottom="s"
            >
              Build: 2024.1
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
            >
              Last Updated: January 2024
            </Text>
          </View>

          <View backgroundColor="mainBackground" borderRadius="l" padding="l" marginBottom="m">
            <Text
              fontSize={18}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="m"
            >
              About Food Court App
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
            >
              Food Court App is designed to provide a seamless dining experience for students and staff. 
              Order your favorite meals, track your orders, and enjoy delicious food from various cuisines 
              available in the campus food court.
            </Text>
          </View>

          <View backgroundColor="mainBackground" borderRadius="l" padding="l">
            <Text
              fontSize={18}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="m"
            >
              Features
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
              marginBottom="s"
            >
              • Browse multiple cuisines
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
              marginBottom="s"
            >
              • Order food for dine-in or takeaway
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
              marginBottom="s"
            >
              • Track your orders in real-time
            </Text>
            <Text
              fontSize={14}
              fontWeight="400"
              color="textSecondary"
              fontFamily="Poppins-Regular"
              lineHeight={20}
            >
              • Save your favorite items
            </Text>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({});

export default About;
