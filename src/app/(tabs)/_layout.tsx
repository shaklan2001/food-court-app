import { Icon } from '@/src/components/ui/Icon';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme.web';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const BlurTabBarBackground = () => {
  return Platform.OS === 'ios' ? (
    <BlurView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      intensity={50}
    />
  ) : null;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon
              set="Ionicons"
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Icon
              set="Ionicons"
              name="compass"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}