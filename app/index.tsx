import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ImageSourcePropType,
} from 'react-native';
import ThemedText from './reusables/ThemedText';
import { colors } from './constants/theme';
import { useRouter } from 'expo-router';
import { radius, spacing } from './constants/layout';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  illustration: ImageSourcePropType;
}



const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Local barter in Two clicks',
    description: 'Connect with neighbours and discover amazing trades happening right around you',
    illustration: require('../assets/images/local-barter.png'), 
  },
  {
    id: 2,
    title: 'Objects • Services • Foods',
    description: 'Trade anything from vintage books to fresh vegetables, or offer your skills and expertise',
    illustration: require('../assets/images/trade-items.png'), 
  },
  {
    id: 3,
    title: 'Trust: verified profiles & star ratings',
    description: 'Trade with confidence knowing every member is verified and rated by the community',
    illustration: require('../assets/images/verified-profiles.png'), 
  },
];

const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (slides.length - 1) * screenWidth,
        animated: true
      });
      setCurrentIndex(slides.length - 1);
    }
  };

  const handleCreateAccount = () => {
   router.push('/auth/create-account');
  };

  const handleExploreAsGuest = () => {
   router.push('/auth/explore-guest')
  };

  const handleLogin = () => {
   router.push('/auth/login')
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          <Image
            source={slide.illustration}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{slide.title}</ThemedText>
        <ThemedText style={styles.description}>{slide.description}</ThemedText>
      </View>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={styles.skipText}>Skip</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {renderPaginationDots()}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
          >
            <ThemedText style={styles.createAccountButtonText}>Create account</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={handleExploreAsGuest}
          >
            <ThemedText style={styles.exploreButtonText}>Explore as guest</ThemedText>
          </TouchableOpacity>
          
          {currentIndex === 2 && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <ThemedText style={styles.loginText}>
                Already have account? <ThemedText style={styles.loginLink}>Login</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.sm,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  skipButton: {
    padding: spacing.xs,
  },
  skipText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sxl,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: 331,
    height: 223.43,
  },
  decorativeElement: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  contentContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    fontFamily: "SpaceGrotesk_700Bold",
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: "SpaceGrotesk_700Bold",
    paddingHorizontal: spacing.sm,
  },
  bottomContainer: {
    paddingHorizontal: spacing.sxl,
    paddingBottom: spacing.xfxl,
    paddingTop: spacing.lg,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: 'transparent',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.lightBlue
  },
  paginationDotActive: {
    backgroundColor: colors.nationBlue,
    width: 10,
  },
  buttonContainer: {
    gap: 16,
  },
  createAccountButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "SpaceGrotesk_700Bold",
    fontWeight: '700',
  },
  exploreButton: {
    backgroundColor: 'transparent',
    paddingVertical: radius.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  exploreButtonText: {
    color: colors.lightGrey,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  loginLink: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: "SpaceGrotesk_700Bold",
  },
});

export default OnboardingScreen;