import { betterwayApiCall } from "@/src/network/useApiPort";
import { RootState, useAppSelector } from "@/src/store/store";
import { NotificationIcon, ShoppingCartIcon, WalletIcon } from "@/src/utils/Svgs";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, Pressable, TouchableOpacity } from "react-native";
import { View } from "../ui";
import { Card } from "./Card";


const ProfileIcon = memo((user: any) => {
    return (
        <Pressable onPress={() => router.push('/profile/')}>
            <View overflow="hidden" width={54} height={54} backgroundColor="mainBackground" borderRadius="m" borderWidth={1} borderColor="border" justifyContent="center" alignItems="center" position="relative" >
                <Image source={user?.user?.image ? { uri: user?.user?.image } : require('@/assets/images/profile.jpg')} style={{ width: 54, height: 54 }} />
            </View>
        </Pressable>
    );
});

ProfileIcon.displayName = 'ProfileIcon';

const Header = memo(() => {
    const cartItemCount = useAppSelector((state: RootState) => state.cart.itemCount);
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [hasNotifications, setHasNotifications] = useState(false);

    const fetchNotificationCount = useCallback(async () => {
        if (!token) {
            setHasNotifications(false);
            return;
        }

        try {
            const response = await betterwayApiCall({
                method: "GET",
                url: "GET_NOTIFICATIONS",
                auth: token,
            });

            const notifications = response?.data?.success && Array.isArray(response.data.notifications)
                ? response.data.notifications
                : Array.isArray(response?.data)
                ? response.data
                : [];

            setHasNotifications(notifications.length > 0);
        } catch {
            // Silently fail - don't show error for notification count check
            setHasNotifications(false);
        }
    }, [token]);

    useEffect(() => {
        fetchNotificationCount();
        const interval = setInterval(fetchNotificationCount, 30000);
        return () => clearInterval(interval);
    }, [fetchNotificationCount]);

    return (
        <View flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal={pageHorizantalPadding} mb='s'>
            <View>
                <View flexDirection="row" alignItems="center" gap="s">
                    <ProfileIcon user={user} />
                    <TouchableOpacity onPress={() => router.push('/wallet')}>
                        <Card notification={false}>
                            <WalletIcon />
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
            <View flexDirection="row" alignItems="center" gap="s">
                <TouchableOpacity onPress={() => router.push('/notifications')}>
                    <Card notification={hasNotifications}>
                        <NotificationIcon />
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cart')}>
                    <Card notification={cartItemCount > 0}>
                        <ShoppingCartIcon />
                    </Card>
                </TouchableOpacity>
            </View>
        </View>
    );
});

Header.displayName = 'Header';

export default Header;