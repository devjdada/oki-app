import { Contact, Phone, Mail, MapPin, ChevronRight, Globe } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import api from '../../../lib/api';

export default function VendorsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/cmms/vendors');
      setVendors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white dark:bg-slate-900 mx-6 mb-4 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-blue-600 items-center justify-center">
            <Text className="text-white font-black text-xl">{item.name?.charAt(0)}</Text>
        </View>
        <View className="ml-4 flex-1">
            <Text className="text-slate-900 dark:text-white font-black text-lg leading-tight">{item.name}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">
                {item.category || 'Maintenance Vendor'}
            </Text>
        </View>
      </View>

      <View className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
        {item.contact_email && (
            <TouchableOpacity 
                onPress={() => Linking.openURL(`mailto:${item.contact_email}`)}
                className="flex-row items-center"
            >
                <View className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center">
                    <Mail size={14} color="#64748b" />
                </View>
                <Text className="ml-3 text-slate-600 dark:text-slate-300 text-sm font-medium">{item.contact_email}</Text>
            </TouchableOpacity>
        )}
        
        {item.contact_phone && (
            <TouchableOpacity 
                onPress={() => Linking.openURL(`tel:${item.contact_phone}`)}
                className="flex-row items-center"
            >
                <View className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center">
                    <Phone size={14} color="#64748b" />
                </View>
                <Text className="ml-3 text-slate-600 dark:text-slate-300 text-sm font-medium">{item.contact_phone}</Text>
            </TouchableOpacity>
        )}

        {item.address && (
            <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center">
                    <MapPin size={14} color="#64748b" />
                </View>
                <Text className="ml-3 text-slate-600 dark:text-slate-300 text-sm font-medium flex-1" numberOfLines={1}>
                    {item.address}
                </Text>
            </View>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="p-6 pb-2">
        <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-6">Vendors</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#60a5fa' : '#003399'} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-10">
                <Contact size={48} color={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth={1} />
                <Text className="text-slate-400 dark:text-slate-600 font-medium text-center mt-4">
                    Vendor list is empty.
                </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
