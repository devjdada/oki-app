import { format } from 'date-fns/format';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plane, 
  Stethoscope, 
  Briefcase, 
  FileText,
  ChevronRight,
  ArrowLeft,
  X,
  UserCheck,
  AlertCircle
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl, Modal, TextInput, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AppButton from '../../../components/AppButton';
import AppInput from '../../../components/AppInput';
import api from '../../../lib/api';

export default function LeaveScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [data, setData] = useState<any>(null);
  const [vouching, setVouching] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVouchingOpen, setIsVouchingOpen] = useState(false);
  const [selectedVouch, setSelectedVouch] = useState<any>(null);

  // Form states
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [vouchStaffId, setVouchStaffId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leavesRes, vouchRes] = await Promise.all([
        api.get('/staff/leaves'),
        api.get('/staff/leaves/vouching')
      ]);
      setData(leavesRes.data.data);
      setVouching(vouchRes.data.data);
    } catch (err) {
      console.error('Error fetching leave data:', err);
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

  const handleApplyLeave = async () => {
    if (!leaveType || !startDate || !endDate || !reason || !vouchStaffId) {
      alert('Please fill in all fields');

      return;
    }

    setFormLoading(true);

    try {
      await api.post('/staff/leaves', {
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        vouch_staff_id: vouchStaffId
      });
      setIsFormOpen(false);
      fetchData();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setVouchStaffId('');
  };

  const handleVouchAction = async (status: 'vouched' | 'rejected', remarks: string) => {
    if (!selectedVouch) {
return;
}

    try {
      await api.patch(`/staff/leaves/${selectedVouch.id}/vouch`, { status, remarks });
      setIsVouchingOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to process vouching request');
    }
  };

  if (loading && !data) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#003399" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white px-8 pt-8 pb-6 border-b border-slate-100 mb-6">
        <Text className="text-3xl font-black text-slate-900 tracking-tighter">Leave Management</Text>
        <Text className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest">Planning & Time-off</Text>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Grid */}
        <View className="flex-row flex-wrap justify-between mb-8">
          <BalanceCard label="Annual" value={data?.balance?.annual || 0} icon={<Plane size={18} color="#2563eb" />} color="blue" />
          <BalanceCard label="Sick" value={data?.balance?.sick || 0} icon={<Stethoscope size={18} color="#059669" />} color="emerald" />
          <BalanceCard label="Casual" value={data?.balance?.casual || 0} icon={<Calendar size={18} color="#d97706" />} color="amber" />
        </View>

        {/* Tab Switcher */}
        <View className="bg-white p-1.5 rounded-2xl flex-row mb-8 border border-slate-100">
          <TabButton 
            active={activeTab === 'requests'} 
            label="My Requests" 
            count={data?.leaves?.data?.length || 0} 
            onPress={() => setActiveTab('requests')} 
          />
          <TabButton 
            active={activeTab === 'vouching'} 
            label="Vouching" 
            count={vouching?.pending?.length || 0} 
            pulse={vouching?.pending?.length > 0}
            onPress={() => setActiveTab('vouching')} 
          />
        </View>

        {activeTab === 'requests' ? (
          <View className="space-y-4 mb-20">
            <AppButton 
              title="Apply for Leave" 
              icon={<Plus size={18} color="white" />}
              onPress={() => setIsFormOpen(true)}
              className="bg-[#EE1C25] mb-4"
            />
            {data?.leaves?.data?.length > 0 ? (
              data.leaves.data.map((leave: any) => (
                <LeaveListItem key={leave.id} leave={leave} />
              ))
            ) : (
              <EmptyState title="No active requests" subtitle="Your leave history will appear here." />
            )}
          </View>
        ) : (
          <View className="space-y-4 mb-20">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Pending Vouching</Text>
            {vouching?.pending?.length > 0 ? (
              vouching.pending.map((req: any) => (
                <VouchCard 
                  key={req.id} 
                  req={req} 
                  onPress={() => {
                    setSelectedVouch(req);
                    setIsVouchingOpen(true);
                  }} 
                />
              ))
            ) : (
              <EmptyState title="All caught up" subtitle="No pending vouching requests." />
            )}
          </View>
        )}
      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal visible={isFormOpen} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <Animated.View entering={FadeInUp} className="bg-white rounded-t-[40px] p-8 h-[90%]">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-black text-slate-900 tracking-tighter uppercase">New Leave Request</Text>
              <TouchableOpacity onPress={() => setIsFormOpen(false)} className="p-2">
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-6">
                 {/* Leave Type Select (Simplified) */}
                <AppInput 
                  label="Leave Type" 
                  placeholder="e.g. Annual, Sick, Casual" 
                  value={leaveType}
                  onChangeText={setLeaveType}
                />
                <View className="flex-row justify-between">
                  <View className="w-[48%]">
                    <AppInput label="Start Date" placeholder="YYYY-MM-DD" value={startDate} onChangeText={setStartDate} />
                  </View>
                  <View className="w-[48%]">
                    <AppInput label="End Date" placeholder="YYYY-MM-DD" value={endDate} onChangeText={setEndDate} />
                  </View>
                </View>
                <AppInput 
                  label="Covering Colleague ID" 
                  placeholder="Enter colleague ID" 
                  value={vouchStaffId}
                  onChangeText={setVouchStaffId}
                />
                <AppInput 
                  label="Reason" 
                  placeholder="Provide context..." 
                  multiline numberOfLines={4}
                  value={reason}
                  onChangeText={setReason}
                />
                
                <AppButton title="Submit Request" onPress={handleApplyLeave} loading={formLoading} className="mt-4" />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Vouching Decision Modal */}
      {selectedVouch && (
        <Modal visible={isVouchingOpen} animationType="fade" transparent={true}>
          <View className="flex-1 bg-black/60 items-center justify-center p-6">
            <View className="bg-white w-full rounded-[32px] p-8">
               <Text className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2">Acknowledge Cover</Text>
               <Text className="text-slate-500 font-bold mb-6">Request by {selectedVouch.staff?.user?.name}</Text>
               
               <View className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period</Text>
                  <Text className="text-sm font-bold text-slate-900">
                    {format(new Date(selectedVouch.start_date), 'MMM do')} - {format(new Date(selectedVouch.end_date), 'MMM do, yyyy')}
                  </Text>
               </View>

               <View className="flex-row justify-between gap-4 mb-4">
                  <TouchableOpacity 
                    onPress={() => handleVouchAction('vouched', 'I agree to cover')}
                    className="flex-1 bg-emerald-600 p-4 rounded-2xl items-center"
                  >
                    <CheckCircle2 size={24} color="white" />
                    <Text className="text-white font-black uppercase text-[10px] mt-2">Agree</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleVouchAction('rejected', 'I cannot cover')}
                    className="flex-1 bg-[#EE1C25] p-4 rounded-2xl items-center"
                  >
                    <XCircle size={24} color="white" />
                    <Text className="text-white font-black uppercase text-[10px] mt-2">Decline</Text>
                  </TouchableOpacity>
               </View>
               
               <AppButton title="Cancel" onPress={() => setIsVouchingOpen(false)} variant="secondary" />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function BalanceCard({ label, value, icon, color }: any) {
  const bgColors: any = { blue: 'bg-blue-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50' };

  return (
    <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm w-[31%]">
      <View className={`w-10 h-10 rounded-xl ${bgColors[color]} items-center justify-center mb-3`}>
        {icon}
      </View>
      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</Text>
      <Text className="text-2xl font-black text-slate-900">{value}</Text>
    </View>
  );
}

function TabButton({ active, label, count, pulse, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${active ? 'bg-[#003399]' : ''}`}
    >
      <Text className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-400'}`}>
        {label}
      </Text>
      {count > 0 && (
        <View className={`ml-2 px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-100'} ${pulse ? 'bg-red-500' : ''}`}>
          <Text className={`text-[8px] font-black ${active ? 'text-white' : 'text-slate-500'}`}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function LeaveListItem({ leave }: any) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-row items-center justify-between mb-4">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4 border border-slate-100">
           <Briefcase size={20} color="#003399" />
        </View>
        <View>
          <Text className="text-base font-black text-slate-900">{leave.type} Leave</Text>
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {format(new Date(leave.start_date), 'MMM do')} - {format(new Date(leave.end_date), 'MMM do')}
          </Text>
        </View>
      </View>
      <View className={`px-3 py-1 rounded-full ${getStatusColor(leave.status)}`}>
        <Text className="text-[8px] font-black uppercase tracking-widest">{leave.status}</Text>
      </View>
    </View>
  );
}

function VouchCard({ req, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-slate-900 items-center justify-center mr-3">
             <UserCheck size={18} color="white" />
          </View>
          <View>
            <Text className="text-sm font-black text-slate-900">{req.staff?.user?.name}</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.type} Leave</Text>
          </View>
        </View>
        <ChevronRight size={18} color="#cbd5e1" />
      </View>
      <View className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <Text className="text-[10px] text-slate-500 font-medium italic">"{req.reason}"</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ title, subtitle }: any) {
  return (
    <View className="py-20 items-center">
      <AlertCircle size={48} color="#475569" strokeWidth={1} />
      <Text className="text-lg font-black text-slate-900 mt-4 tracking-tighter uppercase">{title}</Text>
      <Text className="text-slate-400 text-sm font-medium mt-1">{subtitle}</Text>
    </View>
  );
}
