import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Fuel, Calendar, Truck, User, Droplets, CreditCard, ArrowUpRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { format } from 'date-fns';
import api from '../../../lib/api';

export default function FuelScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/fuel-logs');
      setLogs(response.data.data.data || response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching fuel logs:', err);
      setError('Failed to load fuel logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const totalCost = logs.reduce((acc, log) => acc + (parseFloat(log.cost) || 0), 0);
  const totalLiters = logs.reduce((acc, log) => acc + (parseFloat(log.liters) || 0), 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Fuel Logs</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Consumption Tracking</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 items-center justify-center border border-orange-100 dark:border-orange-800">
            <Fuel size={24} color="#f97316" />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1 bg-slate-900 dark:bg-slate-800 p-4 rounded-2xl">
            <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total MTD</Text>
            <Text className="text-lg font-black text-white">₦{new Intl.NumberFormat().format(totalCost)}</Text>
          </View>
          <View className="flex-1 bg-orange-500 p-4 rounded-2xl">
            <Text className="text-[8px] font-black text-orange-100 uppercase tracking-widest mb-1">Total Liters</Text>
            <Text className="text-lg font-black text-white">{new Intl.NumberFormat().format(totalLiters)} L</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="space-y-4 pb-20">
          {logs.map((log, index) => (
            <Animated.View 
              key={log.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <View className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 items-center justify-center mr-3">
                      <Droplets size={18} color="#f97316" />
                    </View>
                    <View>
                      <Text className="text-sm font-black text-slate-900 dark:text-white">{log.liters} Liters</Text>
                      <Text className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(log.log_date), 'MMM dd, yyyy')}</Text>
                    </View>
                  </View>
                  <Text className="text-base font-black text-slate-900 dark:text-white">₦{new Intl.NumberFormat().format(log.cost)}</Text>
                </View>

                <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <View className="flex-row items-center">
                    <Truck size={12} color="#64748b" />
                    <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">{log.vehicle?.plate_number}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <User size={12} color="#64748b" />
                    <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">
                      {log.driver?.staff?.first_name} {log.driver?.staff?.surname?.charAt(0)}.
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CreditCard size={12} color="#64748b" />
                    <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">{log.receipt_no || 'No Receipt'}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}

          {logs.length === 0 && !loading && (
            <View className="items-center py-20">
              <Fuel size={48} color={isDark ? "#1e293b" : "#f1f5f9"} />
              <Text className="text-slate-400 font-bold mt-4">No fuel logs found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-10 right-6 w-16 h-16 bg-[#003399] dark:bg-blue-600 rounded-full items-center justify-center shadow-xl shadow-blue-500/40"
      >
        <ArrowUpRight size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
