import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/theme';
import { useResetPassword } from '../hooks/auth';
import ThemedText from '../reusables/ThemedText';
import { resetPasswordSchema } from '../schemas/auth.schema';
import { FONT_SIZES } from '../constants/typography';
import { SPACING } from '../constants/layout';
import AuthButton from '../reusables/AuthButton';
import { CustomInput } from '../reusables/CustomInput';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const otpCode = params.otpCode as string;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

 

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (newPasswordError) {
      setNewPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  // const handleResetPassword = async () => {
  //   let hasError = false;

  //   // Validate new password
  //   if (!newPassword.trim()) {
  //     setNewPasswordError('Password is required');
  //     hasError = true;
  //   } else if (!validatePassword(newPassword)) {
  //     setNewPasswordError('Password must be at least 8 characters with letters and numbers');
  //     hasError = true;
  //   }

  //   // Validate confirm password
  //   if (!confirmPassword.trim()) {
  //     setConfirmPasswordError('Please confirm your password');
  //     hasError = true;
  //   } else if (newPassword !== confirmPassword) {
  //     setConfirmPasswordError('Passwords do not match');
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   setIsLoading(true);
  //   try {
  //    await resetPassword(email, newPassword, otpCode);


  //    setTimeout(() => {
  //     router.push('/auth/reset-success');
  //    }, 1500);
  //   } catch (error: any) {
  //      showErrorToast(error.message || 'Failed to reset password. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleResetPassword = () => {
    const result = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setNewPasswordError(errors.newPassword?.[0] || '');
      setConfirmPasswordError(errors.confirmPassword?.[0] || '');
      return;
    }
    resetPassword({ email, newPassword: result.data.newPassword, otp: otpCode });
  };
  const handleBack = () => {
    router.back();
  };

 const isResetDisabled =  
   !newPassword.trim() || 
   !confirmPassword.trim() || 
   newPassword !== confirmPassword || 
   isPending;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View 
          style={styles.content}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/mask-group.png')}
            />
            <ThemedText variant="h1">Welcome to Trockly</ThemedText>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Back Button and Title */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <ThemedText variant="subheading">Reset Password</ThemedText>
            </View>

             <ThemedText variant="instructions" style={styles.instructions}>
               Create a new password for your account
             </ThemedText>
            {/* New Password Input */}
            <View style={styles.inputWrapper}>
              <CustomInput
                label="New Password"
                placeholder="Enter password"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureText={!showNewPassword}
                error={newPasswordError}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons
                      name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <CustomInput
                label="Confirm New Password"
                placeholder="Enter password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureText={!showConfirmPassword}
                error={confirmPasswordError}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            {/* Reset Password Button */}
            <AuthButton
              title="Reset Password"
              onPress={handleResetPassword}
              disabled={isResetDisabled || isPending}
              loading={isPending}
            />
          </View>
        </View>

        {/* Contact Support - Fixed at bottom */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Need help? </Text>
          <TouchableOpacity>
            <Text style={styles.supportLink}>Contact support</Text>
          </TouchableOpacity>
        </View>
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
   content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING['4xl'],
    marginBottom: SPACING['2xl'],
  },
  formCard: {
    backgroundColor: colors.white,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['2xl'],
    flex: 1,
     marginHorizontal: SPACING.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  instructions: {
    marginBottom: SPACING['2xl'],
  },
  inputWrapper: {
    marginBottom: SPACING.md,
  },
  supportContainer: {
     flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
  },
  supportText: {
    fontSize: FONT_SIZES.base,
    color: colors.textSecondary,
  },
  supportLink: {
    fontSize: FONT_SIZES.base,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ResetPasswordScreen;