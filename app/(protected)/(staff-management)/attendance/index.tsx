import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Clock, Calendar, ChevronRight, FileText, CheckCircle2, AlertCircle, Play, Square } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function AttendanceScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white dark:bg-slate-900 px-8 pt-8 pb-10 border-b border-slate-100 dark:border-slate-800 rounded-b-[40px] shadow-sm">
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Attendance</Text>
              <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Live Tracking</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(protected)/(staff-management)/attendance/reports')}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 rounded-xl flex-row items-center border border-slate-800 dark:border-slate-700"
            >
              <FileText size={16} color="white" />
              <Text className="text-white text-[10px] font-black uppercase tracking-widest ml-2">Reports</Text>
            </TouchableOpacity>
          </View>
 
          <View className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[32px] border border-blue-100 dark:border-blue-900/30">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[10px] font-black text-[#003399] dark:text-blue-400 uppercase tracking-widest">Active Status</Text>
              <View className="px-2 py-1 bg-emerald-500 rounded-lg">
                <Text className="text-white text-[9px] font-black uppercase">Clocked In</Text>
              </View>
            </View>
            <Text className="text-4xl font-black text-[#003399] dark:text-blue-500 tracking-tighter">08:45 <Text className="text-lg">AM</Text></Text>
            <Text className="text-slate-500 dark:text-slate-400 font-bold mt-1">Joined office in Port Harcourt</Text>
          </View>
        </View>

        <View className="px-6 py-8">
          <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 px-1">Quick Stats</Text>
          <View className="flex-row flex-wrap justify-between mb-8">
            <StatSmall label="Presents" value="24" icon={<CheckCircle2 size={16} color={isDark ? '#34d399' : '#059669'} />} color="emerald" isDark={isDark} />
            <StatSmall label="Late" value="02" icon={<Clock size={16} color={isDark ? '#fbbf24' : '#d97706'} />} color="amber" isDark={isDark} />
            <StatSmall label="Absents" value="00" icon={<AlertCircle size={16} color="#ef4444" />} color="red" isDark={isDark} />
          </View>

          <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 px-1">Current Actions</Text>
          <View className="space-y-4">
            <TouchableOpacity className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 items-center justify-center mr-4">
                  <Square size={20} color="#ef4444" fill="#ef4444" />
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900 dark:text-white">Clock Out</Text>
                  <Text className="text-xs font-medium text-slate-400 dark:text-slate-500">End your shift now</Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDark ? '#334155' : '#cbd5e1'} />
            </TouchableOpacity>
 
            <TouchableOpacity 
               onPress={() => router.push('/(protected)/(staff-management)/attendance/reports')}
               className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
                  <FileText size={20} color={isDark ? '#cbd5e1' : '#0f172a'} />
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900 dark:text-white">Performance Reports</Text>
                  <Text className="text-xs font-medium text-slate-400 dark:text-slate-500">View monthly summaries</Text>
                </View>
              </View>
              <ChevronRight size={20} color={isDark ? '#334155' : '#cbd5e1'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatSmall({ label, value, icon, color, isDark }: any) {
  const bgColors: any = {
    emerald: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
    amber: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
    red: isDark ? 'bg-red-900/20' : 'bg-red-50',
  };

  return (
    <View className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-[31%]">
      <View className={`w-8 h-8 rounded-xl ${bgColors[color]} items-center justify-center mb-2`}>
        {icon}
      </View>
      <Text className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{label}</Text>
      <Text className="text-xl font-black text-slate-900 dark:text-white">{value}</Text>
    </View>
  );
}
