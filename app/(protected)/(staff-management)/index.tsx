import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Search, Filter, ChevronRight, Mail, Phone, MapPin, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

const MOCK_STAFF = [
  { id: 1, name: 'John Doe', designation: 'General Manager', department: 'Operations', initials: 'JD' },
  { id: 2, name: 'Jane Smith', designation: 'HR Executive', department: 'Human Resources', initials: 'JS' },
  { id: 3, name: 'Robert Brown', designation: 'Site Engineer', department: 'Construction', initials: 'RB' },
  { id: 4, name: 'Sarah Wilson', designation: 'Accountant', department: 'Finance', initials: 'SW' },
  { id: 5, name: 'Michael Chen', designation: 'Safety Officer', department: 'HSE', initials: 'MC' },
];

export default function StaffDirectoryScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Staff Directory</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Global Workspace</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center border border-blue-100 dark:border-blue-800">
            <Users size={24} color="#003399" />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1 flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl">
            <Search size={18} color={isDark ? "#64748b" : "#94a3b8"} />
            <TextInput
              className="flex-1 ml-3 font-bold text-slate-700 dark:text-slate-200"
              placeholder="Search staff members..."
              placeholderTextColor={isDark ? "#475569" : "#64748b"}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl items-center justify-center">
            <Filter size={18} color={isDark ? "#0f172a" : "#fff"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 pb-10">
          {MOCK_STAFF.map((staff, index) => (
            <Animated.View 
              key={staff.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center">
                <View className="w-14 h-14 rounded-2xl bg-[#003399] items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
                  <Text className="text-white font-black text-lg">{staff.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-black text-slate-900 dark:text-white">{staff.name}</Text>
                  <Text className="text-[10px] font-black text-[#003399] dark:text-blue-500 uppercase tracking-widest mt-0.5">
                    {staff.designation}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
                      <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                        {staff.department}
                      </Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={isDark ? "#475569" : "#cbd5e1"} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
