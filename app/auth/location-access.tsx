import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../reusables/ThemedText';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import { radius, spacing } from '../constants/layout';
import Input from '../reusables/Input';

interface LocationPermissionScreenProps {
  onAllowLocation?: () => void;
  onSkip?: () => void;
}

const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onAllowLocation,
  onSkip,
}) => {
  const router = useRouter();
  const [location, setLocation] = useState<string>('');

  const onBack = () => {
    router.back();
  }

  const onSubmit = () => {
    // Simulate API 

    router.push('/auth/profile');
  }

  return (
    <KeyboardAvoidingView 
     style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // 👈 important
       keyboardVerticalOffset={80}>
    <SafeAreaView style={{ flex: 1}}>
     <ScrollView 
     contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <ThemedText variant='body'>Skip</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationWrapper}>
          <View style={styles.mainIllustration}>
            <Image 
               source={require('../../assets/images/trade-items.png')}
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText variant='heading' style={styles.title}>Find trades near you</ThemedText>
        <ThemedText variant='description' style={styles.description}>
          To show trades near you, we need to know your location
        </ThemedText>
      </View>

      {/* Location Input */}
      <View style={styles.inputContainer}>
        <ThemedText variant='subheading' style={styles.inputLabel}>Your Location</ThemedText>
        <Input
          style={styles.locationInput}
          value={location}
          onChangeText={setLocation}
          placeholderTextColor={colors.lightGray}
          placeholder="Address"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.allowButton}
          onPress={onSubmit}
        >
          <Text style={styles.allowButtonText}>Allow Location Access</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <View style={styles.footer}>
        <ThemedText variant='caption' style={styles.footerText}>
          Your location is only used to show nearby Trades and is never shared with other users without your permission.
        </ThemedText>
      </View>
     </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  skipButton: {
    padding: spacing.xs,
  },
  illustrationContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xfxl,
  },
  illustrationWrapper: {
    position: 'relative',
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.sxl,
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: 30,
  },
  inputLabel: {
    marginBottom: 8,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  locationInput: {
   paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.setBlue,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    fontFamily: "SpaceGrotesk_700Bold",
    color: colors.black,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    marginBottom: spacing.lg,
  },
  allowButton: {
   backgroundColor: colors.nationBlue,
    paddingVertical: spacing.flg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  allowButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "SpaceGrotesk_700Bold",
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: spacing.sxl,
    paddingBottom: spacing.sxl,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: "SpaceGrotesk_700Bold",
  },
});

export default LocationPermissionScreen;