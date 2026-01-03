import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';
import { User, SignupRequest, AuthContextType } from '../types/auth.types';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        setAccessToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (response.statusCode === 200 && response.data) {
        const { accessToken: token, ...userData } = response.data;

        // Store token and user data
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

        setAccessToken(token);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to login. Please try again.'
      );
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      const response = await authService.signup(data);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast("Accout Created Successfully, Please verify your email.")
        return response;
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
         'Failed to create account. Please try again.';

         throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
  try {
    const response = await authService.verifyEmail({ email, otp });

    if (response.statusCode === 200 || response.statusCode === 201) {
      showSuccessToast("Email Verified successfully");
      return;
    } else {
      throw new Error(response.message || 'Email verification failed');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to verify email. Please try again.'
    );
  }
};

const forgotPassword = async (email: string): Promise<void> => {
    try {
    const response = await authService.forgotPassword({ email });

    if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast('OTP sent to your email');
        return;
        //return response.data?.token || '';
    } else {
      throw new Error(response.message || 'Failed to send OTP');
    }
    } catch (error: any) {
      const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      'Failed to send OTP. Please try again.';
    
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }
};

const verifyOtp = async (email: string, otp: string): Promise<void> => {
   try {
    const response = await authService.verifyOtp({ email, otp });
    if (response.statusCode === 200 || response.statusCode === 201) {
      showSuccessToast('OTP Verified successfully');
      return;
    } else {
      showErrorToast(response.message || 'OTP verification failed');
    }
   } catch (error: any) {
   const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error ||
            error.message || 
            'Failed to verify OTP. Please try again.';
        
        showErrorToast(errorMessage);
   }
}

const resetPassword = async (email: string, newPassword: string, otp: string): Promise<void> => {
    try {
     const response = await authService.resetPassword({ email, newPassword, otp  });

     if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast('Password reset successfully');
        return;
     } else {
      showErrorToast(response.message || 'Failed to reset password');
     }
    } catch (error: any) {
      const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      'Failed to reset password. Please try again.';

      showErrorToast(errorMessage);
    }
}

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  };


  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    signup,
    verifyEmail,
    forgotPassword,
    verifyOtp,
    resetPassword,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};