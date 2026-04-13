import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Briefcase, MapPin, Clock, ChevronRight, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

export default function CareersScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const jobs = [
    { id: 1, title: 'Senior Project Manager', location: 'Port Harcourt', type: 'Full-time', applicants: 12 },
    { id: 2, title: 'Structural Engineer', location: 'Lagos', type: 'Full-time', applicants: 8 },
    { id: 3, title: 'Site Supervisor', location: 'Abuja', type: 'Contract', applicants: 15 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Careers</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Talent Acquisition</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 items-center justify-center border border-amber-100 dark:border-amber-800">
            <Briefcase size={24} color="#d97706" />
          </View>
        </View>

        <TouchableOpacity className="w-full py-4 bg-slate-900 dark:bg-white rounded-2xl flex-row items-center justify-center">
          <Plus size={18} color={isDark ? "#0f172a" : "#fff"} />
          <Text className="text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] ml-2">Post New Opening</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 pb-10">
          {jobs.map((job, index) => (
            <Animated.View key={job.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <Text className="text-lg font-black text-slate-900 dark:text-white mb-2">{job.title || job.name}</Text>
                
                <View className="flex-row items-center space-x-4 mb-4">
                  <View className="flex-row items-center">
                    <MapPin size={12} color="#64748b" className="mr-1" />
                    <Text className="text-xs font-bold text-slate-500 dark:text-slate-400">{job.location}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={12} color="#64748b" className="mr-1" />
                    <Text className="text-xs font-bold text-slate-500 dark:text-slate-400">{job.type}</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between py-4 border-t border-slate-50 dark:border-slate-800/50">
                  <View>
                    <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Applicants</Text>
                    <Text className="text-sm font-bold text-[#003399] dark:text-blue-400">{job.applicants} received</Text>
                  </View>
                  <TouchableOpacity className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl group overflow-hidden border border-slate-100 dark:border-slate-700 flex-row items-center">
                    <Text className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mr-2">View List</Text>
                    <ChevronRight size={14} color={isDark ? "#fff" : "#0f172a"} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
