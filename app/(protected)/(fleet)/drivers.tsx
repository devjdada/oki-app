import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Search, Filter, Users, ChevronRight, Phone, Mail, Award, Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import api from '../../../lib/api';

export default function DriversScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/drivers');
      setDrivers(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const filteredDrivers = drivers.filter(d => 
    d.staff?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.staff?.surname?.toLowerCase().includes(search.toLowerCase()) ||
    d.license_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Fleet Drivers</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Operator Registry</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center border border-emerald-100 dark:border-emerald-800">
            <Users size={24} color="#059669" />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1 flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl">
            <Search size={18} color={isDark ? "#64748b" : "#94a3b8"} />
            <TextInput
              className="flex-1 ml-3 font-bold text-slate-700 dark:text-slate-200"
              placeholder="Search by name or license..."
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

      <ScrollView 
        className="flex-1 px-6 py-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="space-y-4 pb-20">
          {filteredDrivers.map((driver, index) => (
            <Animated.View 
              key={driver.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                <View className="flex-row items-center mb-6">
                  <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
                    <Text className="text-white font-black text-xl">
                      {driver.staff?.first_name?.charAt(0)}{driver.staff?.surname?.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-black text-slate-900 dark:text-white">
                      {driver.staff?.first_name} {driver.staff?.surname}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Award size={12} color="#059669" />
                      <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest ml-1">
                        Licensed Operator
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={isDark ? "#475569" : "#cbd5e1"} />
                </View>

                <View className="grid grid-cols-2 gap-4">
                  <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1 mr-2">
                    <Calendar size={14} color="#64748b" />
                    <View className="ml-2">
                      <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">License Expiry</Text>
                      <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase">
                        {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1">
                    <ShieldCheck size={14} color="#64748b" />
                    <View className="ml-2">
                      <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">License No</Text>
                      <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase">
                        {driver.license_number}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-4">
                  <View className="flex-row space-x-2">
                    <TouchableOpacity className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                      <Phone size={14} color="#2563eb" />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 items-center justify-center">
                      <Mail size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${driver.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${driver.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {driver.status || 'Active'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredDrivers.length === 0 && !loading && (
            <View className="items-center py-20">
              <Users size={48} color={isDark ? "#1e293b" : "#f1f5f9"} />
              <Text className="text-slate-400 font-bold mt-4">No drivers found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
