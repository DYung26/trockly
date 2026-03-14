import React, { useState } from 'react';
import {
 View, 
 Text, 
 ScrollView, 
 TouchableOpacity, 
 Image, 
 StyleSheet, 
 KeyboardAvoidingView,
 Platform,
 TouchableWithoutFeedback,
 Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../reusables/PostButton';
import { OTPModal } from '../reusables/OTPModal';
import { Profile } from '../types';
import { colors } from '../constants/theme';
import { SPACING } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';
import { CustomInput } from '../reusables/CustomInput';
import { useProfileStore } from '../store/profile.store';
import { Ionicons } from '@expo/vector-icons';
import CountryCodePicker, { Country } from './CountryCodePicker';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { countriesData } from '../data/world-country';
import { showErrorToast } from '../utils/toast';


interface CompleteProfileProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
  onContinue: () => void;
}

 const CompleteProfile: React.FC<CompleteProfileProps> = ({ 
  profile, 
  onUpdate, 
  onContinue 
}) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userName, setUserName] = useState(profile.username || '');
  const [phoneNumber, setPhoneNumberLocal] = useState(profile.phoneNumber || '');
  const [bio, setBioLocal] = useState(profile.bio || '');
  const { setPhoneNumber, setUsername, setBio, setPhoto } = useProfileStore();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
     countriesData.find((c) => c.code === 'NG') || countriesData[0]
  );

  
 const validatePhoneNumber = (input: string) => {
  const trimmed = input.trim();
  const regex = /^([7-9][0-1][0-9]{8})$/; 
  if (!regex.test(trimmed)) {
    setPhoneError('Phone number must start with second digit and be 10 digits after country.');
    return false;
  }
  setPhoneError(null);
  return true;
};
 

  const handlePhotoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('📸 Photo selected:', asset.uri);
        console.log('📸 mimeType:', asset.mimeType);
        console.log('📸 fileSize:', asset.fileSize);
        onUpdate({ ...profile, photo: asset.uri });
        setPhoto(asset.uri, asset.mimeType ?? 'image/jpeg', asset.fileSize ?? 0);
      }
    } catch (error) {
     showErrorToast('Failed to pick image. Please try again.');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      setPhoneNumber(`${selectedCountry.dialCode}${phoneNumber}`);
      setShowOTP(false);
      onContinue();
    } else {
     showErrorToast('Please enter a valid 4 digit-OTP');
    }
  };

  const isFormValid = userName.trim() !== '';

  return (
   <KeyboardAvoidingView
     style={{ flex: 1 }}
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.screenContainer}>
      <ScrollView 
       contentContainerStyle={styles.scrollContent} 
       showsVerticalScrollIndicator={false}>
        <ThemedText variant='profileTitle'>Complete Your Trockler Profile</ThemedText>

        {/* Profile Photo Section */}
        <View style={styles.profilePhotoContainer}>
          {!profile.photo ? (
            <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.7}>
             <Image
               source={require('../../assets/images/profile-circle.png')}
               style={styles.profileUploadImage}
               resizeMode='contain'
              />
            </TouchableOpacity>
          ): (
           <View style={styles.uploadPreviewContainer}>
             <Image source={{ uri: profile.photo }} style={styles.uploadedImagePreview} />
             <TouchableOpacity
               style={styles.cancelIconContainer}
               onPress={() => onUpdate({ ...profile, photo: '' })}
               activeOpacity={0.7}
             >
              <Ionicons name="close-circle" size={28} color="#EF4444" />
             </TouchableOpacity>
           </View>
          )}
        </View>

        {/* Phone Number Input */}  
         {/* <View style={styles.phoneContainer}>
          <CustomInput
           label="Phone Number"
           value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
           />
         </View> */}

         <View style={styles.phoneContainer}>
           <Text style={{ fontSize: 14, color: colors.textPrimary, fontFamily: 'Poppins_500Medium', marginBottom: 8 }}>
            Phone Number
           </Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <CountryCodePicker
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              defaultCountryCode="NG"
            />
            <View style={{ flex: 1}}>
             <CustomInput
              label=""
               placeholder="7076******"
              value={phoneNumber}
              onChangeText={(value) => {
                  setPhoneNumberLocal(value);
                  setPhoneNumber(value);
                if (value && !validatePhoneNumber(value)) {
                  setPhoneError('Please enter a valid phone number');
                } else {
                  setPhoneError('');
                }
              }}
              keyboardType="number-pad"
              error={phoneError || undefined}
              maxLength={10}
             />
            </View>
           </View>
         </View>

        {/* Username Input */}
         <View style={styles.phoneContainer}>
          <CustomInput
            label="Username (optional)"
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your username"
           prefix="@"
         />
         </View>

         {/* Bio Input */}
         <CustomInput
           label="Short Bio"
           value={bio}
           onChangeText={(text) => {
             setBioLocal(text);
             setBio(text);
           }}
           placeholder="Enter details about your self"
           multiline
           numberOfLines={4}
           maxLength={150}
         />
        <Text style={styles.characterCount}>
           {bio.trim() === '' ? 0 : bio.trim().split(/\s+/).length}/150 words
         </Text>
      </ScrollView>

      {/* Continue Button */}
     <View style={styles.fullWidthButtonWrapper}>
         <View style={styles.buttonContainer}>
        <Button 
          title="Continue" 
          onPress={() => {
            setUsername(userName);
            setBio(bio)
            if (phoneNumber.trim()) {
              // has phone number - show OTP modal 
              setShowOTP(true);
            } else {
              // no phone number - skip OTP and go next 
              onContinue();
            }
           }} 
          disabled={!isFormValid} 
        />
      </View>
     </View>

      {/* OTP Modal */}
      <OTPModal
        visible={showOTP}
        otp={otp}
        onOtpChange={handleOtpChange}
        onVerify={handleVerify}
        onClose={() => setShowOTP(false)}
        phoneNumber={`${selectedCountry.dialCode}${phoneNumber}`}
      />
    </View>
     </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.surfacePage,
    paddingTop: SPACING['3xl']
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
    marginTop: 10,
  },
  profileUploadImage: {
  width: 160,
  height: 160,
  alignSelf: 'center',
},

uploadPreviewContainer: {
  position: 'relative',
  alignSelf: 'center',
},
phoneContainer: {
  marginBottom: SPACING.xl
},
uploadedImagePreview: {
  width: 160,
  height: 160,
  borderRadius: SPACING['6xl'],
  borderWidth: 2,
  borderColor: colors.whiteSurface,
},

cancelIconContainer: {
  position: 'absolute',
  top: 5,           
  right: 5,  
  backgroundColor: colors.white,
  borderRadius: SPACING.xl,
  padding: SPACING.xs,    
  elevation: 5,  
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.3, 
  shadowRadius: 4,  
},
  characterCount: {
    fontSize: FONT_SIZES.xs,
    color: colors.priBlue,
    textAlign: 'right',
    marginTop: 10,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 10,
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


export default CompleteProfile;
