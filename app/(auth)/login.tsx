import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import AppLogo from '../../components/AppLogo';

import api from '../../lib/api';
import { saveUser } from '../../lib/authStorage';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data.data;
      
      await saveUser(user, token);
      await setToken(token);
      setUser(user);
      
      router.replace('/(staff)/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mt-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 -ml-2 rounded-full active:bg-slate-100 dark:active:bg-slate-800"
            >
              <ArrowLeft size={24} color={Platform.OS === 'web' ? '#3b82f6' : '#003399'} />
            </TouchableOpacity>
            <AppLogo width={40} height={40} />
            <View className="w-10" />
          </View>

          <View className="mt-12 mb-10">
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(600)}
              className="text-3xl font-black text-slate-900 dark:text-white"
            >
              Welcome Back
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(300).duration(600)}
              className="text-slate-500 dark:text-slate-400 mt-2 text-lg"
            >
              Sign in to continue managing your portal.
            </Animated.Text>
          </View>

          {/* Error Message */}
          {error && (
            <Animated.View 
              entering={FadeInDown}
              className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 mb-6"
            >
              <Text className="text-red-600 dark:text-red-400 font-bold text-sm text-center">{error}</Text>
            </Animated.View>
          )}

          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            className="space-y-4"
          >
            <AppInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color="#003399" />}
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Lock size={20} color="#003399" />}
            />

            <TouchableOpacity className="self-end mb-6">
              <Text className="text-[#003399] dark:text-blue-500 font-bold text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <AppButton 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              className="mt-4"
            />
          </Animated.View>


          {/* Footer */}
          <View className="mt-auto py-8">
            <View className="flex-row justify-center items-center">
              <Text className="text-slate-500 dark:text-slate-400 text-base">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-[#003399] dark:text-blue-500 font-black text-base">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
