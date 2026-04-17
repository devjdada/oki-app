import { format } from 'date-fns/format';
import { 
  ClipboardList, 
  Plus, 
  Hammer, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Truck, 
  Hash, 
  AlignLeft, 
  ChevronRight,
  X
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Modal, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import AppButton from '../../../components/AppButton';
import AppInput from '../../../components/AppInput';
import api from '../../../lib/api';

export default function WorkOrdersScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [resources, setResources] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [equipmentId, setEquipmentId] = useState('');
  const [type, setType] = useState('internal');
  const [vendorId, setVendorId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [woRes, resRes] = await Promise.all([
        api.get('/staff/work-orders'),
        api.get('/staff/work-orders/resources')
      ]);
      setWorkOrders(woRes.data.data);
      setResources(resRes.data.data);
    } catch (err) {
      console.error('Error fetching work orders:', err);
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

  const handleSubmit = async () => {
    if (!equipmentId || !description) {
      alert('Please select equipment and provide a description');

      return;
    }

    setFormLoading(true);

    try {
      await api.post('/staff/work-orders', {
        equipment_id: equipmentId,
        type,
        vendor_id: vendorId,
        description,
        priority
      });
      setIsFormOpen(false);
      fetchData();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit work order');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEquipmentId('');
    setType('internal');
    setVendorId('');
    setDescription('');
    setPriority('Medium');
  };

  if (loading && workOrders.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-white dark:bg-slate-900 px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6 rounded-b-[40px] shadow-sm">
        <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Work Orders</Text>
        <Text className="text-slate-500 dark:text-slate-400 font-bold mt-1 text-sm uppercase tracking-widest">Maintenance Tracking</Text>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#fff' : '#003399'} />}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <AppButton 
          title="Raise Work Order" 
          icon={<Plus size={18} color="white" />}
          onPress={() => setIsFormOpen(true)}
          className="bg-[#003399] mb-8 shadow-xl shadow-blue-500/20"
        />

        <View className="space-y-4 mb-20">
          {workOrders.length > 0 ? (
            workOrders.map((wo, index) => (
              <WorkOrderCard key={wo.id} wo={wo} index={index} isDark={isDark} />
            ))
          ) : (
            <View className="py-20 items-center">
              <ClipboardList size={48} color={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1} />
              <Text className="text-lg font-black text-slate-900 dark:text-white mt-4 tracking-tighter uppercase">No Work Orders</Text>
              <Text className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">Maintenance requests will appear here.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Raise Work Order Modal */}
      <Modal visible={isFormOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-[40px] p-8 h-[90%] border-t border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Raise Work Order</Text>
              <TouchableOpacity onPress={() => setIsFormOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700">
                <X size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-6">
                <AppInput 
                  label="Equipment ID / Name" 
                  placeholder="e.g. EQ-123 or Generator" 
                  value={equipmentId}
                  onChangeText={setEquipmentId}
                />
                
                <View className="flex-row gap-4">
                    <TouchableOpacity 
                    onPress={() => setType('internal')}
                    className={`flex-1 p-4 rounded-2xl border-2 items-center ${type === 'internal' ? (isDark ? 'border-blue-500 bg-blue-500/10' : 'border-[#003399] bg-blue-50') : (isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-50 bg-slate-50')}`}
                   >
                     <Hammer size={20} color={type === 'internal' ? (isDark ? '#60a5fa' : '#003399') : (isDark ? '#475569' : '#94a3b8')} />
                     <Text className={`text-[10px] font-black uppercase mt-2 ${type === 'internal' ? (isDark ? 'text-blue-400' : 'text-[#003399]') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>Internal</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                    onPress={() => setType('external')}
                    className={`flex-1 p-4 rounded-2xl border-2 items-center ${type === 'external' ? (isDark ? 'border-blue-500 bg-blue-500/10' : 'border-[#003399] bg-blue-50') : (isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-50 bg-slate-50')}`}
                   >
                     <Truck size={20} color={type === 'external' ? (isDark ? '#60a5fa' : '#003399') : (isDark ? '#475569' : '#94a3b8')} />
                     <Text className={`text-[10px] font-black uppercase mt-2 ${type === 'external' ? (isDark ? 'text-blue-400' : 'text-[#003399]') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>External</Text>
                   </TouchableOpacity>
                </View>

                <AppInput 
                  label="Priority" 
                  placeholder="Low, Medium, High" 
                  value={priority}
                  onChangeText={setPriority}
                />

                <AppInput 
                  label="Description of fault" 
                  placeholder="Describe the issue in detail..." 
                  multiline numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                />
                
                <AppButton title="Submit Work Order" onPress={handleSubmit} loading={formLoading} className="mt-4" />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function WorkOrderCard({ wo, index, isDark }: any) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
      case 'rejected': return isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700';
      case 'pending': return isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700';
      default: return isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'text-emerald-700 dark:text-emerald-400';
      case 'rejected': return 'text-red-700 dark:text-red-400';
      case 'pending': return 'text-amber-700 dark:text-amber-400';
      default: return 'text-blue-700 dark:text-blue-400';
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${wo.type === 'internal' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
               {wo.type === 'internal' ? <Hammer size={24} color={isDark ? '#60a5fa' : '#2563eb'} /> : <Truck size={24} color={isDark ? '#a78bfa' : '#7c3aed'} />}
            </View>
            <View>
              <Text className="text-base font-black text-slate-900 dark:text-white tracking-tight">#{wo.id} - {wo.equipment?.name || 'Equipment'}</Text>
              <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Raised: {format(new Date(wo.created_at), 'MMM do, yyyy')}
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={isDark ? '#334155' : '#cbd5e1'} />
        </View>

        <View className="flex-row items-center justify-between mt-2">
           <View className={`px-3 py-1 rounded-full ${getStatusColor(wo.status).split(' ')[0]}`}>
            <Text className={`text-[8px] font-black uppercase tracking-widest ${getStatusText(wo.status)}`}>{wo.status.replace('_', ' ')}</Text>
          </View>
          {wo.priority === 'High' && (
            <View className="flex-row items-center">
              <AlertCircle size={10} color="#ef4444" className="mr-1" />
              <Text className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">High Priority</Text>
            </View>
          )}
        </View>

        <View className="mt-4 border-t border-slate-50 dark:border-slate-800 pt-4">
           <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium italic" numberOfLines={2}>"{wo.description}"</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
