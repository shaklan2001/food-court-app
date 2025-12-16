import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Card } from "../components/HomePage/Card";
import { Text, View } from "../components/ui";
import { betterwayApiCall } from "../network/useApiPort";
import { RootState, useAppSelector } from "../store/store";
import { showToast } from "../utils";
import { pageHorizantalPadding } from "../utils/commomCompute";
import { BackIcon } from "../utils/Svgs";

const BagIcon = ({ size = 24, color = "#2DCA15" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16.9275 6.08992C17.0291 5.94217 17.3903 5.44642 17.4938 5.29492H13.905L11.5875 8.54242C11.0651 9.14992 11.2669 10.4714 11.2313 11.2049C11.2313 11.4559 11.1318 11.6966 10.9547 11.8745C10.7776 12.0523 10.5372 12.1527 10.2863 12.1537H7.99877C7.7478 12.1527 7.50744 12.0523 7.33033 11.8745C7.15321 11.6966 7.05377 11.4559 7.05377 11.2049V9.65242C7.05323 9.09834 7.22634 8.55802 7.54877 8.10742L9.55877 5.29492H5.97002L3.96377 8.10742C3.63973 8.55721 3.46644 9.09807 3.46877 9.65242V20.8874C3.46937 21.3149 3.63945 21.7247 3.94172 22.027C4.24399 22.3292 4.65379 22.4993 5.08127 22.4999H13.2075C13.6349 22.4988 14.0444 22.3286 14.3465 22.0264C14.6487 21.7243 14.8189 21.3147 14.82 20.8874V9.65242C14.8195 9.25423 14.9442 8.86595 15.1763 8.54242L16.9275 6.08992Z" fill={color}/>
    <Path d="M7.804 9.6525V11.205C7.80419 11.257 7.82467 11.3069 7.8611 11.344C7.89752 11.3811 7.94701 11.4026 7.999 11.4037H10.2865C10.3124 11.4035 10.3379 11.3982 10.3617 11.388C10.3855 11.3779 10.4071 11.3632 10.4252 11.3448C10.4433 11.3263 10.4576 11.3045 10.4672 11.2805C10.4769 11.2565 10.4818 11.2309 10.4815 11.205V9.6525C10.481 9.09842 10.6541 8.5581 10.9765 8.1075L12.9865 5.295H10.4778L8.16025 8.5425C7.92813 8.86603 7.80351 9.25431 7.804 9.6525ZM20.0365 8.1075L18.4278 5.85375V9.94125C18.4278 10.0407 18.3882 10.1361 18.3179 10.2064C18.2476 10.2767 18.1522 10.3162 18.0528 10.3162C17.9533 10.3162 17.8579 10.2767 17.7876 10.2064C17.7173 10.1361 17.6778 10.0407 17.6778 9.94125V6.33L16.1778 8.43L15.7878 8.9775C15.6463 9.17611 15.5702 9.4139 15.5703 9.65775V20.8875C15.572 21.3371 15.443 21.7774 15.199 22.155C15.1221 22.2777 15.0343 22.3932 14.9365 22.5H18.919C19.3467 22.5 19.7568 22.3301 20.0592 22.0277C20.3616 21.7253 20.5315 21.3152 20.5315 20.8875V9.6525C20.5338 9.09814 20.3605 8.55729 20.0365 8.1075ZM17.6778 2.445C17.6768 2.19403 17.5764 1.95367 17.3985 1.77656C17.2207 1.59944 16.98 1.5 16.729 1.5H7.2715C7.02053 1.5 6.77978 1.59944 6.60196 1.77656C6.42414 1.95367 6.32375 2.19403 6.32275 2.445V4.545H17.6778V2.445Z" fill={color}/>
  </Svg>
);

const TagIcon = ({ size = 24, color = "#CAB515" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M18.3728 9.86216C18.3107 10.1303 18.2093 10.3877 18.0718 10.6262L12.5548 20.1802L12.8948 20.7702C13.1654 21.2384 13.6109 21.58 14.1333 21.7199C14.6558 21.8598 15.2124 21.7865 15.6808 21.5162L20.9808 18.4562C21.4488 18.1855 21.7902 17.7402 21.9301 17.218C22.0699 16.6958 21.9968 16.1395 21.7268 15.6712L18.3728 9.86216ZM17.2218 8.45016C17.3429 8.95727 17.2652 9.4915 17.0048 9.94316L11.4348 19.5922C11.3009 19.8242 11.1225 20.0276 10.91 20.1908C10.6974 20.3539 10.4548 20.4736 10.196 20.543C9.93721 20.6123 9.66727 20.63 9.40162 20.5951C9.13597 20.5601 8.87981 20.4731 8.64778 20.3392L3.34878 17.2792C2.88053 17.0085 2.53891 16.563 2.39902 16.0406C2.25913 15.5182 2.33242 14.9616 2.60278 14.4932L8.17278 4.84516C8.43375 4.39286 8.85822 4.05787 9.35878 3.90916L13.6228 2.64216C13.8884 2.56321 14.1673 2.53921 14.4425 2.57162C14.7177 2.60403 14.9835 2.69216 15.2235 2.83066C15.4635 2.96915 15.6728 3.15509 15.8386 3.37714C16.0044 3.59918 16.1232 3.85268 16.1878 4.12216L17.2218 8.45016ZM14.5298 6.07116C14.4646 6.19056 14.3762 6.29573 14.2698 6.38047C14.1634 6.46521 14.0411 6.52781 13.9102 6.56458C13.7792 6.60135 13.6422 6.61156 13.5072 6.5946C13.3723 6.57764 13.2421 6.53385 13.1243 6.46582C13.0065 6.39779 12.9035 6.30688 12.8213 6.19845C12.7392 6.09001 12.6796 5.96625 12.646 5.83443C12.6124 5.70261 12.6055 5.56541 12.6258 5.43089C12.646 5.29638 12.6929 5.16727 12.7638 5.05116C12.9025 4.8239 13.1245 4.65989 13.3825 4.59415C13.6405 4.5284 13.914 4.56614 14.1446 4.6993C14.3751 4.83246 14.5445 5.05049 14.6164 5.30681C14.6884 5.56314 14.6573 5.83745 14.5298 6.07116ZM6.58978 12.3832C6.67978 12.7072 6.88778 12.9632 7.21578 13.1532C7.54278 13.3412 7.86878 13.3932 8.19478 13.3092C8.51978 13.2252 8.78478 13.0042 8.99178 12.6472C9.12978 12.4072 9.20178 12.1742 9.20478 11.9462C9.21069 11.7249 9.15045 11.507 9.03178 11.3202C8.90995 11.1268 8.74145 10.9673 8.54178 10.8562C8.34333 10.7376 8.11868 10.6699 7.88778 10.6592C7.66778 10.6532 7.46078 10.7092 7.26478 10.8262C7.06878 10.9432 6.90278 11.1222 6.76478 11.3612C6.55878 11.7182 6.49978 12.0592 6.58978 12.3832ZM11.1858 12.4612C11.1186 12.4224 11.043 12.4006 10.9655 12.3974C10.888 12.3943 10.8109 12.41 10.7408 12.4432L6.55678 14.4132C6.44154 14.4674 6.35257 14.5652 6.30944 14.685C6.2663 14.8049 6.27254 14.9369 6.32678 15.0522C6.38101 15.1674 6.47881 15.2564 6.59864 15.2995C6.71848 15.3426 6.85054 15.3364 6.96578 15.2822L11.1498 13.3112C11.2291 13.2739 11.2967 13.2156 11.3453 13.1426C11.3938 13.0696 11.4215 12.9846 11.4252 12.8971C11.4289 12.8095 11.4085 12.7225 11.3663 12.6457C11.3241 12.5688 11.2617 12.505 11.1858 12.4612ZM7.83578 12.5062C7.74278 12.5562 7.65878 12.5602 7.58278 12.5162C7.50678 12.4722 7.46578 12.3962 7.45878 12.2882C7.45878 12.1782 7.51078 12.0332 7.61478 11.8522C7.71878 11.6722 7.81778 11.5562 7.91078 11.5052C8.01078 11.4522 8.09778 11.4482 8.17378 11.4922C8.24978 11.5362 8.28778 11.6122 8.28778 11.7222C8.29478 11.8322 8.24578 11.9762 8.14178 12.1562C8.03778 12.3362 7.93578 12.4532 7.83578 12.5062ZM8.53978 16.1002C8.62978 16.4242 8.83778 16.6802 9.16478 16.8702C9.49278 17.0582 9.81878 17.1102 10.1448 17.0272C10.4698 16.9422 10.7348 16.7222 10.9418 16.3642C11.0798 16.1242 11.1518 15.8912 11.1548 15.6642C11.1609 15.4426 11.1006 15.2242 10.9818 15.0372C10.8599 14.8439 10.6914 14.6843 10.4918 14.5732C10.2932 14.455 10.0686 14.3877 9.83778 14.3772C9.61778 14.3702 9.41078 14.4262 9.21478 14.5432C9.01878 14.6602 8.85278 14.8392 8.71478 15.0782C8.50778 15.4362 8.44978 15.7762 8.53978 16.1002ZM9.78578 16.2232C9.69278 16.2732 9.60778 16.2772 9.53178 16.2332C9.45678 16.1902 9.41478 16.1132 9.40878 16.0052C9.40878 15.8952 9.46078 15.7502 9.56478 15.5692C9.66878 15.3892 9.76778 15.2732 9.86078 15.2222C9.96078 15.1702 10.0478 15.1652 10.1238 15.2092C10.1998 15.2532 10.2378 15.3292 10.2378 15.4392C10.2448 15.5492 10.1958 15.6932 10.0918 15.8732C9.98678 16.0542 9.88578 16.1712 9.78578 16.2232Z" fill={color}/>
  </Svg>
);

const SpeakerIcon = ({ size = 24, color = "#A20538" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 22" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M15.9701 6.01725C16.4116 6.13542 16.7796 6.41653 17.006 6.80883C17.443 7.56581 17.2311 8.52216 16.5448 9.03033L14.8511 6.09745C15.2018 5.94534 15.5923 5.916 15.9701 6.0172V6.01725ZM5.41251 17.0937L7.77595 15.7293L4.66228 10.3437L2.30222 11.7066C1.58634 12.1199 1.07315 12.791 0.857574 13.5961C0.641527 14.4015 0.750231 15.2394 1.16353 15.955C1.73929 16.9518 2.7869 17.5097 3.86273 17.5097C4.38993 17.5097 4.92393 17.3757 5.41251 17.0937ZM10.3432 20.1832L8.35847 16.746L6.50597 17.8155L8.49023 21.2529C8.78559 21.7636 9.4409 21.9392 9.95184 21.6443C10.1975 21.5025 10.3737 21.2715 10.4483 20.9945C10.5224 20.7172 10.4851 20.4293 10.3432 20.1833V20.1832ZM17.7236 13.416L11.6426 2.88375C11.516 2.66409 11.3079 2.54367 11.0562 2.54367C11.0514 2.54367 11.0465 2.54391 11.0417 2.54391C10.7835 2.54864 10.5744 2.67699 10.4533 2.90545C10.2396 3.30881 10.0335 3.73927 9.81539 4.19508C8.89772 6.11175 7.86595 8.26641 5.66747 9.74039L8.80054 15.1608C11.1739 13.9957 13.5552 14.1792 15.6728 14.3428C16.1774 14.3819 16.6535 14.4185 17.1102 14.4352C17.369 14.4451 17.5841 14.3281 17.7172 14.1067C17.8507 13.8852 17.8528 13.6398 17.7238 13.4161L17.7236 13.416ZM16.1949 2.60175C16.0334 2.88197 16.1294 3.24033 16.4096 3.40214C16.4984 3.45371 16.5992 3.48085 16.7018 3.4808C16.9042 3.4808 17.1015 3.3757 17.2098 3.18774L18.4203 1.09186C18.5819 0.811642 18.4859 0.453283 18.2056 0.29147C17.9252 0.129704 17.5671 0.225704 17.4055 0.505923L16.1949 2.60175ZM23.2507 9.02836C23.2507 8.70502 22.9885 8.44242 22.6631 8.44242L20.2437 8.44266C19.9203 8.44266 19.6577 8.70502 19.6577 9.02859C19.6577 9.35217 19.9203 9.61453 20.2437 9.61453L22.6631 9.6143C22.9885 9.6143 23.2507 9.35217 23.2507 9.02836ZM21.8496 4.01227C21.6869 3.73205 21.3299 3.63605 21.0497 3.79781L18.9025 5.03705C18.6221 5.19909 18.5261 5.55722 18.6878 5.83767C18.7263 5.90434 18.7775 5.96277 18.8386 6.00963C18.8997 6.05649 18.9694 6.09086 19.0437 6.11077C19.1181 6.13069 19.1956 6.13576 19.2719 6.1257C19.3482 6.11563 19.4218 6.09063 19.4885 6.05213L21.635 4.81266C21.9152 4.65085 22.0123 4.29249 21.8496 4.01227Z" fill={color}/>
  </Svg>
);

const NotificationsHeader = memo(({ onClearAll }: { onClearAll: () => void }) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={pageHorizantalPadding}
      paddingBottom="l"
      backgroundColor="mainBackgroundLight"
    >
      <TouchableOpacity onPress={() => {router.back();}}>
        <Card>
          <BackIcon />
        </Card>
      </TouchableOpacity>

      <Text
        fontSize={22}
        fontWeight="bold"
        color="textPrimary"
        fontFamily="Poppins-Bold"
        lineHeight={30}
      >
        Notifications
      </Text>

      <TouchableOpacity onPress={onClearAll}>
        <Text
          fontSize={14}
          color="red"
          fontFamily="Poppins-SemiBold"
        >
          Clear all
        </Text>
      </TouchableOpacity>
    </View>
  );
});

NotificationsHeader.displayName = 'NotificationsHeader';

const NotificationItem = memo(({ 
  icon, 
  title, 
  description, 
  onPress, 
  onDelete,
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onPress: () => void;
  onDelete: () => void;
}) => {
  const renderRightActions = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
          width: 80,
        }}
      >
        <TouchableOpacity
          onPress={onDelete}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#000000" />
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              fontFamily: 'Poppins-Medium',
              marginTop: 4,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View 
          flexDirection="row" 
          alignItems="center" 
          paddingVertical="m" 
          paddingHorizontal="m" 
          backgroundColor="mainBackground" 
          borderRadius="m" 
          marginBottom="m" 
          borderBottomWidth={1} 
          borderBottomColor="border"
        >
          <View 
            width={40}
            height={40}
            borderRadius="xxl"
            backgroundColor="cardSecondaryBackground"
            alignItems="center"
            justifyContent="center"
            marginRight="m"
          >
            {icon}
          </View>
          <View flex={1}>
            <Text 
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#000000',
                marginBottom: 4,
                fontFamily: 'Poppins-Medium',
                lineHeight: 16,
              }}
            >
              {title}
            </Text>
            <Text 
              style={{
                fontSize: 12,
                color: '#6B7280',
                fontFamily: 'Poppins-Regular',
                lineHeight: 16,
              }}
            >
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
});

