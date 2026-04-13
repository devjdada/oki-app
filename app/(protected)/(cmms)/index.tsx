import { 
  Box, 
  Wrench, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import api from '../../../lib/api';

export default function CMMSDashboard() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await api.get('/cmms/dashboard');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching CMMS dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Assets', value: data?.stats?.active_equipment || 0, icon: Box, color: '#3b82f6' },
    { label: 'Pending WO', value: data?.stats?.pending_work_orders || 0, icon: Wrench, color: '#f59e0b' },
    { label: 'Urgent WO', value: data?.stats?.urgent_work_orders || 0, icon: AlertTriangle, color: '#ef4444' },
    { label: 'Low Stock', value: data?.stats?.low_stock_count || 0, icon: Package, color: '#ec4899' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={isDark ? '#60a5fa' : '#003399'} />
      }
    >
      <View className="p-6">
        <View className="mb-8">
          <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            CMMS Overview
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 font-medium">
            Project Maintenance & Asset Status
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          {stats.map((stat, index) => (
            <View 
              key={index} 
              className="w-[48%] bg-white dark:bg-slate-900 p-5 rounded-3xl mb-4 shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <View 
                style={{ backgroundColor: stat.color + '20' }}
                className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
              >
                <stat.icon size={24} color={stat.color} strokeWidth={2.5} />
              </View>
              <Text className="text-2xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </Text>
              <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mt-4 mb-8">
          <Text className="text-sm font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-1 bg-slate-900 dark:bg-blue-600 p-4 rounded-2xl flex-row items-center justify-center space-x-2">
              <Plus size={18} color="#fff" strokeWidth={3} />
              <Text className="text-white font-bold">New WO</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 items-center justify-center">
              <Text className="text-slate-900 dark:text-white font-bold">Inquiry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Work Orders */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              Recent Work Orders
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-bold text-xs uppercase">View All</Text>
            </TouchableOpacity>
          </View>

          {data?.recent_work_orders?.map((wo: any) => (
            <TouchableOpacity 
              key={wo.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl mb-3 flex-row items-center border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <View className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center">
                <Wrench size={20} color={wo.priority === 'High' ? '#ef4444' : '#64748b'} strokeWidth={2} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-slate-900 dark:text-white font-bold" numberOfLines={1}>
                  {wo.description}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  {wo.equipment?.name || 'Unassigned Equipment'} • {wo.status}
                </Text>
              </View>
              <ChevronRight size={16} color="#94a3b8" />
            </TouchableOpacity>
          ))}
          
          {data?.recent_work_orders?.length === 0 && (
            <View className="py-8 items-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
               <Text className="text-slate-400 dark:text-slate-600 font-medium italic">No recent work orders</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
