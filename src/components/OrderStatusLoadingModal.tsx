import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Modal, StyleSheet } from 'react-native';
import { Text, View } from './ui';

interface OrderStatusLoadingModalProps {
  visible: boolean;
  status?: string;
}

const OrderStatusLoadingModal: React.FC<OrderStatusLoadingModalProps> = ({
  visible,
  status = "pending",
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

  const getStatusText = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'Order Accepted';
      case 'preparing':
        return 'Order Accepted! Preparing payment...';
      case 'pending':
        return 'Waiting for Order Acceptance...';
      case 'cancelled':
        return 'Order Cancelled';
      default:
        return 'Checking Order Status...';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View
        flex={1}
        style={styles.overlay}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="l"
      >
        <View
          backgroundColor="mainBackground"
          borderRadius="l"
          padding="xl"
          alignItems="center"
          minWidth={300}
          maxWidth={350}
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
              <ActivityIndicator size="large" color="#A20538" style={{ marginBottom: 20 }} />
              
              <Text
                fontSize={18}
                fontWeight="600"
                color="textPrimary"
                fontFamily="Poppins-SemiBold"
                textAlign="center"
                marginBottom="s"
              >
                Processing Order
              </Text>

              <Text
                fontSize={14}
                fontWeight="400"
                color="textSecondary"
                fontFamily="Poppins-Regular"
                textAlign="center"
                lineHeight={20}
              >
                {getStatusText()}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default OrderStatusLoadingModal;

