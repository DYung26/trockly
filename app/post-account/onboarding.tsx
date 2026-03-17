import React, { useState, useRef } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Profile, Preference } from '../types/index';
import Swiper from 'react-native-swiper';


import { PREFERENCES } from '../constants/data';

import { ProgressBar } from '../reusables/ProgressBar';

import LocationFlow from '../components/LocationFlow';
import CompleteProfile from '../components/CompleteProfile';
import SetPreferences from '../components/SetPreference';
import SetSwapDistance from '../components/SetSwapDistance';
import SuccessScreen from '../components/SuccessScreen';
import { useProfileStore } from '../store/profile.store';

const Onboarding: React.FC = () => {
  const swiperRef = useRef<Swiper>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { setAddress } = useProfileStore();

  // State management
  const [selectedLocation, setSelectedLocation] = useState('');
  const [profile, setProfile] = useState<Profile>({
    phoneNumber: '',
    username: '',
    bio: '',
  });
  const [preferences, setPreferences] = useState<Preference[]>(PREFERENCES);
  const [swapDistance, setSwapDistance] = useState(4);

  // Handlers
  const handleNext = () => {
    if (swiperRef.current && currentStep < 3) { 
    swiperRef.current.scrollBy(1);
  }
};

const handleBack = () => {
  if (swiperRef.current && currentStep > 0) {
     swiperRef.current.scrollBy(-1);
  }
};

  const handlePreferenceToggle = (id: string) => {
    const selectedCount = preferences.filter((p) => p.selected).length;
    const preference = preferences.find((p) => p.id === id);

    if (preference?.selected || selectedCount < 3) {
      setPreferences(preferences.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
    }
  };


  const handleFinish = () => {
    // Navigate to home screen or reset flow
  };



 return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />

    {showSuccess ? (
      <SuccessScreen onFinish={handleFinish} />
    ) : (
      <>
        <View style={styles.progressWrapper}>
          <ProgressBar currentStep={currentStep} totalSteps={4} />
        </View>

        <Swiper
          ref={swiperRef}
          loop={false}
          showsPagination={false}
          scrollEnabled={false}
          onIndexChanged={(index) => setCurrentStep(index)}
        >
          <LocationFlow
            selectedLocation={selectedLocation}
            onSelect={(val) => {
              setSelectedLocation(val);
              setAddress(val);
            }}
            onContinue={handleNext}
          />
          <CompleteProfile
            profile={profile}
            onUpdate={setProfile}
            onContinue={handleNext}
            onBack={handleBack}
          />
          <SetPreferences
            preferences={preferences}
            onToggle={handlePreferenceToggle}
            onContinue={handleNext}
            onBack={handleBack}
          />
          <SetSwapDistance
            swapDistance={swapDistance}
            onDistanceChange={setSwapDistance}
            onContinue={handleNext}
            onBack={handleBack}
          />
        </Swiper>
      </>
    )}
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  progressWrapper: {
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F1',
  },
});

export default Onboarding;