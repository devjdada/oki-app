import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { FileText, ChevronLeft, Download, Calendar, Filter } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function AttendanceReportsScreen() {
  const router = useRouter();

  const reports = [
    { id: 1, title: 'March 2026 Summary', date: 'April 02, 2026', size: '1.2 MB', type: 'PDF' },
    { id: 2, title: 'February 2026 Summary', date: 'March 01, 2026', size: '1.1 MB', type: 'PDF' },
    { id: 3, title: 'Q1 Performance Review', date: 'March 28, 2026', size: '2.5 MB', type: 'XLSX' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pt-8 pb-6 border-b border-slate-100 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-100"
          >
            <ChevronLeft size={20} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-900 tracking-tighter">Attendance Reports</Text>
          <View className="w-10" />
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity className="flex-1 flex-row items-center bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
            <Calendar size={18} color="#94a3b8" />
            <Text className="flex-1 ml-3 font-bold text-slate-400">Select Month</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center">
            <Filter size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {reports.map((report, index) => (
            <Animated.View key={report.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-4">
                    <FileText size={20} color="#003399" />
                  </View>
                  <View>
                    <Text className="text-base font-black text-slate-900">{report.title}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Generated: {report.date} • {report.size}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="w-10 h-10 rounded-xl bg-slate-900 items-center justify-center">
                  <Download size={16} color="white" />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
