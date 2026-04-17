import { Tabs } from 'expo-router';
import { Calendar, ClipboardList, LayoutDashboard, MessageSquare, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform } from 'react-native';

export default function StaffLayout() {
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
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: 'Work Orders',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen
        name="messages/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="messages/compose"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
