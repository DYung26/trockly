import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SPACING } from '../constants/layout';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SuccessScreenProps {
  onComplete?: () => void;
}

interface Confetti {
  id: number;
  x: number;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
  shape: 'square' | 'circle' | 'ribbon';
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onComplete }) => {
  const router = useRouter();
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [confettiPieces, setConfettiPieces] = useState<Confetti[]>([]);

  // Confetti colors matching the design
  const confettiColors = [
    '#FF6B9D', // Pink
    '#FF4757', // Red
    '#4461F2', // Blue
    '#5DADE2', // Light Blue
    '#48C9B0', // Teal
    '#F1948A', // Light Red
  ];

  const generateConfetti = () => {
    const pieces: Confetti[] = [];
    const numPieces = 50;

    for (let i = 0; i < numPieces; i++) {
      const randomX = Math.random() * SCREEN_WIDTH;
      const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const randomSize = Math.random() * 8 + 4; // 4-12px
      const randomShape: 'square' | 'circle' | 'ribbon' = 
        ['square', 'circle', 'ribbon'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'ribbon';

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

    // Animate checkmark
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
      Animated.delay(500),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
     Animated.delay(500),
     Animated.timing(textOpacity, {
       toValue: 1,
       duration: 400,
       useNativeDriver: true,
     }),
    ]).start();

   
    setTimeout(() => {
        pieces.forEach((piece) => {
        const delay = Math.random() * 500;
        const duration = 2500 + Math.random() * 1000;
        const endY = SCREEN_HEIGHT + 80;

        Animated.parallel([
         Animated.timing(piece.y, {
            toValue: endY,
            duration,
            delay,
            useNativeDriver: true
         }),
         Animated.timing(piece.rotation, {
         toValue: Math.random() * 720 - 360,
         duration,
         delay,
         useNativeDriver: true
         }),
        ]).start();
        });
    }, 100);

    const timer = setTimeout(() => {
       router.replace('/post-account/onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

 
  const renderConfetti = () => {
    return confettiPieces.map((piece) => {
        const translateY = piece.y;
        const rotate = piece.rotation.interpolate({
            inputRange: [-360, 360],
            outputRange: ['-360deg', '360deg'],
        });

        let shapeStyle = {};
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
            width: piece.size * 0.5,
            height: piece.size * 2,
           borderRadius: piece.size * 0.25,
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
        )
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti Layer */}
      <View style={styles.confettiContainer} pointerEvents='none'>
        {renderConfetti()}
      </View>
 
      {/* Content Layer */}
      <View style={styles.content}>
        {/* Checkmark Circle */}
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

        {/* Success Text */}
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: textOpacity },
          ]}
        >
          <ThemedText variant='h1'>Account created successfully</ThemedText>
          <ThemedText variant='description'>
            Welcome aboard! You can now post your items and{'\n'}
            start swiping to discover trades near you.
          </ThemedText>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePrimary
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#24294F', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmarkIcon: {
    fontSize: 40,
    color: '#EFEEF0',
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
  },
});

export default SuccessScreen;