
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from "../../components/ui";
import { FAQItem as FAQItemType, faqData, pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const FAQItem = ({ item, isExpanded, onPress }: {
  item: FAQItemType;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const rotateAnim = new Animated.Value(isExpanded ? 1 : 0);

  Animated.timing(rotateAnim, {
    toValue: isExpanded ? 1 : 0,
    duration: 200,
    useNativeDriver: true,
  }).start();

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View>
      <Pressable onPress={onPress} style={styles.faqItem}>
        <View flexDirection="row" alignItems="center" paddingVertical="l">
          <View flex={1}>
            <Text
              fontSize={16}
              fontWeight="500"
              color="textPrimary"
              fontFamily="Poppins-Medium"
            >
              {item.question}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-forward" size={20} color="textPrimary" />
          </Animated.View>
        </View>
      </Pressable>
      
      {isExpanded && (
        <Animated.View style={styles.answerContainer}>
          <Text
            fontSize={14}
            fontWeight="400"
            color="textSecondary"
            fontFamily="Poppins-Regular"
            lineHeight={20}
            paddingHorizontal="m"
            paddingBottom="l"
          >
            {item.answer}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleFAQPress = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
          <ScreenHeader title="FAQ's" moreAction={false} />
          <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
            <View backgroundColor="transparent" borderRadius="l">
              {faqData.map((item, index) => (
                <View key={item.id}>
                  <FAQItem
                    item={item}
                    isExpanded={expandedItems.has(item.id)}
                    onPress={() => handleFAQPress(item.id)}
                  />
                  {index < faqData.length - 1 && (
                    <View borderTopWidth={1} borderTopColor='textPrimary' opacity={0.2} />
                  )}
                </View>
              ))}
            </View>
          </View>
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  faqItem: {
    paddingHorizontal: 16,
  },
  answerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default FAQ;