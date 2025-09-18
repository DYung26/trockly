import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import Input from '../reusables/Input';
import { useRouter } from 'expo-router';
import { radius, spacing } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';

type SignUpMethod = 'email' | 'phone';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
];

interface SignUpScreenProps {
  onSubmit?: (method: SignUpMethod, value: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSubmit,
}) => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<SignUpMethod>('email');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); 
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);

  const handleSubmit = () => {
    const value = selectedMethod === 'email' ? email : `${selectedCountry.dialCode}${phoneNumber}`;
    if (value.trim() && isChecked) {
      onSubmit?.(selectedMethod, value);
      console.log(`Submitting ${selectedMethod}:`, value);
    }
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => selectCountry(item)}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDialCode}>{item.dialCode}</Text>
      </View>
    </TouchableOpacity>
  );

  const isValidEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const isFormValid = () => {
    if (!isChecked) return false;
    if (selectedMethod === 'email') {
      return isValidEmail(email);
    } else {
      return phoneNumber.trim().length > 0;
    }
  };

  const getButtonText = () => {
    return selectedMethod === 'email' ? 'Send Magic Link' : 'Send Verification Code';
  };

  const getHelpText = () => {
    return selectedMethod === 'email' 
      ? "We'll send you a magic link to sign in"
      : "We'll send you a verification code via SMS";
  };

  const onBack = () => {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText variant='heading' style={styles.title}>Join Trocky</ThemedText>
        <ThemedText variant='description' style={styles.subtitle}>Choose your preferred way to sign up</ThemedText>

        {/* Method Selection Tabs */}
        <View style={styles.methodTabs}>
          <TouchableOpacity 
            style={[
              styles.methodTab, 
              selectedMethod === 'email' && styles.methodTabActive
            ]}
            onPress={() => setSelectedMethod('email')}
          >
            <Text style={[
              styles.methodTabText,
              selectedMethod === 'email' && styles.methodTabTextActive
            ]}>
              Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.methodTab, 
              selectedMethod === 'phone' && styles.methodTabActive
            ]}
            onPress={() => setSelectedMethod('phone')}
          >
            <Text style={[
              styles.methodTabText,
              selectedMethod === 'phone' && styles.methodTabTextActive
            ]}>
              Phone Number
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            {selectedMethod === 'email' ? 'Email' : 'Phone Number'}
          </Text>
          
          {selectedMethod === 'email' ? (
            <Input
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.lightGray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity 
                style={styles.countryCodeContainer}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor={colors.lightGray}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          )}
          
          <ThemedText variant='neutrals' style={styles.helpText}>{getHelpText()}</ThemedText>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
              {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By registering you agree to our{' '}
            <Text style={styles.linkText}>terms of service</Text> &{' '}
            <Text style={styles.linkText}>privacy policy</Text>
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={[
            styles.submitButtonText,
            !isFormValid() && styles.submitButtonTextDisabled
          ]}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Country</Text>
            <View style={styles.modalPlaceholder} />
          </View>
          
          <FlatList
            data={countries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            style={styles.countryList}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.xxl,
    backgroundColor: colors.shadowWhite,
    borderWidth: 1,
    borderColor: colors.deepWhite
  },
  backArrow: {
    fontSize: 20,
    color: colors.baseBlack,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  methodTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  methodTab: {
    flex: 1,
    paddingVertical: radius.lg,
    paddingHorizontal: spacing.flg,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8D8E8F'
  },
  methodTabActive: {
    backgroundColor: colors.nationBlue,
    borderColor: colors.lightBlue,
  },
  methodTabText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  methodTabTextActive: {
    color: colors.white,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
    marginBottom: 12,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  emailInput: {
    paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.setBlue,
    fontFamily: "SpaceGrotesk_700Bold",
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.black,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    backgroundColor:  colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    gap: 8,
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '400',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#6b7280',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.setBlue,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.lightGray,
  },
  helpText: {
    marginTop: 8,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.Neutrals600,
    justifyContent: 'center',
    fontFamily: "SpaceGrotesk_700Bold",
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.nationBlue,
    borderColor: colors.lightBlue,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.Neutrals600,
    fontFamily: "SpaceGrotesk_700Bold",
    lineHeight: 20,
  },
  linkText: {
    color: colors.nationBlue,
    textDecorationLine: 'underline',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sxl,
  },
  submitButton: {
    backgroundColor: colors.nationBlue,
    paddingVertical: spacing.flg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  submitButtonTextDisabled: {
    color: '#9ca3af',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.nationBlue,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  modalPlaceholder: {
    width: 60,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteItem,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryName: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 16,
    color: colors.darkGray,
  },
});

export default SignUpScreen;