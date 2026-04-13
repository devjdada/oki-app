import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import {
  Truck,
  Users,
  Calendar,
  Fuel,
  AlertTriangle,
  ChevronRight,
  History,
  Activity,
  ArrowUpRight
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import AppLogo from '../../../components/AppLogo';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function FleetDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fleet/dashboard');
      setDashboardData(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching fleet dashboard:', err);
      setError('Failed to load fleet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const stats = dashboardData?.stats;
  const recentTrips = dashboardData?.recent_trips || [];
  const upcomingMaintenance = dashboardData?.upcoming_maintenance || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#fff' : '#003399'} />}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-white dark:bg-slate-900 px-8 pt-8 pb-10 border-b border-slate-100 dark:border-slate-800 rounded-b-[40px] shadow-sm">
          <View className="flex-row items-center justify-between mb-8">
            <AppLogo width={40} height={40} />
            <View className="flex-row space-x-2">
              <View className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <Text className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Fleet Admin</Text>
              </View>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Fleet <Text className="text-[#003399] dark:text-blue-500">Overview</Text>
            </Text>
            <View className="flex-row items-center mt-2">
              <Activity size={14} color={isDark ? '#4b5563' : '#94a3b8'} />
              <Text className="text-slate-500 dark:text-slate-400 font-bold ml-1">
                Real-time logistics & maintenance monitoring
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="px-6 py-8">
          {/* Stats Grid */}
          <View className="flex-row flex-wrap justify-between mb-8">
            <StatCard
              label="Vehicles"
              value={stats?.total_vehicles || 0}
              icon={<Truck size={20} color="#2563eb" />}
              color="blue"
              delay={300}
            />
            <StatCard
              label="Drivers"
              value={stats?.active_drivers || 0}
              icon={<Users size={20} color="#059669" />}
              color="emerald"
              delay={400}
            />
            <StatCard
              label="Trips/Mo"
              value={stats?.total_trips_month || 0}
              icon={<History size={20} color="#8b5cf6" />}
              color="purple"
              delay={500}
            />
          </View>

          {/* Quick Info: Fuel Cost */}
          <Animated.View 
            entering={FadeInDown.delay(600)}
            className="bg-[#003399] dark:bg-blue-600 p-6 rounded-[32px] mb-8 shadow-xl shadow-blue-500/20"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Fuel size={18} color="white" />
                <Text className="text-[10px] font-black text-white/70 uppercase tracking-widest ml-2">Total Fuel Spend (MTD)</Text>
              </View>
              <ArrowUpRight size={18} color="white" />
            </View>
            <Text className="text-3xl font-black text-white tracking-tighter">
              ₦{new Intl.NumberFormat().format(stats?.total_fuel_cost_month || 0)}
            </Text>
          </Animated.View>

          {/* Maintenance Alerts */}
          {upcomingMaintenance.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Action Required" />
              {upcomingMaintenance.map((vehicle: any, index: number) => (
                <MaintenanceCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  delay={700 + (index * 100)} 
                  isDark={isDark}
                />
              ))}
            </View>
          )}

          {/* Recent Trips */}
          <SectionHeader title="Recent Activity" onSeeAll={() => router.push('/(protected)/(fleet)/trips')} />
          <View className="space-y-4">
            {recentTrips.length > 0 ? (
              recentTrips.map((trip: any, index: number) => (
                <TripRow 
                  key={trip.id} 
                  trip={trip} 
                  delay={800 + (index * 100)} 
                  isDark={isDark}
                />
              ))
            ) : (
              <View className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 items-center">
                <History size={40} color={isDark ? '#334155' : '#f1f5f9'} />
                <Text className="text-slate-400 dark:text-slate-500 font-bold mt-4">No recent trips recorded</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, color, delay }: any) {
  const bgColors: any = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20'
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)}
      className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-[31%]"
    >
      <View className={`w-10 h-10 rounded-xl ${bgColors[color]} items-center justify-center mb-3`}>
        {icon}
      </View>
      <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</Text>
      <Text className="text-xl font-black text-slate-900 dark:text-white">{value}</Text>
    </Animated.View>
  );
}

function SectionHeader({ title, onSeeAll }: any) {
  return (
    <View className="flex-row items-center justify-between mb-5 px-1">
      <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function MaintenanceCard({ vehicle, delay, isDark }: any) {
  return (
    <Animated.View entering={FadeInRight.delay(delay)} className="mb-4">
      <View className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-3xl border border-orange-100 dark:border-orange-900/20 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 items-center justify-center mr-4">
            <AlertTriangle size={20} color="#f97316" />
          </View>
          <View>
            <Text className="text-base font-black text-slate-900 dark:text-white">{vehicle.plate_number}</Text>
            <Text className="text-xs font-medium text-orange-600/70 dark:text-orange-400/70">
              Needs Service: {format(new Date(vehicle.next_service_date), 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color="#f97316" />
      </View>
    </Animated.View>
  );
}

function TripRow({ trip, delay, isDark }: any) {
  return (
    <Animated.View entering={FadeInRight.delay(delay)}>
      <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
            <Truck size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-black text-slate-900 dark:text-white">{trip.vehicle?.plate_number}</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase">{trip.status || 'Completed'}</Text>
            </View>
            <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1" numberOfLines={1}>
              {trip.origin} → {trip.destination}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-1">
               Driver: {trip.driver?.staff?.first_name} {trip.driver?.staff?.surname}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
