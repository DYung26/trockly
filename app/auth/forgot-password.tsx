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
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';
import { FONT_SIZES } from '../constants/typography';
import { SPACING } from '../constants/layout';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../reusables/AuthButton';
import { showErrorToast } from '../utils/toast';
import { CustomInput } from '../reusables/CustomInput';

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  //const [resetToken, setResetToken] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };


  const handleContinue = async () => {
     if (!email.trim()) {
       setEmailError('Email is required');
       return;
     }

     if (!validateEmail(email)) {
       setEmailError('Please enter a valid email address');
       return;
     }

     setIsLoading(true);
     try {
       await forgotPassword(email.trim().toLowerCase());
       //setResetToken(token);

       // Navigate 
       router.push({
        pathname: '/auth/forgotPasswordVerificationScreen',
        params: { email: email.trim().toLowerCase()  }
       });
     } catch (error: any) {
       showErrorToast(error.message || 'Failed to send OTP. Please try again.');
     } finally {
       setIsLoading(false);
     }
  };


  const handleBack = () => {
    router.back();
  };

  const isContinueDisabled = !email.trim() || !validateEmail(email);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
      <View style={styles.content}>
       {/* Logo */}
       <View style={styles.logoContainer}>
         <Image 
           source={require('../../assets/images/mask-group.png')}
         />
          <ThemedText variant='h1'>Welcome to Trockly</ThemedText>
       </View>
       
       {/* Form Card */}
       <View style={styles.formCard}>
          <View style={styles.header}>
           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            <ThemedText variant="subheading">Forgot Password</ThemedText>
         </View>

        <ThemedText variant="instructions">
          Enter your email so an OTP will be sent to reset{'\n'}
          your password
        </ThemedText>

         <View style={styles.inputWrapper}>
          <CustomInput
            label="Email"
            placeholder="E.g golibelth@gmail.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            />
        </View>
        {/* Continue Button */}
         <AuthButton
           title="Continue"
           onPress={handleContinue}
           disabled={isContinueDisabled || isLoading}
           loading={isLoading}
         />
       </View>
       <View>

        {/* Contact Support */ }
        <View style={styles.supportContainer}>
           <Text style={styles.supportText}>Need help? </Text>
          <TouchableOpacity>
            <Text style={styles.supportLink}>Contact support</Text>
         </TouchableOpacity>
      </View>
       </View>
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
  continueButton: {
    marginTop: SPACING.md,
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

export default ForgotPasswordScreen;