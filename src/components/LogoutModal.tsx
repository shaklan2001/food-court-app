import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Modal, Pressable } from 'react-native';
import { betterwayApiCall } from '../network/useApiPort';
import { logout } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { Text, View } from './ui';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

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

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (token) {
        await betterwayApiCall({
          method: 'POST',
          url: 'SIGN_OUT',
          auth: token,
        });
      }
      dispatch(logout());
      onConfirm();
    } catch {
      dispatch(logout());
      onConfirm();
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, token, onConfirm, isLoggingOut]);

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
          maxWidth={"90%"}
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
                fontSize={16}
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
                  disabled={isLoggingOut}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    opacity: isLoggingOut ? 0.5 : 1,
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
                  onPress={handleLogout}
                  disabled={isLoggingOut}
                  style={{
                    flex: 1,
                    backgroundColor: isLoggingOut ? "#A2053880" : "#A20538",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    marginLeft: 8,
                    opacity: isLoggingOut ? 0.7 : 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {isLoggingOut ? (
                    <>
                      <ActivityIndicator 
                        size="small" 
                        color="#FFFFFF" 
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        fontSize={14}
                        fontWeight="500"
                        color="textOnPrimary"
                        fontFamily="Poppins-Medium"
                        textAlign="center"
                      >
                        Logging out...
                      </Text>
                    </>
                  ) : (
                    <Text
                      fontSize={14}
                      fontWeight="500"
                      color="textOnPrimary"
                      fontFamily="Poppins-Medium"
                      textAlign="center"
                    >
                      Log out
                    </Text>
                  )}
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
