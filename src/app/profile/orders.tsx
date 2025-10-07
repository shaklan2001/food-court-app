import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const Orders = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F88' }}>
    <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Your Orders" moreAction={false} />

        <View flex={1} justifyContent="center" alignItems="center" paddingHorizontal={pageHorizantalPadding}>
          <Ionicons name="bag-outline" size={80} color="#D3D3D3" />
          <Text
            fontSize={18}
            fontWeight="600"
            color="textPrimary"
            fontFamily="Poppins-SemiBold"
            marginTop="l"
            marginBottom="s"
          >
            No Orders Yet
          </Text>
          <Text
            fontSize={14}
            fontWeight="400"
            color="textSecondary"
            fontFamily="Poppins-Regular"
            textAlign="center"
            lineHeight={20}
          >
            Your order history will appear here once you place your first order
          </Text>
        </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Orders;
