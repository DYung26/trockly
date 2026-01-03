export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: 'trockler'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    statusCode: number;
    message: string;
    data: User & {
      accessToken: string;
    };
}

export interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
}

export interface AuthContextType {
    user: User | null;
    accessToken: string |  null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupRequest) => Promise<AuthResponse>;
    verifyEmail: (email: string, otp: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resetPassword: (email: string, newPassword: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export interface VerifyEmailResponse {
    statusCode: number;
    message: string;
    data?: {
        isVerified: boolean;
    }
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
   statusCode: number;
   message: string;
   data?: {
    token?: string;
   };
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    otp: string;
}

export interface ResetPasswordResponse {
    statusCode: number;
    message: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    statusCode: number;
    message: string;
    data?: {
     id: string;
     userId: string;
     otp: string;
     createdAt: string;
     expiresAt: string;
    };
}