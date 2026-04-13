import { Package, AlertTriangle, ArrowDown, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../../../lib/api';

export default function StockScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStock = async () => {
    try {
      const response = await api.get('/cmms/stock');
      setStock(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStock();
  };

  const renderItem = ({ item }: { item: any }) => {
    const isLow = item.quantity <= item.reorder_level;
    
    return (
      <TouchableOpacity className="bg-white dark:bg-slate-900 mx-6 mb-3 p-4 rounded-3xl flex-row items-center border border-slate-100 dark:border-slate-800 shadow-sm">
        <View className={`w-14 h-14 rounded-2xl items-center justify-center ${isLow ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
          <Package size={24} color={isLow ? '#f59e0b' : '#64748b'} strokeWidth={2} />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-slate-900 dark:text-white font-bold text-base">{item.item_name || item.name}</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Category: {item.category || 'General'}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className={`text-sm font-black ${isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              Qty: {item.quantity} {item.unit || 'pcs'}
            </Text>
            {isLow && (
                <View className="ml-2 flex-row items-center bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={10} color="#b45309" />
                    <Text className="text-[8px] font-black text-amber-700 dark:text-amber-400 uppercase ml-1">Low Stock</Text>
                </View>
            )}
          </View>
        </View>
        <View className="items-end">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Min. Level</Text>
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-xs">{item.reorder_level}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="p-6 pb-2">
        <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-6">Inventory</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
        </View>
      ) : (
        <FlatList
          data={stock}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#60a5fa' : '#003399'} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-10">
                <Package size={48} color={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth={1} />
                <Text className="text-slate-400 dark:text-slate-600 font-medium text-center mt-4">
                    Stock records are empty.
                </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
