import { useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import AppLogo from '../../components/AppLogo';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');

      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');

      return;
    }

    setLoading(true);
    setError(null);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    console.log('Registered with:', name, email);
    alert('Registration successful (Mocked)');
    router.replace('/(auth)/login');
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

          <View className="mt-8 mb-6">
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(600)}
              className="text-3xl font-black text-slate-900 dark:text-white"
            >
              Create Account
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(300).duration(600)}
              className="text-slate-500 dark:text-slate-400 mt-2 text-lg"
            >
              Join the portal and start managing your workspace efficiently.
            </Animated.Text>
          </View>

          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            className="space-y-4"
          >
            <AppInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              icon={<User size={20} color="#003399" />}
              error={error && !name ? 'Name is required' : ''}
            />

            <AppInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color="#003399" />}
              error={error && !email ? 'Email is required' : ''}
            />

            <AppInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Lock size={20} color="#003399" />}
              error={error && !password ? 'Password is required' : ''}
            />

            <AppInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon={<Lock size={20} color="#003399" />}
              error={error && password !== confirmPassword ? 'Passwords do not match' : ''}
            />

            {error && !name && !email && !password && (
              <Text className="text-red-500 dark:text-red-400 text-sm font-medium mb-4">{error}</Text>
            )}

            <AppButton 
              title="Create Account" 
              onPress={handleRegister} 
              loading={loading}
              className="mt-4"
            />
          </Animated.View>

          {/* Footer */}
          <View className="mt-auto py-8">
            <View className="flex-row justify-center items-center">
              <Text className="text-slate-500 dark:text-slate-400 text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-[#003399] dark:text-blue-500 font-black text-base">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
