import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity, 
  Image,
  Alert,
  StyleSheet 
} from 'react-native';
import Button from '../reusables/PostButton';
//import { LOCATIONS } from '../constants/data';
import * as Location from 'expo-location';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { colors } from '../constants/theme';
import { CustomInput } from '../reusables/CustomInput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ThemedText from '../reusables/ThemedText';
import { FONT_SIZES } from '../constants/typography';

interface LocationFlowProps {
  selectedLocation: string;
  onSelect: (location: string) => void;
  onContinue: () => void;
}

const LocationFlow: React.FC<LocationFlowProps> = ({
  selectedLocation,
  onSelect,
  onContinue,
}) => {
  const [view, setView] = useState<'initial' | 'manual'>('initial');
  //const [showDropdown, setShowDropdown] = useState(false);

  const handleLocationAccess = async () => {
  try {
    // Request foreground location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      // Permission granted, get the location
      const location = await Location.getCurrentPositionAsync({});
      
      // You can reverse geocode to get the address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (address[0]) {
        // Set the location (you might want to format this)
        const locationString = `${address[0].city || address[0].district || address[0].subregion}, ${address[0].region}`;
        onSelect(locationString);
      }
      
      onContinue();
    } else if (status === 'denied') {
      // Permission denied
      Alert.alert(
        'Location Access Required',
        'Please enable location access in your device settings to find trades near you.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Location.enableNetworkProviderAsync() }
        ]
      );
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to get your location. Please try again or enter manually.');
  }
};

  // Manual view: Choose Your Neighbourhood
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity style={styles.backButtonTop} onPress={() => setView('initial')} activeOpacity={0.7}>
       <View style={styles.backView}>
         <Text style={styles.backArrow}>←</Text>
        <ThemedText variant='subheading'>Choose Your Neighbourhood</ThemedText>
       </View>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}>
        <ThemedText variant='subtitleSmall'>Select your neighbourhood to find nearby trades</ThemedText>

        <ThemedText variant='h3'>Enter  your neighbourhood</ThemedText>

      <CustomInput
        label="Address"
        placeholder='Enter your address e.g 123 Main St, Lagos'
        value={selectedLocation}
        onChangeText={onSelect}
        autoCapitalize='words'
      />
      </ScrollView>

     <View style={styles.fullWidthButtonWrapper}>
         <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={onContinue} disabled={!selectedLocation} />
      </View>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
screenContainerCenter: {
   paddingHorizontal: SPACING.xl,
    backgroundColor: colors.surfacePage,
    paddingTop: SPACING['3xl'],
}, 
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.surfacePage,
    paddingTop: SPACING['3xl'],
  },
  scrollContent: {
    paddingBottom: SPACING.md,
  },
  scrollContentCenter: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING['5xl'],
    paddingBottom: SPACING['7xl'],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  iconCircleLarge: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenter: {
    fontSize: SPACING['3xl'],
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleCenter: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 14,
  },
  backButtonTop: {
    paddingVertical: 10,
  },
  backView: {
   flexDirection: 'row',
   gap: 8
  },
  backArrow: {
    fontSize: 24,
    color: '#374151',
  },
  titleLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitleSmall: {
  
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 15,
    color: '#111827',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#6B7280',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: colors.white,
    marginTop: -5,
    marginBottom: 10,
    shadowColor: '#4242421C', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteBody,
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.base,
    color: colors.textBody,
  },
  fullWidthButtonWrapper: {
  marginHorizontal: -SPACING.xl,  
    backgroundColor: colors.white,
  },
  buttonAccess: {
    paddingVertical: 15,
  },
  buttonContainer: {
    paddingVertical: 15,
     paddingHorizontal: SPACING.xl,
    backgroundColor: colors.white
  },
  textButton: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS['5xl'],
    borderWidth: 1,
    borderColor: colors.borderColor
  },
  textButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default LocationFlow;