import { useRouter } from 'expo-router';
import { FolderPlus, ChevronLeft, Search, FileText, MoreVertical, Plus } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DocumentsScreen() {
  const router = useRouter();

  const documents = [
    { id: 1, name: 'Employee Handbook 2026.pdf', category: 'General', size: '4.5 MB' },
    { id: 2, name: 'Health & Safety Policy.docx', category: 'HSE', size: '2.1 MB' },
    { id: 3, name: 'Standard Benefits Guide.pdf', category: 'HR', size: '1.8 MB' },
    { id: 4, name: 'Promotion Guidelines.pdf', category: 'HR', size: '0.9 MB' },
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
          <Text className="text-xl font-black text-slate-900 tracking-tighter">Staff Documents</Text>
          <TouchableOpacity className="w-10 h-10 rounded-xl bg-slate-900 items-center justify-center">
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
          <Search size={18} color="#94a3b8" />
          <Text className="ml-3 font-bold text-slate-400">Search documents...</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {documents.map((doc, index) => (
            <Animated.View key={doc.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4">
                    <FileText size={20} color="#64748b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-black text-slate-900" numberOfLines={1}>{doc.name}</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {doc.category} • {doc.size}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="w-8 h-8 items-center justify-center">
                  <MoreVertical size={16} color="#cbd5e1" />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
