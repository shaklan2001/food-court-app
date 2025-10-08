import { RootState, useAppSelector } from "@/src/store/store";
import { NotificationIcon, ShoppingCartIcon, WalletIcon } from "@/src/utils/Svgs";
import { pageHorizantalPadding } from "@/src/utils/commomCompute";
import { router } from "expo-router";
import { memo } from "react";
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
    const { user } = useAppSelector((state: RootState) => state.auth);

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
                    <Card notification={true}>
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