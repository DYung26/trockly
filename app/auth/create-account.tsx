import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { colors } from '../constants/theme';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { CustomInput } from '../reusables/CustomInput';
import DividerWithText from '../reusables/DividerLine';
import ThemedText from '../reusables/ThemedText';
import { useSignup } from '../hooks/auth';
import { signupSchema } from '../schemas/auth.schema';
import AuthButton from '../reusables/AuthButton';

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}


const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();
 // const { signup } = useAuth();
  const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validatePasswords = () => {
    const errors: ValidationErrors = {};
    
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Password do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isSignupEnabled = () => {
  return (
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    agreeToTerms &&
    password === confirmPassword
  );
};

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword) {
      validatePasswords();
    }
  };

const handleCreateAccount = () => {
  const result = signupSchema.safeParse({
    firstName, lastName, email,  password, confirmPassword,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    setValidationErrors({
      firstName: errors.firstName?.[0],
      lastName: errors.lastName?.[0],
      email: errors.email?.[0],
      password: errors.password?.[0],
      confirmPassword: errors.confirmPassword?.[0],
    });
    return;
  }

  // Destructure out confirmPassword before sending
  const { confirmPassword: _, ...signupData } = result.data;
  signup({ ...signupData, role: 'trockler' });
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
           <ThemedText variant='h1'>Welcome to Trockly</ThemedText>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <CustomInput
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChangeText={(text) => { setFirstName(text); setValidationErrors(p => ({...p, firstName: undefined})); }}
                error={validationErrors.firstName} 
              />
            </View>
            <View style={styles.inputContainer}>
              <CustomInput
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChangeText={(text) => { setLastName(text); setValidationErrors(p => ({...p, lastName: undefined})); }}
                error={validationErrors.lastName} 
                />
             </View>
            {/* Email Input */}
            <View style={styles.inputContainer}>
             <CustomInput
              label="Email"
              placeholder="E.g golibefelath@gmail.com"
              value={email}
              onChangeText={(text) => { setEmail(text); setValidationErrors(p => ({...p, email: undefined})); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email} 
             />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <CustomInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => { setPassword(text); setValidationErrors(p => ({...p, password: undefined})); }}
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
             <CustomInput
              label="Confirm Password"
              placeholder="Enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (validationErrors.confirmPassword) {
                  setValidationErrors({});
                }
              }}
              onBlur={handleConfirmPasswordBlur}
              isPassword
              error={validationErrors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                     name={showConfirmPassword ? 'eye' : 'eye-off'}
                     size={20}
                     color="#777A84"
                    />
                  </TouchableOpacity>
                }
             />
            </View>

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                I agree to{' '}
                <Text style={styles.linkText}>Terms of service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>forbidden category policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <AuthButton
               title="Create an account"
               onPress={handleCreateAccount}
               disabled={!isSignupEnabled() || isPending}
               loading={isPending}
               style={[
                styles.createButton,
                isSignupEnabled() && styles.createButtonActive
               ]}
               textStyle={[
                styles.createButtonText,
                isSignupEnabled() && styles.createButtonTextActive
               ]}
            />

            {/* Explore as Guest */}
            <TouchableOpacity 
               style={styles.guestButton} 
               onPress={() => router.push('/post-account/onboarding')}>
              <Text style={styles.guestButtonText}>
                Explore as guest <Text style={styles.arrow}>→</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <DividerWithText text="or create an account with" />

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
               <Image 
                 source={require('../../assets/images/google-img.png')}
               />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('../../assets/images/apple-img.png')}
                />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <ThemedText variant='h6'>Already have an account?</ThemedText>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <ThemedText variant='caption'>Log In</ThemedText>
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
    paddingBottom: SPACING['4xl'],
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING['2xl'],
    paddingRight: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginRight: SPACING.md,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.priBlue,
  },
  checkmark: {
    color: colors.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: colors.textDisabled,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
    lineHeight: 20,
  },
  linkText: {
    color: colors.blue,
    fontWeight: FONT_WEIGHTS.normal,
  },
  createButton: {
    backgroundColor: '#E8E8EA',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonActive: {
    backgroundColor: '#4461F2',
  },
  createButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextActive: {
    color: '#FFFFFF',
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
    textDecorationLine: 'underline'
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
    borderColor: '#BBBDC0',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignupScreen;