import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

/**
 * Saves both user and token to storage
 */
export const saveUser = async (user, token) => {
  try {
    const userValue = JSON.stringify(user);
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(USER_KEY, userValue);
        if (token) localStorage.setItem(TOKEN_KEY, token);
      }
    } else {
      await AsyncStorage.setItem(USER_KEY, userValue);
      if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

/**
 * Retrieves both user and token from storage
 */
export const getUser = async () => {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return { user: null, token: null };
      const userStr = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      return { 
        user: userStr ? JSON.parse(userStr) : null, 
        token 
      };
    } else {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return { 
        user: userStr ? JSON.parse(userStr) : null, 
        token 
      };
    }
  } catch (e) {
    console.error('Error loading auth data:', e);
    return { user: null, token: null };
  }
};

/**
 * Removes both user and token from storage
 */
export const removeUser = async () => {
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } else {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};
