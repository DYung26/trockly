import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedText from '../reusables/ThemedText';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import { radius, spacing } from '../constants/layout';

interface LocationPermissionScreenProps {
  onEnterManually?: () => void;
  onSkip?: () => void;
}

const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onEnterManually,
  onSkip,
}) => {
    const router = useRouter();

    const onBack = () => {
      router.back();
    }

    const onAllowLocation = () => {
       router.push('/auth/location-access')
    }
  return (
    <SafeAreaView style={styles.container}>
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
          {/* You can replace this with your actual image */}
          <View style={styles.illustrationPlaceholder}>
             <Image 
               source={require('../../assets/images/explore-skit.png')}
               style={{ width: 302.13, height: 216.16}}
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

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.allowButton}
          onPress={onAllowLocation}
        >
          <Text style={styles.allowButtonText}>Allow Location Access</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.manualButton}
          onPress={onEnterManually}
        >
          <Text style={styles.manualButtonText}>Enter manually</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <View style={styles.footer}>
        <ThemedText variant='caption' style={styles.footerText}>
          Your location is only used to show nearby Trades and is never shared with other users without your permission.
        </ThemedText>
      </View>
    </SafeAreaView>
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
  skipText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xfxl,
    marginVertical: spacing.xfxl,
  },
  illustrationWrapper: {
    position: 'relative',
    width: 302.13,
    height: 216.16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.sxl,
    marginBottom: spacing.xfxl,
  },
  title: {
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    marginBottom: spacing.lg,
  },
  allowButton: {
    backgroundColor: colors.nationBlue,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  allowButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  manualButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  manualButtonText: {
    color: colors.lightGrey,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
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