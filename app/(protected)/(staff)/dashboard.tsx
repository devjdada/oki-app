import { format } from 'date-fns/format';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  Users,
  Clock,
  MessageSquare,
  Play,
  Square,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Timer,
  ClipboardList
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Platform, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import AppLogo from '../../../components/AppLogo';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff/dashboard');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return { error: 'Permission to access location was denied' };
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        return { error: 'Location services are disabled' };
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      };
      setLocation(coords);
      return { coords };
    } catch (err) {
      console.error('Error getting location:', err);
      return { error: 'Could not fetch location' };
    }
  };

  useEffect(() => {
    fetchData();
    getCurrentLocation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      
      let currentLoc = location;
      
      // If we don't have a location, try to get it now
      if (!currentLoc) {
        const result = await getCurrentLocation();
        if (result.error) {
          Alert.alert('Location Required', result.error + '. Please ensure GPS is enabled and permissions are granted.');
          setLoading(false);
          return;
        }
        currentLoc = result.coords;
      }

      await api.post('/attendance/clock-in', {
        staff_id: user?.staff?.id,
        clock_in_time: new Date().toISOString(),
        latitude: currentLoc?.lat,
        longitude: currentLoc?.lng
      });
      
      fetchData();
      Alert.alert('Success', 'You have clocked in successfully.');
    } catch (err: any) {
      console.error('Clock in error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to clock in. Please try again.';
      Alert.alert('Clock In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      await api.post('/attendance/clock-out');
      fetchData();
    } catch (err) {
      console.error('Clock out error:', err);
      alert('Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

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
            <TouchableOpacity
              onPress={() => router.push('/(protected)/(staff)/profile')}
              className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700"
            >
              <Users size={24} color={isDark ? '#60a5fa' : '#003399'} />
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Welcome, <Text className="text-[#003399] dark:text-blue-500">{user?.staff?.first_name || user?.name?.split(' ')[0]}</Text>
            </Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-slate-500 dark:text-slate-400 font-bold">
                {user?.staff?.designation || 'Staff'} • {user?.staff?.department?.name || 'Isokariari'}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="px-6 py-8">
          {/* Stats Grid */}
          <View className="flex-row flex-wrap justify-between mb-8">
            <StatCard
              label="Present"
              value={stats?.attendance?.present || 0}
              icon={<CheckCircle2 size={20} color="#059669" />}
              color="emerald"
              delay={300}
            />
            <StatCard
              label="Late"
              value={stats?.attendance?.late || 0}
              icon={<Clock size={20} color="#d97706" />}
              color="amber"
              delay={400}
            />
            <StatCard
              label="Messages"
              value={stats?.unread_messages || 0}
              icon={<MessageSquare size={20} color="#2563eb" />}
              color="blue"
              delay={500}
            />
          </View>

          {/* Time Clock */}
          <Animated.View
            entering={FadeInDown.delay(600)}
            className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden mb-8"
          >
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <Timer size={20} color={isDark ? '#60a5fa' : '#003399'} />
                <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest ml-2">Time Clock</Text>
              </View>
              <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {format(new Date(), 'EEEE, MMMM do')}
              </Text>
            </View>

            <View className="items-center mb-8">
              <Text className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                {format(new Date(), 'hh:mm')}
                <Text className="text-2xl text-slate-300 dark:text-slate-600"> {format(new Date(), 'aa')}</Text>
              </Text>
            </View>

            {stats?.today_attendance ? (
              <View className="space-y-3">
                <View className="flex-row items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <View className="flex-row items-center">
                    <CheckCircle2 size={20} color="#059669" />
                    <View className="ml-3">
                      <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Clocked In</Text>
                      <Text className="text-lg font-black text-slate-900 dark:text-white">{stats.today_attendance.clock_in}</Text>
                    </View>
                  </View>
                </View>

                {!stats.today_attendance.clock_out && (
                  <TouchableOpacity
                    onPress={handleClockOut}
                    className="w-full py-5 bg-slate-900 dark:bg-slate-100 rounded-2xl flex-row items-center justify-center"
                  >
                    <Square size={16} color={isDark ? '#000' : '#fff'} fill={isDark ? '#000' : '#fff'} />
                    <Text className="text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] ml-2">Clock Out Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleClockIn}
                className="w-full py-6 bg-[#003399] dark:bg-blue-600 rounded-2xl flex-row items-center justify-center shadow-xl shadow-blue-500/20"
              >
                <Play size={16} color="white" fill="white" />
                <Text className="text-white font-black uppercase tracking-widest text-[10px] ml-2">Clock In Now</Text>
              </TouchableOpacity>
            )}

            {!location && !stats?.today_attendance && (
              <View className="mt-4 flex-row items-center justify-center">
                <MapPin size={12} color="#f59e0b" />
                <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest ml-1">Location Required</Text>
              </View>
            )}
          </Animated.View>

          {/* Quick Actions */}
          <SectionHeader title="Staff Quick Tools" />
          <View className="space-y-4 gap-4">
            <ActionRow
              title="Leave Management"
              subtitle="Apply and track requests"
              icon={<Calendar size={20} color={isDark ? '#60a5fa' : '#003399'} />}
              onPress={() => router.push('/(protected)/(staff)/leave')}
              delay={700}
              isDark={isDark}
            />
            <ActionRow
              title="Work Orders"
              subtitle="Equipment maintenance"
              icon={<ClipboardList size={20} color={isDark ? '#60a5fa' : '#003399'} />}
              onPress={() => router.push('/(protected)/(staff)/work-orders')}
              delay={800}
              isDark={isDark}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, color, delay }: any) {
  const bgColors: any = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20'
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
      <Text className="text-2xl font-black text-slate-900 dark:text-white">{value}</Text>
    </Animated.View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center justify-between mb-5 px-1">
      <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</Text>
    </View>
  );
}

function ActionRow({ title, subtitle, icon, onPress, delay, isDark }: any) {
  return (
    <Animated.View entering={FadeInRight.delay(delay)}>
      <TouchableOpacity
        onPress={onPress}
        className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-4">
            {icon}
          </View>
          <View>
            <Text className="text-base font-black text-slate-900 dark:text-white">{title}</Text>
            <Text className="text-xs font-medium text-slate-400 dark:text-slate-500">{subtitle}</Text>
          </View>
        </View>
        <ChevronRight size={20} color={isDark ? '#4b5563' : '#cbd5e1'} />
      </TouchableOpacity>
    </Animated.View>
  );
}
