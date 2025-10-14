import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import ThemedText from './reusables/ThemedText';
import { colors } from './constants/theme';
import { useRouter } from 'expo-router';
import { SPACING, BORDER_RADIUS } from './constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from './constants/typography';

import board1 from '../assets/images/target-board.png';
import onboard2 from '../assets/images/onboard-object.png';
import board3 from '../assets/images/onboard-trade.png';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: 'Local Barter\nin 2 Clicks',
      description:
        'Swap what you have for what you need, fast, simple, and seamless. Post an offer, match with neighbors, and trade in minutes.',
      image: board1,
      backgroundColor: '#3247D5',
    },
    {
      id: 2,
      title: 'Objects • Services\n• Food',
      description:
        'From books and clothes to repairs and homemade dishes, trade anything within your community. Discover new ways to share, save, and connect.',
      image: onboard2,
      backgroundColor: '#6B7FED',
    },
    {
      id: 3,
      title: 'Trade with Trust',
      description:
        'Every profile is verified by phone and rated ★★★★★ after each exchange. Meet safely in public spaces and build your trusted trade circle.',
      image: board3,
      backgroundColor: '#3247D5',
    },
  ];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: any) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.slide, { backgroundColor: slide.backgroundColor }]}
          >
            {/* IMAGE SECTION */}
            <View style={styles.imageWrapper}>
              <Image source={slide.image} style={styles.image} resizeMode="contain" />
            </View>

            {/* TEXT SECTION */}
            <View style={styles.textContainer}>
              <ThemedText variant='click'>{slide.title}</ThemedText>
              <ThemedText variant='clickDescription'>{slide.description}</ThemedText>

              {index === slides.length - 1 ? (
                <>
                <View style={styles.lastSlideButtons}>
                  <TouchableOpacity 
                    onPress={() => router.push('/auth/create-account')}
                    style={styles.createAccountButton}>
                    <Text style={styles.createAccountText}>Create account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push('/auth/login')}
                    style={styles.loginButton}>
                    <Text style={styles.loginText}>Log in</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  onPress={() => router.push('/post-account/onboarding')}
                  style={styles.guestButton}>
                    <Text style={styles.guestText}>Explore as guest</Text>
                  </TouchableOpacity>
                  </>
              ) : (
                <>
                 <View style={styles.swipeControls}>
                    <View style={styles.pagination}>
                    {slides.map((_, idx) => (
                      <TouchableOpacity key={idx} onPress={() => scrollToIndex(idx)}>
                        <View
                          style={[
                            styles.dot,
                            currentIndex === idx && styles.activeDot,
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                    <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => scrollToIndex(index + 1)}
                  >
                    <Text style={styles.nextButtonText}>→</Text>
                  </TouchableOpacity>
                 </View>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    height,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  },
  imageWrapper: {
    flex: 1.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.85,
    height: height * 0.45,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING['2xl'],
  },
  swipeControls : {
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     alignItems: 'center',
     paddingVertical: 10,
     marginTop: SPACING['2xl'],
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: colors.white,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 69,
    backgroundColor: colors.deepBlue,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.lightSurface,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 26,
    color: colors.white,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  lastSlideButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  createAccountButton: {
    paddingHorizontal: 20,
    paddingVertical: SPACING.lg,
    backgroundColor: '#7D8BEA',
    borderRadius: BORDER_RADIUS['5xl'],
  },
  createAccountText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: colors.greyWhite,
    fontFamily: 'Poppins_500Medium'
  },
  loginButton: {
    paddingVertical: SPACING.lg,
    width: 172.5,
    borderWidth: 1,
    borderColor: '#EFEEF0',
    borderRadius: BORDER_RADIUS['5xl'],
  },
  loginText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'center',
    color: colors.greyWhite,
    fontFamily: 'Poppins_500Medium'
  },
  guestButton: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    color: colors.surfacePrimary,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
