import { Tabs } from 'expo-router';
import { Users, Clock, ShieldCheck, Briefcase, CalendarDays } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform } from 'react-native';

export default function StaffManagementLayout() {
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
          title: 'Directory',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="governance"
        options={{
          title: 'Governance',
          tabBarIcon: ({ color, size }) => (
            <ShieldCheck size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="careers"
        options={{
          title: 'Careers',
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen
        name="attendance/reports"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="governance/documents"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
