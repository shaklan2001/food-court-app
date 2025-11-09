import { useAppSelector } from '@/src/store/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from 'react-native-svg';
import { AuthGuard } from '../../components/AuthGuard';
import FloatingCart from '../../components/FloatingCart';

type TabIconProps = {
    isFocused: boolean;
};

const HomeIcon = ({ isFocused }: TabIconProps) => {
    const fill = isFocused ? "#A20538" : "#808080";
    return (
        <Svg
            width={32}
            height={32}
            viewBox="0 0 33 33"
            fill="none"
        >
            <Path
                d="M28.2734 11.1799L19.54 4.19319C17.8334 2.8332 15.1667 2.81986 13.4734 4.17986L4.74003 11.1799C3.4867 12.1799 2.7267 14.1799 2.99337 15.7532L4.67337 25.8065C5.06003 28.0599 7.15337 29.8332 9.43336 29.8332H23.5667C25.82 29.8332 27.9534 28.0199 28.34 25.7932L30.02 15.7399C30.26 14.1799 29.5 12.1799 28.2734 11.1799ZM17.5 24.4999C17.5 25.0465 17.0467 25.4999 16.5 25.4999C15.9534 25.4999 15.5 25.0465 15.5 24.4999V20.4999C15.5 19.9532 15.9534 19.4999 16.5 19.4999C17.0467 19.4999 17.5 19.9532 17.5 20.4999V24.4999Z"
                fill={fill}
            />
        </Svg>
    );
};

const MenuIcon = ({ isFocused }: TabIconProps) => {
    const fill = isFocused ? "#A20538" : "#808080";
    return (
        <Svg
            width={26}
            height={27}
            viewBox="0 0 24 25"
            fill="none"
        >
            <Path
                d="M16.19 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.68C2 20.33 4.17 22.5 7.81 22.5H16.18C19.82 22.5 21.99 20.33 21.99 16.69V8.31C22 4.67 19.83 2.5 16.19 2.5ZM17 17.75H7C6.59 17.75 6.25 17.41 6.25 17C6.25 16.59 6.59 16.25 7 16.25H17C17.41 16.25 17.75 16.59 17.75 17C17.75 17.41 17.41 17.75 17 17.75ZM17 13.25H7C6.59 13.25 6.25 12.91 6.25 12.5C6.25 12.09 6.59 11.75 7 11.75H17C17.41 11.75 17.75 12.09 17.75 12.5C17.75 12.91 17.41 13.25 17 13.25ZM17 8.75H7C6.59 8.75 6.25 8.41 6.25 8C6.25 7.59 6.59 7.25 7 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z"
                fill={fill}
            />
        </Svg>
    );
};

const OrdersIcon = ({ isFocused }: TabIconProps) => {
    const fill = isFocused ? "#A20538" : "#808080";
    return (
        <Svg
            width={26}
            height={27}
            viewBox="0 0 24 25"
            fill="none"
        >
            <Path
                d="M16 9.25C15.59 9.25 15.25 8.91 15.25 8.5V5C15.25 3.92 14.58 3.25 13.5 3.25H10.5C9.42 3.25 8.75 3.92 8.75 5V8.5C8.75 8.91 8.41 9.25 8 9.25C7.59 9.25 7.25 8.91 7.25 8.5V5C7.25 3.09 8.59 1.75 10.5 1.75H13.5C15.41 1.75 16.75 3.09 16.75 5V8.5C16.75 8.91 16.41 9.25 16 9.25Z"
                fill={fill}
            />
            <Path
                d="M7.99997 18.28C7.58997 18.28 7.24997 17.94 7.24997 17.53C7.24997 17.11 7.58997 16.78 7.99997 16.78H19.76C20.06 16.78 20.29 16.52 20.26 16.22L19.58 10.53C19.34 8.59 19 7 15.6 7H8.39997C4.99997 7 4.65997 8.59 4.42997 10.53L3.52997 18.03C3.23997 20.49 3.99997 22.5 7.50997 22.5H16.49C19.65 22.5 20.58 20.87 20.53 18.75C20.52 18.48 20.3 18.28 20.03 18.28H7.99997Z"
                fill={fill}
            />
        </Svg>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTabButton = (props: any) => {
    const { onPress, style, children, ...rest } = props;
    const handlePress = () => {
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        }
        if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            {...rest}
            onPress={handlePress}
            activeOpacity={1}
            style={[style, { overflow: 'hidden' }]}
        >
            {children}
        </TouchableOpacity>
    );
};

function TabsLayout() {
    const insets = useSafeAreaInsets();
    const customizationVisible = useAppSelector((state) => state.ui.customizationVisible);
    const userRole = useAppSelector((state) => state.auth.user?.role);
    const isAdmin = (userRole ?? '').toLowerCase() === 'admin';
    return (
        <AuthGuard>
            <Tabs
                initialRouteName="(home)"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        ...styles.tabBar,
                        paddingBottom: insets.bottom,
                        height: 70 + insets.bottom,
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 0,
                        borderTopColor: 'transparent',
                        elevation: 8,
                        shadowOpacity: 0.15,
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: -8 },
                        shadowRadius: 12,
                    },
                    tabBarItemStyle: {
                        backgroundColor: 'transparent',
                    },
                    tabBarLabelStyle: styles.titleStyle,
                    tabBarIconStyle: styles.icon,
                    tabBarActiveTintColor: '#A20538',
                    tabBarInactiveTintColor: '#808080',
                    tabBarButton: (props) => <CustomTabButton {...props} />,
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        tabBarLabel: "Home",
                        title: "Home",
                        tabBarIcon: ({ focused }) => (
                            <HomeIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: true,
                    }}
                />
                <Tabs.Screen
                    name="menu"
                    options={{
                        tabBarLabel: "Menu",
                        title: "Menu",
                        tabBarIcon: ({ focused }) => (
                            <MenuIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: true,
                    }}
                />
                <Tabs.Screen
                    name="order-later"
                    options={{
                        tabBarLabel: "Orders Later",
                        title: "Orders Later",
                        tabBarIcon: ({ focused }) => (
                            <OrdersIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: true,
                    }}
                />
                <Tabs.Screen
                    name="admin"
                    options={{
                        tabBarLabel: "Admin",
                        title: "Admin",
                        tabBarButton: isAdmin ? undefined : () => null,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons name="admin-panel-settings" size={24} color={focused ? "#A20538" : "#808080"} />
                        ),
                        tabBarShowLabel: true,
                    }}
                />
            </Tabs>
            {!customizationVisible && <FloatingCart bottomOffset={70} />}
        </AuthGuard>
    );
}

export default TabsLayout;

const styles = StyleSheet.create({
    titleStyle: {
        letterSpacing: 0.02,
        width: '100%',
        marginBottom: Platform.OS === 'android' ? 10 : 2,
    },
    icon: {
        marginTop: 10,
    },
    tabBar: {
        height: 60,
    },
});