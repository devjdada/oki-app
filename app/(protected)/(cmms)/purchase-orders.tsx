import { ShoppingCart, FileText, ChevronRight, DollarSign } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../../../lib/api';

export default function PurchaseOrdersScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/cmms/purchase-orders');
      setOrders(response.data.data.data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white dark:bg-slate-900 mx-6 mb-3 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                <ShoppingCart size={18} color="#2563eb" />
            </View>
            <View className="ml-3">
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</Text>
                <Text className="text-slate-900 dark:text-white font-black">#{item.po_number || item.id}</Text>
            </View>
        </View>
        <View className={`px-2 py-0.5 rounded-lg ${item.status === 'Approved' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
            <Text className={`text-[8px] font-black uppercase ${item.status === 'Approved' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {item.status}
            </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-end border-t border-slate-50 dark:border-slate-800 pt-3">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">{item.vendor?.name || 'Unknown Vendor'}</Text>
            <Text className="text-slate-400 text-[10px]">{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Amount</Text>
            <Text className="text-slate-900 dark:text-emerald-400 font-black text-base">
                ₦{Number(item.total_amount).toLocaleString()}
            </Text>
          </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="p-6 pb-2">
        <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-6">Purchase Orders</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#60a5fa' : '#003399'} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-10">
                <ShoppingCart size={48} color={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth={1} />
                <Text className="text-slate-400 dark:text-slate-600 font-medium text-center mt-4">
                    No purchase orders found.
                </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
