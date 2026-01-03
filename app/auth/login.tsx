// screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../reusables/ThemedText';
import AuthButton from '../reusables/AuthButton';
import { colors } from '../constants/theme';
import { CustomInput } from '../reusables/CustomInput';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DividerWithText from '../reusables/DividerLine';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { showErrorToast } from '../utils/toast';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const isLoginDisabled = () => {
    return !email.trim() || !password.trim();
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Validate form
    const errors = validateLoginForm(email, password);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstError = Object.values(errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);

      // Navigate to onboarding or home after successful login
      router.replace('/post-account/onboarding');
    } catch (error: any) {
     showErrorToast(
      error.message || 'Invalid email or password. Please try again.'
     );
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: 'email' | 'password') => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/mask-group.png')}
              style={styles.logoImage}
            />
            <ThemedText variant="h1">Welcome Back!</ThemedText>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <CustomInput
                label="Email"
                placeholder="E.g golibefelath@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearFieldError('email');
                }}
                error={validationErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <CustomInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError('password');
                }}
                error={validationErrors.password}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#777A84"
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <ThemedText variant="h5">Forgot password?</ThemedText>
            </TouchableOpacity>

            {/* Login Button */}
            <AuthButton
              title="Log In"
              onPress={handleLogin}
              disabled={isLoginDisabled() || isLoading}
              loading={isLoading}
            />

            {/* Explore as Guest */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.push('/post-account/onboarding')}
            >
              <Text style={styles.guestButtonText}>
                Explore as guest <Text style={styles.arrow}>→</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <DividerWithText text="or log in with" />

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../assets/images/google-img.png')} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../assets/images/apple-img.png')} />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <ThemedText variant="h6">Don&apos;t have an account?</ThemedText>
              <TouchableOpacity onPress={() => router.push('/auth/create-account')}>
                <ThemedText variant="caption">Create an Account</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING['5xl'],
    marginBottom: SPACING['4xl'],
  },
  logoImage: {
    width: 146.87,
    height: 32,
  },
  formCard: {
    backgroundColor: colors.surfacePage,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['2xl'],
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: SPACING['2xl'],
  },
  guestButton: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  guestButtonText: {
    color: colors.blue,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline',
  },
  arrow: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 8,
    color: colors.blue,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: SPACING['2xl'],
  },
  socialButton: {
    width: 107,
    height: 49,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    alignItems: 'center',
  },
});

export default LoginScreen;