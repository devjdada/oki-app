import React from 'react';
import { Image, ImageStyle } from 'expo-image';
import { StyleProp } from 'react-native';

interface AppLogoProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ImageStyle>;
  className?: string;
}

export default function AppLogo({ width = 40, height = 40, style, ...props }: AppLogoProps) {
  return (
    <Image
      source={require('../assets/icon.svg')}
      style={[{ width: width as any, height: height as any }, style]}
      contentFit="contain"
      {...props}
    />
  );
}
