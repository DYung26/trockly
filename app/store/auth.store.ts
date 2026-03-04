import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth.types';


const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData: (user: User, token: string) => Promise<void>;
  clearAuthData: () => Promise<void>;
  loadAuthData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuthData: async (user, token) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true });
  },

  clearAuthData: async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  loadAuthData: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (token && userData) {
        set({
          accessToken: token,
          user: JSON.parse(userData),
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.error('Failed to load auth data:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));