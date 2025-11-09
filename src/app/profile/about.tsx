import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const About = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="About Screen" />

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
              Welcome to Cafe Shiv Kalesh, your one-stop destination for delicious food delivered right to your doorstep! 🍔
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
              marginBottom="l"
            >
              At Cafe Shiv Kalesh, we believe that great food brings people together. Our app is designed to give you the perfect restaurant experience — anytime, anywhere. From mouth-watering snacks to hearty meals and refreshing beverages, we've got something to satisfy every craving.
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
              marginBottom="l"
            >
              With an easy-to-use interface and a wide variety of menu options, you can explore, order, and enjoy your favorite dishes within just a few taps. Whether you're in the mood for spicy street food, authentic Indian cuisine, or a comforting dessert, Cafe Shiv Kalesh serves it all — fresh, flavorful, and fast!
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
              marginBottom="l"
            >
              Our mission is simple: to make every meal a moment of joy by combining taste, quality, and convenience.
            </Text>

            <Text
              fontSize={16}
              fontWeight="400"
              color="textPrimary"
              fontFamily="Poppins-Regular"
              lineHeight={26}
            >
              So go ahead, browse our menu, place your order, and experience the magic of Cafe Shiv Kalesh — where every bite tells a story of flavor and freshness.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


export default About;
