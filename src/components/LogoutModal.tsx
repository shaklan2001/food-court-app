import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable } from 'react-native';
import { Text, View } from './ui';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirm
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
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          minWidth={280}
          maxWidth={320}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.25}
          shadowRadius={8}
          shadowColor="textPrimary"
          elevation={8}
        >
          {showContent && (
            <Animated.View
              style={{
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }],
                alignItems: 'center',
                width: '100%',
              }}
            >
              <View
                width={60}
                height={60}
                justifyContent="center"
                alignItems="center"
                marginBottom="m"
              >
                <Image
                  source={require('../../assets/images/logout.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>

              <Text
                fontSize={14}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                textAlign="center"
                marginBottom="m"
              >
                Do you want to Log out
              </Text>

              <View flexDirection="row" width="100%" justifyContent="space-between">
                <Pressable
                  onPress={onClose}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                  }}
                >
                  <Text
                    fontSize={14}
                    fontWeight="500"
                    color="textSecondary"
                    fontFamily="Poppins-Medium"
                    textAlign="center"
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  style={{
                    flex: 1,
                    backgroundColor: "#A20538",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    fontSize={14}
                    fontWeight="500"
                    color="textOnPrimary"
                    fontFamily="Poppins-Medium"
                    textAlign="center"
                  >
                    Log out
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
