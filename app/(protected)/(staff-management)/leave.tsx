import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { CalendarDays, Filter, ChevronRight, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

export default function LeaveManagementScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const leaveRequests = [
    { id: 1, staff: 'Michael Chen', type: 'Annual Leave', duration: '5 Days', status: 'Pending', date: 'April 15 - April 20' },
    { id: 2, staff: 'Sarah Wilson', type: 'Sick Leave', duration: '2 Days', status: 'Approved', date: 'April 05 - April 07' },
    { id: 3, staff: 'John Doe', type: 'Personal', duration: '1 Day', status: 'Rejected', date: 'April 01' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Leave Manager</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Approvals & Tracking</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center border border-emerald-100 dark:border-emerald-800">
            <CalendarDays size={24} color="#059669" />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity className="flex-1 bg-[#003399] py-4 rounded-2xl flex-row items-center justify-center">
            <Plus size={18} color="white" />
            <Text className="text-white font-black uppercase tracking-widest text-[10px] ml-2">Approve Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl items-center justify-center">
            <Filter size={18} color={isDark ? "#0f172a" : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 pb-10">
          {leaveRequests.map((request, index) => (
            <Animated.View key={request.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-base font-black text-slate-900 dark:text-white">{request.staff}</Text>
                    <Text className="text-[10px] font-black text-[#003399] dark:text-blue-400 uppercase tracking-widest mt-0.5">
                      {request.type} • {request.duration}
                    </Text>
                  </View>
                  <StatusBadge status={request.status} />
                </View>
                
                <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" className="mr-2" />
                    <Text className="text-xs font-bold text-slate-500 dark:text-slate-400">{request.date}</Text>
                  </View>
                  <ChevronRight size={16} color="#cbd5e1" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const configs: any = {
    Approved: { 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      icon: <CheckCircle2 size={10} color={isDark ? "#34d399" : "#059669"} /> 
    },
    Pending: { 
      bg: 'bg-amber-50 dark:bg-amber-900/20', 
      text: 'text-amber-600 dark:text-amber-400', 
      icon: <Clock size={10} color={isDark ? "#fbbf24" : "#d97706"} /> 
    },
    Rejected: { 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      text: 'text-red-600 dark:text-red-400', 
      icon: <XCircle size={10} color={isDark ? "#f87171" : "#ef4444"} /> 
    },
  };

  const config = configs[status];

  return (
    <View className={`${config.bg} px-2 py-1 rounded-lg flex-row items-center`}>
      {config.icon}
      <Text className={`${config.text} text-[9px] font-black uppercase tracking-widest ml-1.5`}>{status}</Text>
    </View>
  );
}
