import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export default function AppButton({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  className,
  textClassName,
  icon,
}: AppButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const variants = {
    primary: 'bg-[#003399] shadow-lg shadow-blue-500/20',
    secondary: 'bg-slate-800',
    outline: 'bg-transparent border-2 border-[#003399]',
    ghost: 'bg-transparent',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-[#003399]',
    ghost: 'text-[#003399]',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      className={cn(
        'flex-row items-center justify-center py-4 px-6 rounded-2xl transition-all active:scale-[0.98]',
        variants[variant],
        (disabled || loading) && 'opacity-60',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#003399' : 'white'} />
      ) : (
        <View className="flex-row items-center space-x-2">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={cn(
              'text-lg font-bold text-center uppercase tracking-widest',
              textVariants[variant],
              textClassName
            )}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
