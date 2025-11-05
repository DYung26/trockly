import React, { useEffect, useState } from 'react';
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
import { Button } from '../reusables/PostButton';
import { OTPModal } from '../reusables/OTPModal';
import { Profile } from '../types';
import { colors } from '../constants/theme';
import { SPACING } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';
import { CustomInput } from '../reusables/CustomInput';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';


interface CompleteProfileProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
  onContinue: () => void;
}

export const CompleteProfile: React.FC<CompleteProfileProps> = ({ 
  profile, 
  onUpdate, 
  onContinue 
}) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [userName, setUserName] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');

  useEffect(() => {
    onUpdate({
        ...profile,
        phoneNumber,
        username: userName,
        bio
    });
  }, [phoneNumber, userName, bio]);
 

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
        const selectedImage = result.assets[0];
        
        onUpdate({ 
          ...profile, 
          photo: selectedImage.uri 
        });
      }
    } catch (error) {
      console.log('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      setShowOTP(false);
      onContinue();
    } else {
     alert('Please enter a valid 4 digit-OTP');
    }
  };

  const isFormValid = phoneNumber.trim() !== '';

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
         <View style={styles.phoneContainer}>
          <CustomInput
           label="Phone Number"
           value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
           />
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
           onChangeText={setBio}
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
          onPress={() => setShowOTP(true)} 
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