import { Box, Search, Filter, ChevronRight, Activity } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../../../lib/api';

export default function AssetsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/cmms/assets');
      setAssets(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssets();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white dark:bg-slate-900 mx-6 mb-3 p-4 rounded-3xl flex-row items-center border border-slate-100 dark:border-slate-800 shadow-sm">
      <View className={`w-14 h-14 rounded-2xl items-center justify-center ${item.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
        <Box size={24} color={item.status === 'Active' ? '#22c55e' : '#ef4444'} strokeWidth={2} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-slate-900 dark:text-white font-bold text-base">{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <Activity size={12} color="#94a3b8" />
          <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1 font-medium">
            {item.type} • ID: {item.equipment_id}
          </Text>
        </View>
        <View className="mt-2 flex-row">
            <View className={`px-2 py-0.5 rounded-full ${item.status === 'Active' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                <Text className={`text-[10px] font-bold uppercase ${item.status === 'Active' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {item.status}
                </Text>
            </View>
        </View>
      </View>
      <ChevronRight size={16} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="p-6 pb-2">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase">Assets</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-200 dark:border-slate-800">
              <Search size={20} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-200 dark:border-slate-800">
              <Filter size={20} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
        </View>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#60a5fa' : '#003399'} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-10">
                <Box size={48} color={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth={1} />
                <Text className="text-slate-400 dark:text-slate-600 font-medium text-center mt-4">
                    No assets found in the system.
                </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
