import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Clock, Calendar, ChevronRight, FileText, CheckCircle2, AlertCircle, Play, Square } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function AttendanceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white px-8 pt-8 pb-10 border-b border-slate-100 rounded-b-[40px] shadow-sm">
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-3xl font-black text-slate-900 tracking-tighter">Attendance</Text>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Tracking</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(protected)/(staff-management)/attendance/reports')}
              className="px-4 py-2 bg-slate-900 rounded-xl flex-row items-center"
            >
              <FileText size={16} color="white" />
              <Text className="text-white text-[10px] font-black uppercase tracking-widest ml-2">Reports</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[10px] font-black text-[#003399] uppercase tracking-widest">Active Status</Text>
              <View className="px-2 py-1 bg-emerald-500 rounded-lg">
                <Text className="text-white text-[9px] font-black uppercase">Clocked In</Text>
              </View>
            </View>
            <Text className="text-4xl font-black text-[#003399] tracking-tighter">08:45 <Text className="text-lg">AM</Text></Text>
            <Text className="text-slate-500 font-bold mt-1">Joined office in Port Harcourt</Text>
          </View>
        </View>

        <View className="px-6 py-8">
          <Text className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5 px-1">Quick Stats</Text>
          <View className="flex-row flex-wrap justify-between mb-8">
            <StatSmall label="Presents" value="24" icon={<CheckCircle2 size={16} color="#059669" />} color="emerald" />
            <StatSmall label="Late" value="02" icon={<Clock size={16} color="#d97706" />} color="amber" />
            <StatSmall label="Absents" value="00" icon={<AlertCircle size={16} color="#ef4444" />} color="red" />
          </View>

          <Text className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5 px-1">Current Actions</Text>
          <View className="space-y-4">
            <TouchableOpacity className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center mr-4">
                  <Square size={20} color="#ef4444" fill="#ef4444" />
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900">Clock Out</Text>
                  <Text className="text-xs font-medium text-slate-400">End your shift now</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity 
               onPress={() => router.push('/(protected)/(staff-management)/attendance/reports')}
               className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4">
                  <FileText size={20} color="#0f172a" />
                </View>
                <View>
                  <Text className="text-base font-black text-slate-900">Performance Reports</Text>
                  <Text className="text-xs font-medium text-slate-400">View monthly summaries</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatSmall({ label, value, icon, color }: any) {
  const bgColors: any = {
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
  };

  return (
    <View className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm w-[31%]">
      <View className={`w-8 h-8 rounded-xl ${bgColors[color]} items-center justify-center mb-2`}>
        {icon}
      </View>
      <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</Text>
      <Text className="text-xl font-black text-slate-900">{value}</Text>
    </View>
  );
}
