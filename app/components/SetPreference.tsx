import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Button from '../reusables/PostButton';
import { Preference } from '../types';
import { useProfileStore } from '../store/profile.store';
import { colors } from '../constants/theme';
import ThemedText from '../reusables/ThemedText';
import { SPACING } from '../constants/layout';

interface SetPreferencesProps {
  preferences: Preference[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  onBack?: () => void; 
}

const SetPreferences: React.FC<SetPreferencesProps> = ({ preferences, onToggle, onContinue, onBack }) => {
  const selectedCount = preferences.filter((p) => p.selected).length;
  const { setPreferences } = useProfileStore();

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backRow}
       >
       <Image
         source={require('../../assets/images/go-back.png')}
         style={styles.backImg}
       />
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#4F535A', fontFamily: 'Poppins_500Medium' }}>
         Go Back
       </Text>
      </TouchableOpacity>
      <View style={styles.headerSection}>
        <ThemedText variant='preferenceTitle'>Set Your Preference</ThemedText>
        <ThemedText variant='subtitle'>Pick maximum of 3 categories.</ThemedText>
      </View>

   <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
  <View style={styles.bubbleContainer}>
    {Array.from({ length: Math.ceil(preferences.length / 3) }).map((_, rowIndex) => (
      <View key={rowIndex} style={styles.bubbleRow}>
        {preferences.slice(rowIndex * 3, rowIndex * 3 + 3).map((pref, colIndex) => (
          <TouchableOpacity
            key={pref.id}
            style={[
              colIndex === 1 ? styles.bubbleCircle : styles.bubble,
              colIndex === 1 && styles.bubbleMiddle,
              pref.selected && styles.bubbleSelected,
            ]}
            onPress={() => {
              if (!pref.selected && selectedCount >= 3) return;
              onToggle(pref.id);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.bubbleText, pref.selected && styles.bubbleTextSelected]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {pref.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
</ScrollView>

      <View style={styles.fullWidthButtonWrapper}>
         <View style={styles.buttonContainer}>
        <Button 
          title="Continue"
          onPress={() => {
            const selected = preferences
             .filter((p) => p.selected)
             .map((p) => p.name);
             setPreferences(selected);
             onContinue();
          }} 
          disabled={selectedCount < 1} 
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: SPACING.xl,
    paddingBottom: 4,
  },
  backImg: {
   width: 17.5,
   height: 13.5,
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
    fontSize: 11,                   
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

export default SetPreferences;