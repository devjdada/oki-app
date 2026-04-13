import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import storage from '../../../lib/storage';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export default function AppearanceSettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await storage.getItem('theme_preference');
      if (savedTheme) {
        setActiveTheme(savedTheme as any);
      }
    };
    loadTheme();
  }, []);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    setActiveTheme(theme);
    setColorScheme(theme);
    await storage.setItem('theme_preference', theme);
  };

  const themes = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Clean and bright for daylight',
      icon: Sun,
      color: '#003399',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      borderColor: 'border-[#003399]',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Easy on the eyes in the dark',
      icon: Moon,
      color: '#60a5fa',
      bgColor: 'bg-indigo-50',
      darkBgColor: 'dark:bg-indigo-900/20',
      borderColor: 'border-blue-500',
    },
    {
      id: 'system',
      label: 'System Default',
      description: 'Follows device settings',
      icon: Monitor,
      color: '#64748b',
      bgColor: 'bg-slate-50',
      darkBgColor: 'dark:bg-slate-800/40',
      borderColor: 'border-slate-400',
    }
  ];

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-950"
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="items-center mb-10"
      >
        <View className="w-20 h-20 rounded-[32px] bg-blue-50 dark:bg-blue-900/20 items-center justify-center mb-4">
          <Palette size={32} color={colorScheme === 'dark' ? '#60a5fa' : '#003399'} />
        </View>
        <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase text-center">Appearance</Text>
        <Text className="text-slate-500 dark:text-slate-400 font-medium tracking-tight text-center mt-1">
          Customize your visual experience
        </Text>
      </Animated.View>

      <Text className="text-lg font-black text-slate-900 dark:text-white uppercase mb-4 px-2 tracking-wider">
        Theme Selection
      </Text>

      <View className="space-y-4 gap-4">
        {themes.map((theme, index) => {
          const isActive = activeTheme === theme.id;
          const Icon = theme.icon;

          return (
            <Animated.View
              key={theme.id}
              entering={FadeInDown.delay(index * 100).duration(500)}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleThemeChange(theme.id as any)}
                className={`flex-row items-center p-5 rounded-[32px] border-2 transition-all ${isActive
                    ? `${theme.borderColor} ${theme.bgColor} ${theme.darkBgColor}`
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isActive ? `bg-white dark:bg-slate-800` : 'bg-slate-50 dark:bg-slate-800'
                  }`}>
                  <Icon size={24} color={isActive ? theme.color : '#94a3b8'} />
                </View>

                <View className="ml-4 flex-1">
                  <Text className={`text-base font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    {theme.label}
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {theme.description}
                  </Text>
                </View>

                {isActive && (
                  <Animated.View
                    entering={FadeInDown.duration(300)}
                    className="bg-[#003399] dark:bg-blue-500 p-1 rounded-full"
                  >
                    <Check size={14} color="#fff" strokeWidth={4} />
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(600)}
        className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 items-center"
      >
        <View className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none items-center justify-center mb-4">
          {activeTheme === 'dark' ? <Moon size={32} color="#60a5fa" /> : <Sun size={32} color="#003399" />}
        </View>
        <Text className="text-slate-900 dark:text-white font-black uppercase text-center mb-2">Interface Preview</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs text-center leading-relaxed">
          {activeTheme === 'system'
            ? "Your interface will automatically adapt to your device's display settings for a consistent experience."
            : `The application is currently optimized for ${activeTheme} mode to ensure the best accessibility and branded experience.`}
        </Text>

        <View className="flex-row mt-6 space-x-2 gap-2">
          <View className={`h-2 w-12 rounded-full ${activeTheme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'}`} />
          <View className="h-2 w-8 rounded-full bg-slate-300 dark:bg-slate-700" />
          <View className="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        </View>
      </Animated.View>

      <View className="h-24" />
    </ScrollView>
  );
}
