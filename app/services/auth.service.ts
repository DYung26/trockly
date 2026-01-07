import apiClient from '../utils/apiClient';
import { 
    SignupRequest, 
    LoginRequest, 
    AuthResponse, 
    VerifyEmailRequest, 
    VerifyEmailResponse, 
    ForgotPasswordRequest, 
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    VerifyOtpRequest,
    VerifyOtpResponse
 } from '../types/auth.types';

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    if (!apiClient) {
      throw new Error('API client is not initialized');
    }
    
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    if (!apiClient) {
      throw new Error('API client is not initialized');
    }
    
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

   verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    if (!apiClient) {
     throw new Error('API client is not initialized');
    }

    const response = await apiClient.post<VerifyEmailResponse>('/auth/verify-email', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    if (!apiClient) {
      throw new Error('API client is not initialized');
    }

    const response = await apiClient.post<ForgotPasswordResponse>('/auth/password/forgot', data);
     return response.data
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    if (!apiClient) {
      throw new Error('API client is not initialized');
    }
    const response = await apiClient.post<VerifyOtpResponse>('/auth/password/verify-otp', data);
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    if (!apiClient) {
        throw new Error('API client is not initialized');
    }
    
    const response = await apiClient.post<ResetPasswordResponse>('/auth/password/reset', data);
    return response.data;
},
};
