import { useRouter } from 'expo-router';
import { AlertTriangle, Trash2, X, ShieldAlert, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AppButton from '../../../components/AppButton';
import AppInput from '../../../components/AppInput';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function DangerZoneScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password to confirm deletion');

      return;
    }

    try {
      setDeleting(true);
      await api.delete('/staff/account', { data: { password } });
      
      // Successfully deleted
      await logout();
      setShowDeleteModal(false);
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently removed. We are sorry to see you go.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete account';
      Alert.alert('Error', message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
      <View className="items-center mb-10">
        <View className="w-20 h-20 rounded-[32px] bg-rose-50 items-center justify-center mb-4">
          <AlertTriangle size={32} color="#f43f5e" />
        </View>
        <Text className="text-2xl font-black text-slate-900 uppercase">Danger Zone</Text>
        <Text className="text-slate-500 font-medium tracking-tight">Irreversible account actions</Text>
      </View>

      <View className="bg-rose-50 rounded-[32px] p-6 border border-rose-100 flex-row items-start mb-8">
        <ShieldAlert size={24} color="#f43f5e" />
        <View className="ml-4 flex-1">
          <Text className="text-rose-900 font-bold text-lg leading-tight mb-1">Critical Warning</Text>
          <Text className="text-rose-700/70 text-sm leading-relaxed">
            Actions performed here are permanent and cannot be reversed. Please proceed with extreme caution.
          </Text>
        </View>
      </View>

      <View className="space-y-6">
        {/* Logout Option - Also added here for convenience */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm">
                <LogOut size={24} color="#64748b" />
            </View>
            <View className="ml-4">
              <Text className="font-bold text-slate-900 text-lg">Log Out</Text>
              <Text className="text-slate-500 text-xs font-medium">End your current session</Text>
            </View>
          </View>
          <View className="bg-white p-2 rounded-full border border-slate-100">
             <Text className="text-[#003399] font-black uppercase text-[10px]">Action</Text>
          </View>
        </TouchableOpacity>

        <View className="h-px bg-slate-100 my-4" />

        {/* Delete Account */}
        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          activeOpacity={0.7}
          className="bg-rose-50 p-6 rounded-[32px] border border-rose-100 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm">
                <Trash2 size={24} color="#f43f5e" />
            </View>
            <View className="ml-4">
              <Text className="font-bold text-rose-900 text-lg">Delete Account</Text>
              <Text className="text-rose-600/70 text-xs font-medium">Permanently remove all data</Text>
            </View>
          </View>
          <View className="bg-white p-2 rounded-full border border-rose-200">
             <Text className="text-rose-500 font-black uppercase text-[10px]">Delete</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="mt-12 p-8 border-2 border-dashed border-slate-100 rounded-[40px] items-center">
        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[4px] mb-4">Information</Text>
        <Text className="text-slate-400 text-xs text-center leading-relaxed font-semibold italic">
           Deleting your account will also remove your associated staff record, payroll access, and document history. This cannot be undone by HR.
        </Text>
      </View>

      <View className="h-20" />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/80 justify-center p-6"
        >
          <View className="bg-white rounded-[40px] p-8">
            <View className="items-center mb-6">
              <View className="bg-rose-100 p-5 rounded-[28px] mb-4">
                <ShieldAlert size={40} color="#e11d48" />
              </View>
              <Text className="text-2xl font-black text-slate-900 uppercase text-center">Are you sure?</Text>
              <Text className="text-center text-slate-500 text-sm mt-3 leading-relaxed">
                This action will delete your account forever. Enter your password to confirm your identity.
              </Text>
            </View>

            <AppInput
              label="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              containerClassName="mb-6"
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                }}
                className="flex-1 bg-slate-100 py-4 rounded-2xl items-center justify-center"
              >
                <Text className="font-bold text-slate-600 uppercase tracking-widest text-xs">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={deleting || !password}
                className={`flex-[2] bg-rose-600 py-4 rounded-2xl items-center justify-center ${deleting || !password ? 'opacity-50' : ''}`}
              >
                <Text className="font-bold text-white uppercase tracking-widest text-xs">Delete Permanently</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}
