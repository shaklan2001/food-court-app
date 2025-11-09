import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, CustomTextInput, Text, View } from "../../components/ui";
import { pageHorizantalPadding } from "../../utils/commomCompute";
import { ScreenHeader } from '../cart';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleBackPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, []);

  const handleRatingPress = useCallback((selectedRating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(selectedRating);
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Feedback submitted:', { feedback, rating });
  }, [feedback, rating]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
    <View flex={1} backgroundColor="mainBackgroundLight">
        <ScreenHeader title="Feedback" />

        <View paddingHorizontal={pageHorizantalPadding} paddingTop="l">
          <View backgroundColor="mainBackground" borderRadius="l" padding="l" marginBottom="m">
            <Text
              fontSize={16}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="m"
            >
              Rate Your Experience
            </Text>
            
            <View flexDirection="row" justifyContent="space-between" marginBottom="l">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => handleRatingPress(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#FFD700" : "#D3D3D3"}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View backgroundColor="mainBackground" borderRadius="l" padding="l" marginBottom="l">
            <Text
              fontSize={16}
              fontWeight="600"
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              marginBottom="m"
            >
              Tell Us More
            </Text>
            
            <CustomTextInput
              placeholder="Share your thoughts, suggestions, or report any issues..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={6}
              style={styles.feedbackInput}
            />
          </View>

          <Button
            title="Submit Feedback"
            onPress={handleSubmitFeedback}
            variant="primary"
            disabled={!feedback.trim() || rating === 0}
          />
        </View>
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  starButton: {
    padding: 4,
  },
  feedbackInput: {
    textAlignVertical: 'top',
    minHeight: 220,

  },
});

export default Feedback;
