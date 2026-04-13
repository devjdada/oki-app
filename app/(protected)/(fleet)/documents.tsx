import { format } from 'date-fns';
import { FileText, Calendar, Truck, AlertCircle, Download, Trash2, Shield } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import api from '../../../lib/api';

export default function DocumentsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/documents');
      setDocuments(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/fleet/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Compliance</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Vehicle Documents</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center border border-blue-100 dark:border-blue-800">
            <Shield size={24} color="#2563eb" />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="space-y-4 pb-20">
          {documents.map((doc, index) => (
            <Animated.View 
              key={doc.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <View className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
                      <FileText size={20} color={isDark ? "#60a5fa" : "#003399"} />
                    </View>
                    <View>
                      <Text className="text-base font-black text-slate-900 dark:text-white">{doc.document_type}</Text>
                      <View className="flex-row items-center mt-1">
                        <Truck size={12} color="#64748b" />
                        <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">{doc.vehicle?.plate_number}</Text>
                      </View>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${doc.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                    <Text className={`text-[8px] font-black uppercase tracking-widest ${doc.status === 'active' ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {doc.status || 'Active'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#64748b" />
                    <View className="ml-3">
                      <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Expires On</Text>
                      <Text className={`text-[10px] font-bold ${new Date(doc.expiry_date) < new Date() ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                        {doc.expiry_date ? format(new Date(doc.expiry_date), 'MMM dd, yyyy') : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row space-x-2">
                    <TouchableOpacity className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 items-center justify-center border border-slate-100 dark:border-slate-800">
                      <Download size={14} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(doc.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 items-center justify-center border border-red-100 dark:border-red-900/30"
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {new Date(doc.expiry_date) < new Date() && (
                  <View className="mt-3 flex-row items-center">
                    <AlertCircle size={12} color="#ef4444" />
                    <Text className="text-[10px] font-bold text-red-500 ml-1 uppercase">This document has expired</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}

          {documents.length === 0 && !loading && (
            <View className="items-center py-20">
              <FileText size={48} color={isDark ? "#1e293b" : "#f1f5f9"} />
              <Text className="text-slate-400 font-bold mt-4">No documents found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
