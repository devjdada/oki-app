import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity
} from 'react-native';
import { Shield, Lock, Smartphone, FileText, ChevronRight, X, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import api from '../../../lib/api';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { WebView } from 'react-native-webview';

export default function SecuritySettingsScreen() {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const [tfaStatus, setTfaStatus] = useState<any>(null);
  const [loadingTfa, setLoadingTfa] = useState(true);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmingTfa, setConfirmingTfa] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    fetchTfaStatus();
  }, []);

  const fetchTfaStatus = async () => {
    try {
      setLoadingTfa(true);
      const response = await api.get('/user');
      const user = response.data.data;
      setTfaStatus({
        enabled: !!user.two_factor_confirmed_at,
        initialized: !!user.two_factor_secret && !user.two_factor_confirmed_at,
      });
    } catch (error) {
      console.error('Error fetching TFA status:', error);
    } finally {
      setLoadingTfa(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      setUpdatingPassword(true);
      await api.post('/staff/password', passwordData);
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      Alert.alert('Success', 'Password updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update password';
      Alert.alert('Error', message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleEnableTfa = async () => {
    try {
      setLoadingTfa(true);
      const response = await api.post('/staff/two-factor-enable');
      setQrData(response.data.data);
      setQrModalVisible(true);
      await fetchTfaStatus();
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize Two-Factor Authentication');
    } finally {
      setLoadingTfa(false);
    }
  };

  const handleConfirmTfa = async () => {
    if (!confirmationCode) return;

    try {
      setConfirmingTfa(true);
      await api.post('/staff/two-factor-confirm', { code: confirmationCode });
      setQrModalVisible(false);
      setConfirmationCode('');
      await fetchTfaStatus();
      Alert.alert('Success', 'Two-Factor Authentication enabled successfully');
    } catch (error) {
      Alert.alert('Error', 'Invalid confirmation code');
    } finally {
      setConfirmingTfa(false);
    }
  };

  const handleDisableTfa = async () => {
    Alert.alert(
      'Disable 2FA',
      'Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disable', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoadingTfa(true);
              await api.delete('/staff/two-factor-disable');
              await fetchTfaStatus();
              Alert.alert('Success', '2FA disabled');
            } catch (error) {
              Alert.alert('Error', 'Failed to disable 2FA');
            } finally {
              setLoadingTfa(false);
            }
          }
        }
      ]
    );
  };

  const handleViewRecoveryCodes = async () => {
    try {
      const response = await api.get('/staff/two-factor-recovery-codes');
      setRecoveryCodes(response.data.data.codes);
      setShowRecoveryModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recovery codes');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-slate-950"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center mb-4">
            <Lock size={32} color="#003399" />
          </View>
          <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase">Security</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Protect your account access</Text>
        </View>

        {/* Password Section */}
        <View className="mb-10">
          <Text className="text-lg font-black text-slate-900 dark:text-white uppercase mb-4">Update Password</Text>
          <AppInput
            label="Current Password"
            secureTextEntry
            value={passwordData.current_password}
            onChangeText={(text) => setPasswordData({ ...passwordData, current_password: text })}
            placeholder="••••••••"
          />
          <AppInput
            label="New Password"
            secureTextEntry
            value={passwordData.password}
            onChangeText={(text) => setPasswordData({ ...passwordData, password: text })}
            placeholder="Min 8 characters"
          />
          <AppInput
            label="Confirm New Password"
            secureTextEntry
            value={passwordData.password_confirmation}
            onChangeText={(text) => setPasswordData({ ...passwordData, password_confirmation: text })}
            placeholder="Repeat new password"
          />
          <AppButton
            title="Change Password"
            onPress={handleUpdatePassword}
            loading={updatingPassword}
            variant="secondary"
            className="mt-2"
          />
        </View>

        {/* 2FA Section */}
        <View className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-black text-slate-900 dark:text-white uppercase">Two-Factor Auth</Text>
            {tfaStatus?.enabled && (
              <View className="bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1 rounded-full flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                <Text className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 uppercase">Active</Text>
              </View>
            )}
          </View>
          
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Add an extra layer of security to your account using a mobile authenticator app like Google Authenticator or Microsoft Authenticator.
          </Text>

          {loadingTfa ? (
            <ActivityIndicator color="#003399" />
          ) : tfaStatus?.enabled ? (
            <View className="space-y-4">
              <View className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex-row items-start">
                <Shield size={20} color="#059669" />
                <View className="ml-3 flex-1">
                  <Text className="text-emerald-900 dark:text-emerald-300 font-bold text-sm">2FA is enabled</Text>
                  <Text className="text-emerald-700/70 dark:text-emerald-500/70 text-xs">Your account is using TOTP protection.</Text>
                </View>
              </View>
              
              <View className="flex-row space-x-2">
                <TouchableOpacity 
                   onPress={handleViewRecoveryCodes}
                   className="flex-1 bg-slate-50 dark:bg-slate-900 py-4 rounded-2xl flex-row items-center justify-center border border-slate-100 dark:border-slate-800"
                >
                  <FileText size={18} color="#475569" />
                  <Text className="ml-2 font-bold text-slate-600 dark:text-slate-400 uppercase text-xs tracking-widest">Recovery Codes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                   onPress={handleDisableTfa}
                   className="flex-1 bg-red-50 dark:bg-red-900/10 py-4 rounded-2xl flex-row items-center justify-center border border-red-100 dark:border-red-900/30"
                >
                  <Shield size={18} color="#ef4444" />
                  <Text className="ml-2 font-bold text-red-600 dark:text-red-400 uppercase text-xs tracking-widest">Disable 2FA</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 items-center">
              <Smartphone size={48} color="#94a3b8" strokeWidth={1} className="mb-4" />
              <Text className="text-center text-slate-600 dark:text-slate-400 text-sm font-medium mb-6">
                Recommended for all HOD and HR accounts to prevent unauthorized approvals.
              </Text>
              <AppButton
                title={tfaStatus?.initialized ? "Continue Setup" : "Enable 2FA Protection"}
                onPress={() => tfaStatus?.initialized ? setQrModalVisible(true) : handleEnableTfa()}
                className="w-full"
              />
            </View>
          )}
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-[40px] p-8 pb-12 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-slate-900 dark:text-white uppercase">Setup 2FA</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <View className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                  <X size={20} color="#64748b" />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                Scan the QR code below with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
              </Text>

              <View className="items-center mb-8">
                 {qrData?.svg ? (
                    <View className="w-64 h-64 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <WebView 
                        originWhitelist={['*']}
                        source={{ html: `
                          <style>body,html { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: white; height: 100%; }</style>
                          ${qrData.svg}
                        ` }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                 ) : (
                   <ActivityIndicator color="#003399" />
                 )}
                 <Text className="mt-4 font-bold text-[#003399] dark:text-blue-500 text-xs uppercase tracking-widest">Or enter key manually:</Text>
                 <Text className="text-slate-400 dark:text-slate-500 text-xs font-mono mt-1">{qrData?.url?.split('secret=')[1]?.split('&')[0] || '---'}</Text>
              </View>

              <AppInput
                label="Enter Confirmation Code"
                value={confirmationCode}
                onChangeText={setConfirmationCode}
                placeholder="6-digit code"
                keyboardType="number-pad"
                maxLength={6}
              />

              <AppButton
                title="Verify & Enable"
                onPress={handleConfirmTfa}
                loading={confirmingTfa}
                disabled={confirmationCode.length < 6}
                className="mt-2"
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Recovery Codes Modal */}
      <Modal
        visible={showRecoveryModal}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full">
            <View className="items-center mb-6">
              <View className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-3xl mb-4">
                <AlertTriangle size={32} color="#f59e0b" />
              </View>
              <Text className="text-xl font-black text-slate-900 dark:text-white uppercase">Recovery Codes</Text>
              <Text className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">
                Store these in a safe place. You can use them to access your account if you lose your device.
              </Text>
            </View>

            <View className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 mb-8">
              <View className="flex-row flex-wrap justify-center">
                {recoveryCodes.map((code, index) => (
                  <View key={index} className="w-[45%] m-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 items-center">
                    <Text className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{code}</Text>
                  </View>
                ))}
              </View>
            </View>

            <AppButton
              title="I've Saved Them"
              onPress={() => setShowRecoveryModal(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
