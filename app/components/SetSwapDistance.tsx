import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { Button } from '../reusables/PostButton';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';

interface SetSwapDistanceProps {
  swapDistance: number;
  onDistanceChange: (distance: number) => void;
  onContinue: () => void;
}

export const SetSwapDistance: React.FC<SetSwapDistanceProps> = ({
  swapDistance,
  onDistanceChange,
  onContinue,
}) => {
   const sliderWidth = Dimensions.get('window').width - 80;
   const stepWidth = sliderWidth / 4; 
   
   const thumbX = useRef(new Animated.Value((swapDistance - 1) * stepWidth)).current;
   const startX = useRef(0);

   const panResponder = useRef(
     PanResponder.create({
       onStartShouldSetPanResponder: () => true,
       onMoveShouldSetPanResponder: () => true,
       onPanResponderGrant: () => {
         // Store the starting X position when drag begins
         startX.current = (swapDistance - 1) * stepWidth;
       },
       onPanResponderMove: (_, gestureState) => {
         // Calculate new position, constrained to slider bounds
         const newX = startX.current + gestureState.dx;
         const constrainedX = Math.max(0, Math.min(sliderWidth, newX));
         thumbX.setValue(constrainedX);
       },
       onPanResponderRelease: (_, gestureState) => {
         // Calculate which step to snap to
         const finalX = startX.current + gestureState.dx;
         const constrainedX = Math.max(0, Math.min(sliderWidth, finalX));
         const closestStep = Math.round(constrainedX / stepWidth);
         const newDistance = closestStep + 1;
         
         // Update the distance state
         onDistanceChange(newDistance);

         Animated.spring(thumbX, {
           toValue: closestStep * stepWidth,
           useNativeDriver: false,
           friction: 7,
           tension: 40,
         }).start();
       },
     })
   ).current;

   useEffect(() => {
     Animated.spring(thumbX, {
       toValue: (swapDistance - 1) * stepWidth,
       useNativeDriver: false,
     }).start();
   }, [swapDistance]);

   const fillWidth = thumbX.interpolate({
     inputRange: [0, sliderWidth],
     outputRange: [0, sliderWidth],
     extrapolate: 'clamp',
   });

  return (
   <View style={styles.screenContainer}>
    <View style={styles.headerSection}>
      <ThemedText variant='preferenceTitle'>Set Your Swap Distance</ThemedText>
      <ThemedText variant='subtitle'>Choose how far you want to discover offers</ThemedText>
    </View>

    <View style={styles.contentContainer}>
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { width: sliderWidth }]}>
          <Animated.View
            style={[
              styles.sliderFill,
              {
                width: fillWidth,
              },
            ]}
          />
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.sliderThumb, { transform: [{ translateX: thumbX }] }]}
          />
        </View>

        <View style={[styles.sliderNumbers, { width: sliderWidth}]}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Text
              key={num}
              style={[
                styles.sliderNumber,
                swapDistance === num && styles.activeNumber,
              ]}
            >
              {num}
            </Text>
          ))}
        </View>
      </View>
    </View>

    <View style={styles.fullWidthButtonWrapper}>
      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={onContinue} />
      </View>
    </View>
  </View>
 )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.surfacePage,
  },
  headerSection: {
   paddingTop: SPACING.xl,
   paddingBottom: SPACING.xl
  },
  contentContainer: {
    flex: 1,
    paddingTop: SPACING['2xl'],
  },
  sliderContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING['4xl'],
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#3247D5',
    borderRadius: 100,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: colors.white,
    position: 'absolute',
    top: -10,
    borderWidth: 2,
    borderColor: '#3247D5',
  },
  sliderNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    paddingHorizontal: 0,
  },
  sliderNumber: {
    fontSize: 14,
    color: '#383A40',
    fontWeight: '500',
    width: 24,
    textAlign: 'center',
  },
  activeNumber: {
   color: '#383A40',
   fontWeight: '700'
  },
  fullWidthButtonWrapper: {
   marginHorizontal: -SPACING.xl,
   backgroundColor: colors.white,
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.white,
  },
});