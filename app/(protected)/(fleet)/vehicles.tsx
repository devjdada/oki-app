import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { Search, Filter, Truck, ChevronRight, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import api from '../../../lib/api';

export default function VehiclesScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/vehicles');
      setVehicles(response.data.data.data || response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const filteredVehicles = vehicles.filter(v => 
    v.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
    v.brand?.toLowerCase().includes(search.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Fleet Assets</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Vehicle Inventory</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center border border-blue-100 dark:border-blue-800">
            <Truck size={24} color="#003399" />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1 flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl">
            <Search size={18} color={isDark ? "#64748b" : "#94a3b8"} />
            <TextInput
              className="flex-1 ml-3 font-bold text-slate-700 dark:text-slate-200"
              placeholder="Search by plate or model..."
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
          {filteredVehicles.map((vehicle, index) => (
            <Animated.View 
              key={vehicle.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
                      <Truck size={24} color={isDark ? "#60a5fa" : "#003399"} />
                    </View>
                    <View>
                      <Text className="text-lg font-black text-slate-900 dark:text-white">{vehicle.plate_number}</Text>
                      <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{vehicle.brand} {vehicle.model}</Text>
                    </View>
                  </View>
                  <StatusBadge status={vehicle.status} />
                </View>

                <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <View className="flex-row items-center">
                    <ShieldCheck size={14} color="#64748b" />
                    <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">{vehicle.vehicle_type}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <AlertTriangle size={14} color={vehicle.next_service_date < new Date().toISOString() ? "#ef4444" : "#94a3b8"} />
                    <Text className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Next Service: {vehicle.next_service_date ? new Date(vehicle.next_service_date).toLocaleDateString() : 'N/A'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredVehicles.length === 0 && !loading && (
            <View className="items-center py-20">
              <Truck size={48} color={isDark ? "#1e293b" : "#f1f5f9"} />
              <Text className="text-slate-400 font-bold mt-4">No vehicles found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isAvailable = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'available';
  const isMaintenance = status?.toLowerCase() === 'maintenance';
  
  return (
    <View className={`px-3 py-1 rounded-full ${
      isAvailable ? 'bg-emerald-50 dark:bg-emerald-900/20' : 
      isMaintenance ? 'bg-orange-50 dark:bg-orange-900/20' : 
      'bg-slate-50 dark:bg-slate-900/20'
    }`}>
      <Text className={`text-[10px] font-black uppercase tracking-widest ${
        isAvailable ? 'text-emerald-600' : 
        isMaintenance ? 'text-orange-600' : 
        'text-slate-600'
      }`}>
        {status || 'Unknown'}
      </Text>
    </View>
  );
}
