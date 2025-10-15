import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from '../reusables/PostButton';
import { Preference } from '../types';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';
import { SPACING } from '../constants/layout';

interface SetPreferencesProps {
  preferences: Preference[];
  onToggle: (id: string) => void;
  onContinue: () => void;
}

export const SetPreferences: React.FC<SetPreferencesProps> = ({ preferences, onToggle, onContinue }) => {
  const selectedCount = preferences.filter((p) => p.selected).length;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerSection}>
        <ThemedText variant='preferenceTitle'>Set Your Preference</ThemedText>
        <ThemedText variant='subtitle'>Pick maximum of 3 categories.</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.bubbleContainer}>
          {/* Row 1: Bike repair (left), Books (middle-UPPER-CIRCLE), Tools (right) */}
          <View style={styles.bubbleRow}>
            <TouchableOpacity
              style={[styles.bubble, preferences[0].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[0].selected && selectedCount >= 3) return;
                onToggle(preferences[0].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[0].selected && styles.bubbleTextSelected]}>
                {preferences[0].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubbleCircle, styles.bubbleMiddle, preferences[1].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[1].selected && selectedCount >= 3) return;
                onToggle(preferences[1].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[1].selected && styles.bubbleTextSelected]}>
                {preferences[1].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubble, preferences[2].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[2].selected && selectedCount >= 3) return;
                onToggle(preferences[2].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[2].selected && styles.bubbleTextSelected]}>
                {preferences[2].name}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Clothes (left), PC repair (middle-UPPER-CIRCLE), Babysitting (right) */}
          <View style={styles.bubbleRow}>
            <TouchableOpacity
              style={[styles.bubble, preferences[3].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[3].selected && selectedCount >= 3) return;
                onToggle(preferences[3].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[3].selected && styles.bubbleTextSelected]}>
                {preferences[3].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubbleCircle, styles.bubbleMiddle, preferences[4].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[4].selected && selectedCount >= 3) return;
                onToggle(preferences[4].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[4].selected && styles.bubbleTextSelected]}>
                {preferences[4].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubble, preferences[5].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[5].selected && selectedCount >= 3) return;
                onToggle(preferences[5].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[5].selected && styles.bubbleTextSelected]}>
                {preferences[5].name}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 3: Tutoring (left), Cleaning (middle-UPPER-CIRCLE), Surplus (right) */}
          <View style={styles.bubbleRow}>
            <TouchableOpacity
              style={[styles.bubble, preferences[6].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[6].selected && selectedCount >= 3) return;
                onToggle(preferences[6].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[6].selected && styles.bubbleTextSelected]}>
                {preferences[6].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubbleCircle, styles.bubbleMiddle, preferences[7].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[7].selected && selectedCount >= 3) return;
                onToggle(preferences[7].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[7].selected && styles.bubbleTextSelected]}>
                {preferences[7].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubble, preferences[8].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[8].selected && selectedCount >= 3) return;
                onToggle(preferences[8].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[8].selected && styles.bubbleTextSelected]}>
                {preferences[8].name}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 4: Homemade dishes (left), Dry goods (middle-UPPER-CIRCLE), Small appliances (right) */}
          <View style={styles.bubbleRow}>
            <TouchableOpacity
              style={[styles.bubble, preferences[9].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[9].selected && selectedCount >= 3) return;
                onToggle(preferences[9].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[9].selected && styles.bubbleTextSelected]}>
                {preferences[9].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubbleCircle, styles.bubbleMiddle, preferences[10].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[10].selected && selectedCount >= 3) return;
                onToggle(preferences[10].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[10].selected && styles.bubbleTextSelected]}>
                {preferences[10].name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bubble, preferences[11].selected && styles.bubbleSelected]}
              onPress={() => {
                if (!preferences[11].selected && selectedCount >= 3) return;
                onToggle(preferences[11].id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.bubbleText, preferences[11].selected && styles.bubbleTextSelected]}>
                {preferences[11].name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fullWidthButtonWrapper}>
         <View style={styles.buttonContainer}>
        <Button 
          title="Continue"
          onPress={onContinue} 
          disabled={selectedCount < 3} 
          />
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.surfacePage,
  },
  headerSection: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  bubbleContainer: {
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginBottom: SPACING['3xl'],
    paddingHorizontal: 5,
    gap: 15,
  },
  bubble: {
    width: 95,                        
    height: 95,                     
    borderRadius: 47.5,                 
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  bubbleCircle: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  bubbleMiddle: {
    marginBottom: 25,
  },
  bubbleSelected: {
    backgroundColor: '#D2DBF0',
    borderColor: '#B9C1F7',
    borderWidth: 2,
  },
  bubbleText: {
    fontSize: 14,                   
    color: '#555965',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    //lineHeight: 16,
  },
  bubbleTextSelected: {
    color: '#555965',
    fontWeight: '600',
  },
  fullWidthButtonWrapper: {
   marginHorizontal: -SPACING.xl,
   backgroundColor: colors.white,
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.white
  },
});