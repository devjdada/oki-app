import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import AppButton from '../components/AppButton';
import AppLogo from '../components/AppLogo';

import { getUser } from '../lib/authStorage';
import { useAuthStore } from '../store/auth';

export default function IntroScreen() {
  const router = useRouter();
  const { token, isLoading, setUser, setToken, setLoading } = useAuthStore();
  const floatingValue = useSharedValue(0);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user, token: storedToken } = await getUser();
        
        if (user && storedToken) {
          setUser(user);
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to init auth:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setToken, setLoading]);

  useEffect(() => {
    if (!isLoading && token) {
      router.replace('/(protected)/(staff)/dashboard');
    }
  }, [isLoading, token, router]);

  useEffect(() => {
    floatingValue.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatingValue.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style="auto" />
      <View className="flex-1 px-8 justify-between py-12">
        {/* Header - Logo */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800)}
          className="items-center mt-4"
        >
          <AppLogo width={60} height={60} />
        </Animated.View>

        {/* Hero Section */}
        <View className="items-center">
          <Animated.View 
            entering={FadeInUp.delay(400).duration(1000)}
            style={animatedImageStyle}
            className="w-full aspect-square max-h-[300px]"
          >
            <Image
              source={require('../assets/images/onboarding.png')}
              contentFit="contain"
              className="w-full h-full"
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(600).duration(800)}
            className="items-center mt-8"
          >
            <Text className="text-3xl font-black text-center text-[#003399] dark:text-blue-500 leading-tight">
              Streamline Your{"\n"}Business Workflow
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center mt-4 text-lg leading-6 px-4">
              Manage projects, track performance, and empower your team—all in one place.
            </Text>
          </Animated.View>
        </View>

        {/* Footer - Actions */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(800)}
          className="space-y-4 gap-4"
        >
          <AppButton 
            title="Get Started" 
            onPress={() => router.push('/(auth)/register')}
            className="w-full"
          />
          <AppButton 
            title="Log In" 
            variant="outline"
            onPress={() => router.push('/(auth)/login')}
            className="w-full"
          />
          
          <Text className="text-slate-400 text-center text-xs mt-4">
            By continuing, you agree to our Terms and Privacy Policy
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
