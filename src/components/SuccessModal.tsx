import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable } from 'react-native';
import theme from '../theme/theme';
import { Text, View } from './ui';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title = "Successfull",
  message = "Congratulations your order is accepted.",
  buttonText = "Checkout"
}) => {
  const [showContent, setShowContent] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      setShowContent(false);
      contentOpacity.setValue(0);
      contentTranslateY.setValue(20);
      
      const timer = setTimeout(() => {
        setShowContent(true);
        Animated.parallel([
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      contentOpacity.setValue(0);
      contentTranslateY.setValue(20);
    }
  }, [visible, contentOpacity, contentTranslateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        flex={1}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="l"
      >
        <View
          backgroundColor="mainBackground"
          borderRadius="l"
          padding="l"
          alignItems="center"
          minWidth={300}
          maxWidth={350}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.25}
          shadowRadius={8}
          shadowColor="textPrimary"
          elevation={8}
        >
          <View
            width={150}
            height={150}
          >
            <LottieView
              source={require('@/assets/images/lottie/success.json')}
              autoPlay
              loop={false}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          {showContent && (
            <Animated.View
              style={{
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text
                fontSize={24}
                fontWeight="bold"
                color="textPrimary"
                fontFamily="Poppins-Bold"
                textAlign="center"
                marginBottom="s"
              >
                {title}
              </Text>

              <Text
                fontSize={13}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                textAlign="center"
                lineHeight={20}
                marginBottom="xl"
                style={{
                  color: '#847673',
                }}
              >
                {message}
              </Text>

              <Pressable
                onPress={onClose}
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 12,
                  paddingHorizontal: theme.spacing.xl,
                  paddingVertical: 12,
                  minWidth: 200,
                }}
              >
                <Text
                  fontSize={16}
                  fontWeight="400"
                  color="textOnPrimary"
                  fontFamily="Poppins-Medium"
                  textAlign="center"
                >
                  {buttonText}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
