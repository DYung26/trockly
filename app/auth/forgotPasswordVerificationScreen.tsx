import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';
import { FONT_SIZES } from '../constants/typography';
import { useAuth } from '../context/AuthContext';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import AuthButton from '../reusables/AuthButton';
import { showErrorToast } from '../utils/toast';

const ForgotPasswordVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const { verifyOtp } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) return;

    setIsLoading(true);
    try {
     await verifyOtp(email, otpCode);
      
      // Navigate to reset password screen
      router.push({
        pathname: '/auth/reset-password',
        params: { email, otpCode } // Pass otpCode 
      });
    } catch (error: any) {
     showErrorToast(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isVerifyDisabled = otp.some((digit) => !digit) || isLoading;

  const maskedEmail = email || 'gol***th@gmail.com';

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

          {/* OTP Card */}
          <View style={styles.otpCard}>
            {/* Back Button and Title */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <ThemedText variant="subheading">Forgot Password</ThemedText>
            </View>

            {/* Instructions */}
            <ThemedText variant="instructions" style={styles.instructions}>
              Enter the 4-digit code we sent to{'\n'}
              <ThemedText variant="instructions">{maskedEmail}</ThemedText> to verify your email
            </ThemedText>

            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Verify Button */}
            <AuthButton
              title="Verify"
              onPress={handleVerify}
              disabled={isVerifyDisabled || isLoading}
              loading={isLoading}
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
  scrollContent: {
    flexGrow: 1,
  },
   content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING['4xl'],
    marginBottom: SPACING['2xl'],
  },
  otpCard: {
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING['3xl'],
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors.white,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: colors.blue,
    borderWidth: 2,
  },
  supportContainer: {
   flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING['3xl'],
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

export default ForgotPasswordVerificationScreen;