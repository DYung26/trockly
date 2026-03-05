import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import apiClient from "../lib/apiClient";
import { API_ENDPOINTS } from "../api/urls";
import { 
 SignupSchemaType, 
LoginSchemaType 
} from "../schemas/auth.schema";
import { 
   AuthResponse, 
   VerifyEmailResponse, 
   ForgotPasswordResponse, 
   VerifyOtpResponse,
   User,
   ResetPasswordResponse  
} from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { checkOnboardingStatus } from "./userProfile";

export function useSignup() {
  const router = useRouter();

  return useMutation({
  mutationFn: async (data: Omit<SignupSchemaType, 'confirmPassword'> & { role: 'trockler' }) => {
     const { confirmPassword, ...payload } = data as SignupSchemaType & { role: 'trockler' };
     const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.signup, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      showSuccessToast('Account created! Please verify your email.');
      setTimeout(() => {
        router.push({
          pathname: '/auth/OTPVerification',
          params: { email: variables.email },
        });
      }, 1500);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to create account.');
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const { setAuthData } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginSchemaType) => {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, data);
      return response.data;
    },
    onSuccess: async (response) => {
      const { accessToken, ...user } = response.data;
      await setAuthData(user as User, accessToken);

      showSuccessToast('Login Successful!');

      // Check if user has completed onboarding 
      const isOnboarded = await checkOnboardingStatus();
      
      if (isOnboarded) {
        router.replace('/Dashboard/dashboard');
      } else {
         router.replace('/post-account/onboarding');
      }
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Invalid email or password.');
    },
  });
}


export function useVerifyEmail() {
  const router = useRouter();
  const { setAuthData } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await apiClient.post<VerifyEmailResponse>(
        API_ENDPOINTS.auth.email.verify,
        data
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.data?.accessToken) {
        const { accessToken, ...user } = response.data;
        setAuthData(user as User, accessToken);
      }
      showSuccessToast('Email verified successfully!');
      setTimeout(() => router.push('/auth/success'), 1500);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Invalid OTP. Please try again.');
    },
  });
}


export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post<ForgotPasswordResponse>(
        API_ENDPOINTS.auth.password.forgot,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      showSuccessToast('OTP sent to your email.');
      router.push({
        pathname: '/auth/forgotPasswordVerificationScreen',
        params: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to send OTP.');
    },
  });
}


export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await apiClient.post<VerifyOtpResponse>(
        API_ENDPOINTS.auth.password.verifyOtp,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      showSuccessToast('OTP verified successfully!');
      router.push({
        pathname: '/auth/reset-password',
        params: { email: variables.email, otpCode: variables.otp },
      });
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'OTP verification failed.');
    },
  });
}


export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; newPassword: string; otp: string }) => {
      const response = await apiClient.post<ResetPasswordResponse>(
        API_ENDPOINTS.auth.password.reset,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast('Password reset successfully!');
      setTimeout(() => router.push('/auth/reset-success'), 1500);
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to reset password.');
    },
  });
}