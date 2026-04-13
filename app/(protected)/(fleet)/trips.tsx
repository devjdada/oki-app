import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { History, MapPin, Calendar, Clock, ArrowRight, Truck, User } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { format } from 'date-fns';
import api from '../../../lib/api';

export default function TripsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/trips');
      setTrips(response.data.data.data || response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Trip Logs</Text>
            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Movement Statistics</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 items-center justify-center border border-purple-100 dark:border-purple-800">
            <History size={24} color="#8b5cf6" />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="space-y-6 pb-20">
          {trips.map((trip, index) => (
            <Animated.View 
              key={trip.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
                {/* Trip Header */}
                <View className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#64748b" />
                    <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                      {format(new Date(trip.trip_date), 'EEEE, MMM dd, yyyy')}
                    </Text>
                  </View>
                  <View className="px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700">
                    <Text className="text-[8px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {trip.distance_km} KM
                    </Text>
                  </View>
                </View>

                {/* Trip Route */}
                <View className="p-6">
                  <View className="flex-row items-start">
                    <View className="items-center mr-4">
                      <View className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
                      <View className="w-0.5 h-12 bg-slate-100 dark:bg-slate-800" />
                      <View className="w-3 h-3 rounded-full bg-blue-600" />
                    </View>
                    <View className="flex-1 space-y-4">
                      <View>
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</Text>
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">{trip.origin}</Text>
                      </View>
                      <View className="mt-4">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</Text>
                        <Text className="text-sm font-bold text-slate-900 dark:text-white">{trip.destination}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Trip Details */}
                  <View className="flex-row items-center justify-between mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-3">
                        <Truck size={14} color="#2563eb" />
                      </View>
                      <View>
                        <Text className="text-[8px] font-black text-slate-400 uppercase">Vehicle</Text>
                        <Text className="text-[10px] font-bold text-slate-900 dark:text-white">{trip.vehicle?.plate_number}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center mr-3">
                        <User size={14} color="#059669" />
                      </View>
                      <View>
                        <Text className="text-[8px] font-black text-slate-400 uppercase">Driver</Text>
                        <Text className="text-[10px] font-bold text-slate-900 dark:text-white">
                          {trip.driver?.staff?.first_name} {trip.driver?.staff?.surname?.charAt(0)}.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}

          {trips.length === 0 && !loading && (
            <View className="items-center py-20">
              <History size={48} color={isDark ? "#1e293b" : "#f1f5f9"} />
              <Text className="text-slate-400 font-bold mt-4">No trip logs found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
