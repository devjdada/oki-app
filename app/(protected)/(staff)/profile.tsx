import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Shield, 
  ChevronRight,
  Building2,
  Bell,
  Settings
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppButton from '../../../components/AppButton';
import { useAuthStore } from '../../../store/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-[#003399] dark:bg-blue-900 px-8 pt-12 pb-16 rounded-b-[60px] relative overflow-hidden">
          <View className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full" />
          
          <View className="items-center">
            <View className="w-24 h-24 rounded-[32px] bg-white dark:bg-slate-800 p-1 mb-4 shadow-2xl">
              <View className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-[28px] items-center justify-center overflow-hidden">
                <User size={48} color={isDark ? '#60a5fa' : '#003399'} />
              </View>
            </View>
            
            <Text className="text-2xl font-black text-white tracking-tight">
              {user?.staff?.first_name} {user?.staff?.surname || user?.name}
            </Text>
            <Text className="text-blue-100 dark:text-blue-200 font-bold uppercase tracking-[2px] text-[10px] mt-1">
              {user?.staff?.designation || 'Staff'}
            </Text>
          </View>
        </View>

        <View className="px-8 -mt-8">
           {/* Info Cards */}
            <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-xl shadow-slate-200 dark:shadow-none border border-slate-50 dark:border-slate-800 flex-row justify-between mb-10">
              <InfoItem label="Department" value={user?.staff?.department?.name || 'N/A'} icon={<Building2 size={16} color={isDark ? '#60a5fa' : '#003399'} />} />
              <View className="w-[1px] h-full bg-slate-100 dark:bg-slate-800" />
              <InfoItem label="Staff ID" value={`#${user?.staff?.id || '000'}`} icon={<Shield size={16} color={isDark ? '#60a5fa' : '#003399'} />} />
            </View>

           <SectionHeader title="Personal Information" />
           <View className="space-y-4 gap-4 mb-10">
              <DetailRow label="Email Address" value={user?.email || 'N/A'} icon={<Mail size={20} color="#64748b" />} isDark={isDark} />
              <DetailRow label="Phone Number" value={user?.staff?.phone || 'Not set'} icon={<Phone size={20} color="#64748b" />} isDark={isDark} />
              <DetailRow label="Office Address" value={user?.staff?.address || 'Main Office'} icon={<MapPin size={20} color="#64748b" />} isDark={isDark} />
           </View>

           <SectionHeader title="App Settings" />
           <View className="space-y-4 gap-4 mb-10">
              <MenuRow 
                title="Appearance" 
                subtitle="Theme and visual settings" 
                icon={<Settings size={20} color="#64748b" />} 
                onPress={() => router.push('/(protected)/settings/appearance')}
              />
              <MenuRow 
                title="Security & Privacy" 
                subtitle="Password and data" 
                icon={<Shield size={20} color="#64748b" />} 
                onPress={() => router.push('/(protected)/settings/security')}
              />
           </View>

           <AppButton 
            title="Sign Out" 
            onPress={handleLogout} 
            variant="secondary" 
            icon={<LogOut size={18} color="#ef4444" />}
            className="mb-12 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10"
            textClassName="text-[#ef4444]"
            loading={loading}
           />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <View className="items-center flex-1">
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{label}</Text>
      </View>
      <Text className="text-sm font-black text-slate-900 dark:text-white">{value}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-5 px-1">
      <Text className="text-[10px] font-black text-[#003399] dark:text-blue-500 uppercase tracking-widest">{title}</Text>
    </View>
  );
}

function DetailRow({ label, value, icon, isDark }: any) {
  return (
    <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
      <View className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center mr-4 border border-slate-100 dark:border-slate-700 shadow-sm">
        {icon}
      </View>
      <View>
        <Text className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{label}</Text>
        <Text className="text-sm font-bold text-slate-900 dark:text-white">{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({ title, subtitle, icon, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 items-center justify-center mr-4 border border-slate-100 dark:border-slate-800 shadow-sm">
          {icon}
        </View>
        <View>
          <Text className="text-sm font-black text-slate-900 dark:text-white">{title}</Text>
          <Text className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#94a3b8" />
    </TouchableOpacity>
  );
}
