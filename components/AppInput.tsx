import { clsx  } from 'clsx';
import type {ClassValue} from 'clsx';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import type { TextInputProps} from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export default function AppInput({
  label,
  error,
  icon,
  containerClassName,
  secureTextEntry,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View className={cn('space-y-2 mb-4', containerClassName)}>
      {label && (
        <Text className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </Text>
      )}
      
      <View
        className={cn(
          'flex-row items-center bg-white border-2 rounded-2xl px-4 py-1 transition-all',
          isFocused ? 'border-[#003399]' : 'border-slate-100',
          error ? 'border-red-500' : ''
        )}
      >
        {icon && <View className="mr-3 opacity-60">{icon}</View>}
        
        <TextInput
          className="flex-1 py-3 text-slate-900 text-base"
          placeholderTextColor="#94a3b8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility} 
            className="ml-2 p-1"
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={isFocused ? "#003399" : "#64748b"} />
            ) : (
              <Eye size={20} color={isFocused ? "#003399" : "#64748b"} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-xs ml-1 font-medium mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