NotificationItem.displayName = 'NotificationItem';

type Notification = {
  id: number;
  userId: string;
  notificationType: 'offer' | 'order_update' | string;
  notificationContent: string;
  createdAt: string;
  updatedAt: string;
};

const getNotificationIcon = (notificationType: string) => {
  switch (notificationType) {
    case 'order_update':
      return <BagIcon size={24} color="#2DCA15" />;
    case 'offer':
      return <TagIcon size={24} color="#CAB515" />;
    default:
      return <SpeakerIcon size={24} color="#A20538" />;
  }
};

const Notifications = () => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await betterwayApiCall({
        method: "GET",
        url: "GET_NOTIFICATIONS",
        auth: token,
      });

      if (response?.data?.success && Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else if (Array.isArray(response?.data)) {
        setNotifications(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Failed to fetch notifications';
      showToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDeleteNotification = useCallback(async (notificationId: number) => {
    if (!token) {
      showToast({
        message: 'Please login to delete notifications',
        type: 'error',
      });
      return;
    }

    try {
      // API endpoint is /api/inappnotif/{id}
      const endpoint = `/api/inappnotif/${notificationId}`;
      await betterwayApiCall({
        method: "DELETE",
        url: endpoint,
        auth: token,
      });

      // Remove notification from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      showToast({
        message: 'Notification deleted',
        type: 'success',
      });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Failed to delete notification';
      showToast({
        message: errorMessage,
        type: 'error',
      });
    }
  }, [token]);

  const handleClearAll = () => {
    // TODO: Implement clear all API call
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View flex={1} backgroundColor="mainBackgroundLight">
        <NotificationsHeader onClearAll={handleClearAll} />

        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }} 
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#A20538" />
            </View>
          ) : notifications.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text 
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontFamily: 'Poppins-Regular',
                }}
              >
                No notifications yet
              </Text>
            </View>
          ) : (
            <View style={{ marginBottom: 24 }}>
              <Text 
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: 16,
                  fontFamily: 'Poppins-SemiBold',
                }}
              >
                Notifications
              </Text>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  icon={getNotificationIcon(notification.notificationType)}
                  title={
                    notification.notificationType === 'order_update'
                      ? 'Order Update'
                      : notification.notificationType === 'offer'
                      ? 'Special Offer'
                      : 'Notification'
                  }
                  description={notification.notificationContent}
                  onPress={() => {
                    // Handle notification press if needed
                  }}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
      </SafeAreaView>
    </>
  ); 
};

export default Notifications;