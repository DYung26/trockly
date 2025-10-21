import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
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
import CountryCodePicker, { Country } from '../components/CountryCodePicker';
import { countriesData } from '../data/world-country';

type LoginTab = 'phone' | 'email';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countriesData.find((c) => c.code === 'NG') || countriesData[0]
  );

  const isLoginDisabled = () => {
    if (activeTab === 'phone') {
      return !phoneNumber.trim() || !password.trim();
    }
    return !email.trim() || !password.trim();
  };

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Simulate api calls when ready
      // Full phone number: selectedCountry.dialCode + phoneNumber
      console.log('Phone:', selectedCountry.dialCode + phoneNumber);
      router.push('/post-account/onboarding');
    } catch (error: any) {
      console.error('Login Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
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
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
                onPress={() => setActiveTab('phone')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'phone' && styles.activeTabText,
                  ]}
                >
                  Phone Number
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'email' && styles.activeTab]}
                onPress={() => setActiveTab('email')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'email' && styles.activeTabText,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Phone Number Input with Country Code */}
            {activeTab === 'phone' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text> 
                <View style={styles.phoneInputWrapper}>
                  <CountryCodePicker
                    selectedCountry={selectedCountry}
                    onSelectCountry={handleCountrySelect}
                    defaultCountryCode="NG"
                  />
                  <View style={styles.phoneInputContainer}>
                    <CustomInput
                       label=""
                      placeholder="7076******"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Email Input */}
            {activeTab === 'email' && (
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Email"
                  placeholder="E.g golibefelath@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <CustomInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
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
            <TouchableOpacity style={styles.forgotPassword}>
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
            <TouchableOpacity style={styles.guestButton}>
              <Text style={styles.guestButtonText}>
                Explore as guest <Text style={styles.arrow}>→</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <DividerWithText text="or log in with" />

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require('../../assets/images/google-img.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../assets/images/apple-img.png')} />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <ThemedText variant="h6">Don&apos;t have an account?</ThemedText>
              <TouchableOpacity
                onPress={() => router.push('/auth/create-account')}
              >
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING['2xl'],
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: {
    backgroundColor: colors.surfacePrimary,
  },
  tabText: {
    fontSize: FONT_SIZES.base,
    color: colors.deepBlue,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
  },
  activeTabText: {
    fontSize: FONT_SIZES.base,
    color: colors.deepBlue,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    color: colors.textPrimary,
   // marginBottom: SPACING.sm,
    fontFamily: 'Poppins_500Medium',
    fontWeight: FONT_WEIGHTS.medium,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  phoneInputContainer: {
    flex: 1,
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
    alignItems: 'center',
  },
  signupText: {
    color: colors.textDisabled,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    fontFamily: 'Poppins_500Medium',
  },
});

export default LoginScreen;