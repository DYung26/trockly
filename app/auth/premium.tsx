import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageSourcePropType,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { radius, spacing } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';
import { useRouter } from 'expo-router';

interface PremiumFeature {
  icon: ImageSourcePropType | ReactNode;
  title: string;
  description: string;
}

interface GoPremiumScreenProps {
  onSkip?: () => void;
  onStartTrial?: () => void;
  onMaybeLater?: () => void;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: require('../../assets/images/icon1.png'),
    title: 'Unlimited swipes',
    description: 'Swipe as many listings as you want',
  },
  {
    icon: require('../../assets/images/icon2.png'),
    title: 'Advanced filters',
    description: 'Find exactly what you\'re looking for',
  },
  {
    icon: require('../../assets/images/icon3.png'),
    title: 'Trade boosts',
    description: 'Get your items seen by more people',
  },
  {
    icon: require('../../assets/images/icon4.png'),
    title: 'Partner coupons',
    description: 'Exclusive discounts from local businesses',
  },
];

const GoPremiumScreen: React.FC<GoPremiumScreenProps> = ({
  onSkip,
  onStartTrial,
  onMaybeLater,
}) => {
 const router = useRouter();

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
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <ThemedText variant='body'>Skip</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationWrapper}>
            <View style={styles.mainIllustration}>
              <Image 
                source={require('../../assets/images/premium-image.png')}
              />
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <ThemedText variant='heading' style={styles.title}>Go Premium</ThemedText>
          <ThemedText variant='description' style={styles.subtitle}>
            Unlock exclusive features and get the most out of your trading experience
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {typeof feature.icon === 'number' ? (
                  <Image source={feature.icon} style={{ width: 20, height: 20,}} />
                ): (
                <Text>feature.icon</Text>
                )}
              </View>
              <View style={styles.featureContent}>
                <ThemedText variant='description' style={styles.featureTitle}>{feature.title}</ThemedText>
                <ThemedText variant='grey' style={styles.featureDescription}>{feature.description}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Trial Button */}
        <TouchableOpacity
          style={styles.trialButton}
          onPress={onStartTrial}
        >
          <Text style={styles.trialButtonText}>Try 7 Days Free Trial</Text>
        </TouchableOpacity>
        
        {/* Maybe Later Button */}
        <TouchableOpacity
          style={styles.laterButton}
          onPress={onMaybeLater}
        >
          <Text style={styles.laterButtonText}>Maybe Later</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <ThemedText variant='caption' style={styles.footerText}>
          No commitment required. Cancel anytime during your free trial. Full access to all premium features.
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
  content: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  illustrationWrapper: {
    position: 'relative',
    width: 120,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 32,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.sxl,
    marginBottom: spacing.xfxl,
  },
  title: {
    marginBottom: 5,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  featuresContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.xmd,
    backgroundColor: colors.blue100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
   // marginBottom: 1,
  },
  featureDescription: {
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sxl,
    paddingTop: spacing.sm,
  },
  trialButton: {
    backgroundColor: colors.nationBlue,
    paddingVertical: spacing.flg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 12,
  },
  trialButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  laterButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  laterButtonText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: "SpaceGrotesk_700Bold",
  },
});

export default GoPremiumScreen;