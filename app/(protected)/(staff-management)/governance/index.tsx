import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ShieldCheck, ChevronRight, Users, Settings, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function DepartmentsScreen() {
  const router = useRouter();

  const departments = [
    { id: 1, name: 'Operations', head: 'John Doe', staffCount: 45, color: '#3b82f6' },
    { id: 2, name: 'Human Resources', head: 'Jane Smith', staffCount: 12, color: '#ec4899' },
    { id: 3, name: 'Engineering', head: 'Robert Brown', staffCount: 88, color: '#10b981' },
    { id: 4, name: 'Finance', head: 'Sarah Wilson', staffCount: 8, color: '#f59e0b' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pt-8 pb-6 border-b border-slate-100 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 tracking-tighter">Departments</Text>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Infrastructure</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(protected)/(staff-management)/governance/documents')}
            className="w-12 h-12 rounded-2xl bg-[#003399]/10 items-center justify-center border border-[#003399]/20"
          >
            <ShieldCheck size={24} color="#003399" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="w-full py-4 bg-slate-900 rounded-2xl flex-row items-center justify-center">
          <Plus size={18} color="white" />
          <Text className="text-white font-black uppercase tracking-widest text-[10px] ml-2">Add New Department</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 pb-10">
          {departments.map((dept, index) => (
            <Animated.View key={dept.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View 
                      style={{ backgroundColor: dept.color }} 
                      className="w-3 h-3 rounded-full mr-3" 
                    />
                    <Text className="text-lg font-black text-slate-900">{dept.name}</Text>
                  </View>
                  <TouchableOpacity className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center">
                    <Settings size={14} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Head of Dept</Text>
                    <Text className="text-sm font-bold text-slate-700">{dept.head}</Text>
                  </View>
                  <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Users size={12} color="#64748b" className="mr-2" />
                    <Text className="text-xs font-black text-slate-700">{dept.staffCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
