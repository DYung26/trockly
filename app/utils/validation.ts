import { ValidationErrors } from "../types/auth.types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+234[7-9][0-1]\d{8}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateSignupForm = (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // First Name validation
  if (!firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (!validateName(firstName)) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last Name validation
  if (!lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(lastName)) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone Number validation
  if (!phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!validatePhoneNumber(phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid Nigerian phone number (+234XXXXXXXXXX)';
  }

  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  } else {
    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  // Confirm Password validation
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (
  email: string,
  password: string
): { email?: string; password?: string } => {
  const errors: { email?: string; password?: string } = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};
