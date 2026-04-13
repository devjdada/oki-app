import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Send, 
  Users, 
  Globe, 
  User as UserIcon,
  X
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import AppButton from '../../../../components/AppButton';
import api from '../../../../lib/api';
import { useAuthStore } from '../../../../store/auth';

export default function ComposeMessageScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resources, setResources] = useState<{ staff: any[], departments: any[] }>({ staff: [], departments: [] });
  
  const [form, setForm] = useState({
    target_type: 'individual' as 'individual' | 'department' | 'broadcast',
    receiver_id: '',
    department_id: '',
    subject: '',
    body: '',
    type: 'message' as 'message' | 'query'
  });

  const fetchResources = async () => {
    try {
      const response = await api.get('/messages/resources');
      setResources(response.data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      Alert.alert('Error', 'Failed to load recipients list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSend = async () => {
    if (!form.subject.trim() || !form.body.trim()) {
      Alert.alert('Validation Error', 'Please fill in both subject and message body.');

      return;
    }

    if (form.target_type === 'individual' && !form.receiver_id) {
      Alert.alert('Validation Error', 'Please select a recipient.');

      return;
    }

    if (form.target_type === 'department' && !form.department_id) {
      Alert.alert('Validation Error', 'Please select a department.');

      return;
    }

    try {
      setSending(true);
      await api.post('/messages', form);
      Alert.alert('Success', 'Message sent successfully!', [
        { text: 'OK', onPress: () => router.replace('/(protected)/(staff)/messages') }
      ]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#003399" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-100 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-slate-50"
            >
              <ChevronLeft size={20} color="#003399" />
            </TouchableOpacity>
            <Text className="text-xl font-black text-slate-900 tracking-tight">New Message</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-xl items-center justify-center bg-red-50"
          >
            <X size={20} color="#EE1C25" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-8 pt-6" showsVerticalScrollIndicator={false}>
          {/* Target Type Selector */}
          <View className="mb-10">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Choose Recipient Type</Text>
            <View className="flex-row justify-between">
              <TypeButton 
                label="Individual" 
                icon={<UserIcon size={18} color={form.target_type === 'individual' ? '#003399' : '#94a3b8'} />} 
                active={form.target_type === 'individual'} 
                onPress={() => setForm({ ...form, target_type: 'individual' })} 
              />
              <TypeButton 
                label="Department" 
                icon={<Users size={18} color={form.target_type === 'department' ? '#059669' : '#94a3b8'} />} 
                active={form.target_type === 'department'} 
                onPress={() => setForm({ ...form, target_type: 'department' })} 
                activeColor="emerald"
              />
              <TypeButton 
                label="Broadcast" 
                icon={<Globe size={18} color={form.target_type === 'broadcast' ? '#d97706' : '#94a3b8'} />} 
                active={form.target_type === 'broadcast'} 
                onPress={() => setForm({ ...form, target_type: 'broadcast' })} 
                activeColor="amber"
              />
            </View>
          </View>

          {/* Recipient Selection */}
          {form.target_type === 'individual' && (
            <Animated.View entering={FadeInDown} className="mb-8">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Staff Member</Text>
              <View className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 space-x-3">
                  {resources.staff.map((s) => (
                    <TouchableOpacity 
                      key={s.id}
                      onPress={() => setForm({ ...form, receiver_id: s.user_id })}
                      className={`px-5 py-3 rounded-xl border ${form.receiver_id === s.user_id ? 'bg-[#003399] border-[#003399]' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                      <Text className={`text-xs font-black ${form.receiver_id === s.user_id ? 'text-white' : 'text-slate-600'}`}>
                        {s.first_name} {s.surname}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Animated.View>
          )}

          {form.target_type === 'department' && (
            <Animated.View entering={FadeInDown} className="mb-8">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Department</Text>
              <View className="bg-emerald-50/30 rounded-2xl border border-emerald-100 overflow-hidden">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 space-x-3">
                  {resources.departments.map((d) => (
                    <TouchableOpacity 
                      key={d.id}
                      onPress={() => setForm({ ...form, department_id: d.id })}
                      className={`px-5 py-3 rounded-xl border ${form.department_id === d.id ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-emerald-100 shadow-sm'}`}
                    >
                      <Text className={`text-xs font-black ${form.department_id === d.id ? 'text-white' : 'text-emerald-700'}`}>
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Animated.View>
          )}

          {/* Subject & Body */}
          <View className="space-y-6 mb-12">
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</Text>
              <TextInput 
                placeholder="What is this regarding?"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm font-bold text-slate-900 shadow-sm"
                value={form.subject}
                onChangeText={(text) => setForm({ ...form, subject: text })}
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Body</Text>
              <TextInput 
                placeholder="Type your message here..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-sm font-medium text-slate-800 shadow-sm min-h-[200px]"
                value={form.body}
                onChangeText={(text) => setForm({ ...form, body: text })}
              />
            </View>
          </View>

          <AppButton 
            title={sending ? "Sending Message..." : "Send Message"}
            onPress={handleSend}
            loading={sending}
            icon={<Send size={18} color="white" />}
            className="mb-12"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TypeButton({ label, icon, active, onPress, activeColor = 'blue' }: any) {
  const activeBgs: any = {
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200'
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`w-[31%] p-5 rounded-[28px] items-center justify-center border-2 ${active ? activeBgs[activeColor] : 'bg-white border-slate-50 shadow-sm'}`}
    >
      <View className={`w-10 h-10 rounded-2xl items-center justify-center mb-3 ${active ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
        {icon}
      </View>
      <Text className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</Text>
    </TouchableOpacity>
  );
}
