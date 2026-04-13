import { User, Shield, Trash2, PenTool, CheckCircle2, AlertCircle } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureCanvas from 'react-native-signature-canvas';
import AppButton from '../../../components/AppButton';
import AppInput from '../../../components/AppInput';
import api, { API_URL } from '../../../lib/api';
import { useAuthStore } from '../../../store/auth';

export default function ProfileSettingsScreen() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.staff?.phone || '',
    address: user?.staff?.address || '',
  });

  const [staffData, setStaffData] = useState<any>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const signatureRef = useRef<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get('/staff/me');
      setStaffData(response.data.data);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: response.data.data.phone || '',
        address: response.data.data.address || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile details');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const response = await api.post('/staff/me', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      
      // Update local store user object if needed
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          staff: {
            ...user.staff,
            ...response.data.data
          } as any
        });
      }
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureSave = async (signature: string) => {
    try {
      setSignatureLoading(true);
      const response = await api.post('/staff/signature', { signature });
      
      // Update local state
      await fetchProfile();
      setShowSignaturePad(false);
      Alert.alert('Success', 'Signature updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save signature');
    } finally {
      setSignatureLoading(false);
    }
  };

  const handleDeleteSignature = async () => {
    Alert.alert(
      'Remove Signature',
      'Are you sure you want to remove your digital signature?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/staff/signature');
              await fetchProfile();
              Alert.alert('Success', 'Signature removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove signature');
            }
          }
        }
      ]
    );
  };

  if (profileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color="#003399" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-slate-950"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center border-4 border-blue-100 dark:border-blue-900/30 mb-4">
            <User size={48} color="#003399" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase">Profile Info</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Manage your professional identity</Text>
        </View>

        <View className="space-y-4">
          <AppInput
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            icon={<User size={20} color="#003399" />}
            placeholder="John Doe"
          />
          <AppInput
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            icon={<Shield size={20} color="#003399" />}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+234 ..."
            keyboardType="phone-pad"
          />
        </View>

        <AppButton
          title="Save Changes"
          onPress={handleUpdateProfile}
          loading={saving}
          className="mt-6"
        />

        <View className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <View className="flex-row items-center space-x-2 mb-4">
            <PenTool size={20} color="#003399" strokeWidth={2.5} />
            <Text className="ml-2 text-lg font-black text-slate-900 dark:text-white uppercase">Digital Signature</Text>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Your digital signature is used for official document vouching and HOD approvals.
          </Text>

          {staffData?.user?.signature_image ? (
            <View className="bg-slate-50 dark:bg-slate-900 rounded-[32px] p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 items-center relative">
              <Image
                source={{ 
                    uri: `${API_URL.replace('/api/v1', '')}/storage/${staffData.user.signature_image}`
                }}
                className="w-full h-32"
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={handleDeleteSignature}
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm"
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
              <View className="flex-row items-center mt-4">
                <CheckCircle2 size={14} color="#10b981" strokeWidth={3} />
                <Text className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Active Approved Signature</Text>
              </View>
            </View>
          ) : (
            <View>
              {showSignaturePad ? (
                <View className="h-[300px] border-2 border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
                  <SignatureCanvas
                    ref={signatureRef}
                    onOK={handleSignatureSave}
                    onEmpty={() => Alert.alert('Error', 'Please provide a signature')}
                    descriptionText="Sign Here"
                    clearText="Clear"
                    confirmText="Save Signature"
                    webStyle={`
                      .m-signature-pad--footer { display: none; }
                      body,html { height: 100%; }
                    `}
                  />
                  <View className="flex-row p-4 bg-slate-50 dark:bg-slate-900 space-x-2">
                    <TouchableOpacity 
                      onPress={() => signatureRef.current?.clearSignature()}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl items-center"
                    >
                      <Text className="font-bold text-slate-600 dark:text-slate-400">Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => signatureRef.current?.readSignature()}
                      className="flex-1 bg-[#003399] py-3 rounded-xl items-center"
                    >
                      <Text className="font-bold text-white">Capture</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowSignaturePad(true)}
                  className="bg-slate-50 dark:bg-slate-900 rounded-[32px] py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 items-center"
                >
                  <View className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-3">
                    <PenTool size={32} color="#003399" />
                  </View>
                  <Text className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Add Digital Signature</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View className="flex-row items-center mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
            <AlertCircle size={16} color="#003399" />
            <Text className="ml-3 flex-1 text-[10px] font-bold text-blue-900/60 dark:text-blue-400/60 uppercase leading-tight">
              Signatures must be clear and represent your official handwriting for legal validity within the company.
            </Text>
          </View>
        </View>
        
        <View className="h-20" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
