import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => (
  <View style={styles.progressContainer}>
    {Array.from({ length: totalSteps }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.progressBar,
          index <= currentStep ? styles.progressBarActive : styles.progressBarInactive,
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
   // marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 8,
  },
  progressBarActive: {
    backgroundColor: '#3247D5',
  },
  progressBarInactive: {
    backgroundColor: '#D9D9D9',
  },
});
