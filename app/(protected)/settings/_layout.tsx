import { Tabs } from 'expo-router';
import { AlertTriangle, Palette, Shield, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#60a5fa' : '#003399',
        tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1e293b' : '#f1f5f9',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Security',
          tabBarIcon: ({ color, size }) => (
            <Shield size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="appearance"
        options={{
          title: 'Appearance',
          tabBarIcon: ({ color, size }) => (
            <Palette size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="danger"
        options={{
          title: 'Danger',
          tabBarIcon: ({ color, size }) => (
            <AlertTriangle size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}
