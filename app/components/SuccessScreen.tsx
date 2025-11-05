import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../reusables/PostButton';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';
import { useRouter } from 'expo-router';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SuccessScreenProps {
  onFinish: () => void;
}

interface Confetti {
  id: number;
  x: number;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
  shape: 'square' | 'circle' | 'ribbon' | 'star';
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onFinish }) => {
  const router = useRouter();
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);

  const confettiColors = [
    '#FF6B9D',
    '#FF4757',
    '#4461F2',
    '#5DADE2',
    '#48C9B0',
    '#F1948A',
    '#FFA07A',
    '#98D8C8',
  ];

  const generateConfetti = () => {
    const pieces: Confetti[] = [];
    const numPieces = 60;

    for (let i = 0; i < numPieces; i++) {
      const randomX = Math.random() * SCREEN_WIDTH;
      const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const randomSize = Math.random() * 10 + 6;
      const randomShape: 'square' | 'circle' | 'ribbon' | 'star' =
        ['square', 'circle', 'ribbon', 'star'][Math.floor(Math.random() * 4)] as 'square' | 'circle' | 'ribbon' | 'star';

      pieces.push({
        id: i,
        x: randomX,
        y: new Animated.Value(-50),
        rotation: new Animated.Value(0),
        color: randomColor,
        size: randomSize,
        shape: randomShape,
      });
    }

    return pieces;
  };

  useEffect(() => {
    const pieces = generateConfetti();
    setConfettiPieces(pieces);


    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();


    Animated.sequence([
      Animated.delay(600),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      pieces.forEach((piece) => {
        const delay = Math.random() * 500;
        const duration = 3000 + Math.random() * 1500;
        const endY = SCREEN_HEIGHT + 100;

        Animated.parallel([
          Animated.timing(piece.y, {
            toValue: endY,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() * 720 - 360,
            duration,
            delay,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 100);
  }, []);

  const renderConfetti = () =>
    confettiPieces.map((piece) => {
      const translateY = piece.y;
      const rotate = piece.rotation.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
      });

      if (piece.shape === 'star') {
        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confettiPiece,
              {
                left: piece.x,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          >
            <Text style={{ fontSize: piece.size, color: piece.color }}>★</Text>
          </Animated.View>
        );
      }

      let shapeStyle: any = {};
      if (piece.shape === 'circle') {
        shapeStyle = {
          width: piece.size,
          height: piece.size,
          borderRadius: piece.size / 2,
        };
      } else if (piece.shape === 'square') {
        shapeStyle = {
          width: piece.size,
          height: piece.size,
          borderRadius: 2,
        };
      } else {
        shapeStyle = {
          width: piece.size * 0.4,
          height: piece.size * 2.5,
          borderRadius: piece.size * 0.2,
        };
      }

      return (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            shapeStyle,
            {
              backgroundColor: piece.color,
              left: piece.x,
              transform: [{ translateY }, { rotate }],
            },
          ]}
        />
      );
    });

  return (
    <SafeAreaView  style={[styles.container, { backgroundColor: colors.surfacePrimary }]} edges={['top', 'bottom']}>
      <View style={styles.confettiContainer} pointerEvents="none">
        {renderConfetti()}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{ scale: checkmarkScale }],
              opacity: checkmarkOpacity,
            },
          ]}
        >
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </Animated.View>


        <Animated.View style={[styles.textSection, { opacity: textOpacity }]}>
          <ThemedText variant='successTitle'>Congratulations! Your first{'\n'}trade is live</ThemedText>
          <ThemedText variant='successSubtitle'>
            Start swiping now to find someone who wants your{'\n'}
            trade. The faster you connect, the faster you trade.
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.buttonWrapper, { opacity: textOpacity }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.textButton} onPress={onFinish}>
              <Text style={styles.successLinkText}>View my trade</Text>
            </TouchableOpacity>

            <View style={styles.primaryButton}>
              <Button title="Go to home" onPress={() => router.push('/Dashboard/dashboard')} />
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePrimary,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  confettiPiece: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['2xl'],
    zIndex: 2,
  },
  checkmarkContainer: {
    marginBottom: SPACING['3xl'],
  },
  checkmarkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkIcon: {
    fontSize: 45,
    color: colors.white,
    fontWeight: FONT_WEIGHTS.bold,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  textButton: {
    paddingVertical: 14,
    paddingHorizontal: SPACING['3xl'],
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS['5xl'],
  },
  primaryButton: {
    minWidth: 150,
  },
  successLinkText: {
    fontSize: FONT_SIZES.base,
    color: '#555965',
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: 'Poppins_500Medium',
  },
});

export default SuccessScreen;