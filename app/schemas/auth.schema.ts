import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .regex(/^\+234[7-9][0-1]\d{8}$/, 'Enter a valid Nigerian number (+234XXXXXXXXXX)'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[a-z])/, 'Must contain a lowercase letter')
      .regex(/(?=.*[A-Z])/, 'Must contain an uppercase letter')
      .regex(/(?=.*\d)/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[a-z])/, 'Must contain a lowercase letter')
      .regex(/(?=.*[A-Z])/, 'Must contain an uppercase letter')
      .regex(/(?=.*\d)/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

// Inferred Types
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type OtpSchemaType = z.infer<typeof otpSchema>;