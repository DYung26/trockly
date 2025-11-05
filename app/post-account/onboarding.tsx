import React, { useState, useRef } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import { Profile, Preference, Trade } from '../types/index';

import { PREFERENCES } from '../constants/data';

import { ProgressBar } from '../reusables/ProgressBar';

import LocationFlow from '../components/LocationFlow';
import CompleteProfile from '../components/CompleteProfile';
import SetPreferences from '../components/SetPreference';
import SetSwapDistance from '../components/SetSwapDistance';
import CreateTrade from '../components/CreateTrade';
import TradePreview from '../components/TradePreview';
import SuccessScreen from '../components/SuccessScreen';

const Onboarding: React.FC = () => {
  const swiperRef = useRef<Swiper>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // State management
  const [selectedLocation, setSelectedLocation] = useState('');
  const [profile, setProfile] = useState<Profile>({
    phoneNumber: '',
    username: '',
    bio: '',
  });
  const [preferences, setPreferences] = useState<Preference[]>(PREFERENCES);
  const [swapDistance, setSwapDistance] = useState(4);
  const [trade, setTrade] = useState<Trade>({
    category: '',
    title: '',
    photos: [],
    returnOffer: '',
    description: '',
    availability: { day: '', time: '' },
    location: '',
    useCurrentLocation: false,
  });
  const [showPreview, setShowPreview] = useState(false);

  // Handlers
  const handleNext = () => {
  if (swiperRef.current && currentStep < 4) { 
    swiperRef.current.scrollBy(1);
  }
};

  const handlePreferenceToggle = (id: string) => {
    const selectedCount = preferences.filter((p) => p.selected).length;
    const preference = preferences.find((p) => p.id === id);

    if (preference?.selected || selectedCount < 3) {
      setPreferences(preferences.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
    }
  };

  const handlePublish = () => {
    setShowSuccess(true);
  };

  const handleFinish = () => {
    // Navigate to home screen or reset flow
  };

  // Show success screen
  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SuccessScreen onFinish={handleFinish} />
      </SafeAreaView>
    );
  }

  // Main onboarding flow
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
     
      {!showPreview && (
       <View style={styles.progressWrapper}>
        <ProgressBar currentStep={currentStep} totalSteps={5} />
      </View>
      )}
     

     {showPreview ? (
       <TradePreview
            trade={trade}
            onPublish={handlePublish}
            onBack={() => setShowPreview(false)}
          />
     ): (
     <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        scrollEnabled={false}
        onIndexChanged={(index) => setCurrentStep(index)}
      >
        {/* Screen 1: Location Selection */}
        <LocationFlow
          selectedLocation={selectedLocation}
          onSelect={setSelectedLocation}
          onContinue={handleNext}
        />

        <CompleteProfile 
          profile={profile} 
          onUpdate={setProfile} 
          onContinue={handleNext}
         />

        <SetPreferences 
          preferences={preferences} 
          onToggle={handlePreferenceToggle} 
          onContinue={handleNext} 
          />

        <SetSwapDistance
          swapDistance={swapDistance}
          onDistanceChange={setSwapDistance}
          onContinue={handleNext}
        />
        <CreateTrade trade={trade} onUpdate={setTrade} onPreview={() => setShowPreview(true)} />
      </Swiper>
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