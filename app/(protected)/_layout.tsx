import React from 'react';
import { Drawer } from 'expo-router/drawer';
import {
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import {
  LayoutDashboard,
  LogOut,
  User,
  Settings,
  X,
  Menu,
  ChevronRight,
  Briefcase,
  Users,
  Truck,
  Box
} from 'lucide-react-native';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
        {/* Header Section */}
        <View className="bg-[#003399] p-6 pb-8 pt-12">
          <View className="flex-row items-center space-x-4 mb-4">
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/30">
              <User size={32} color="#fff" strokeWidth={1.5} />
            </View>
            <View className="ml-4">
              <Text className="text-white font-bold text-xl leading-tight">
                {user?.staff?.first_name || 'User'} {user?.staff?.surname || ''}
              </Text>
              <Text className="text-white/70 text-sm font-medium">
                {user?.staff?.designation || 'Staff Member'}
              </Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-xl p-3 mt-2">
            <Text className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
              Department
            </Text>
            <Text className="text-white font-semibold">
              {user?.staff?.department?.name || 'Operations'}
            </Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View className="mt-4 px-2">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <SafeAreaView className="border-t border-slate-100 dark:border-slate-800 p-4">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl active:bg-slate-100 dark:active:bg-slate-800"
        >
          <View className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 items-center justify-center">
            <LogOut size={20} color="#ef4444" strokeWidth={2.5} />
          </View>
          <Text className="ml-3 text-slate-700 dark:text-slate-200 font-bold">Log Out</Text>
          <View className="flex-1" />
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>

        <Text className="text-center text-slate-400 dark:text-slate-600 text-[10px] mt-4 font-medium uppercase tracking-widest">
          Isokariari v3.0.0
        </Text>
      </SafeAreaView>
    </View>
  );
}

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: isDark ? '#0f172a' : '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1e293b' : '#f1f5f9',
          },
          headerTitleStyle: {
            fontSize: 14,
            fontWeight: '900',
            color: isDark ? '#fff' : '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          headerTintColor: isDark ? '#60a5fa' : '#003399',
          drawerActiveTintColor: isDark ? '#60a5fa' : '#003399',
          drawerActiveBackgroundColor: isDark ? '#1e293b' : '#f0f4ff',
          drawerInactiveTintColor: isDark ? '#64748b' : '#64748b',
          drawerStyle: {
            backgroundColor: isDark ? '#0f172a' : '#fff',
            width: 280,
          },
          drawerLabelStyle: {
            fontWeight: '700',
            marginLeft: -10,
          },
          drawerItemStyle: {
            borderRadius: 12,
            paddingHorizontal: 8,
            marginVertical: 4,
          }
        }}
      >
        <Drawer.Screen
          name="(staff)"
          options={{
            drawerLabel: 'My Workspace',
            headerTitle: 'OKI APP',
            drawerIcon: ({ color, size }) => (
              <Briefcase size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Drawer.Screen
          name="(staff-management)"
          options={{
            drawerLabel: 'Staff Management',
            headerTitle: 'MANAGEMENT',
            drawerIcon: ({ color, size }) => (
              <Users size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Drawer.Screen
          name="(fleet)"
          options={{
            drawerLabel: 'Fleet Management',
            headerTitle: 'FLEET',
            drawerIcon: ({ color, size }) => (
              <Truck size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Drawer.Screen
          name="(cmms)"
          options={{
            drawerLabel: 'CMMS',
            headerTitle: 'MAINTENANCE',
            drawerIcon: ({ color, size }) => (
              <Box size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            headerTitle: 'SETTINGS',
            drawerIcon: ({ color, size }) => (
              <Settings size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
