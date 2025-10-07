import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from "../cart";

const Favourites = () => {    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
            <View flex={1} backgroundColor="mainBackgroundLight">
                <ScreenHeader title="Favourites" moreAction={false} />
                <View
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal={pageHorizantalPadding}
                >
                    <Ionicons name="heart-outline" size={80} color="#D3D3D3" />
                    <Text
                        fontSize={18}
                        fontWeight="600"
                        color="textPrimary"
                        fontFamily="Poppins-SemiBold"
                        marginTop="l"
                        marginBottom="s"
                    >
                        No Favourites Yet
                    </Text>
                    <Text
                        fontSize={14}
                        fontWeight="400"
                        color="textSecondary"
                        fontFamily="Poppins-Regular"
                        textAlign="center"
                        lineHeight={20}
                    >
                        Start adding items to your favourites by tapping the heart icon on
                        any food item
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Favourites;
