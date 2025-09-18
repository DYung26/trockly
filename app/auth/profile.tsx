import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { radius, spacing } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';
import { useRouter } from 'expo-router';

interface CompleteProfileScreenProps {
  onSkip?: () => void;
  onComplete?: (profileData: ProfileData) => void;
}

interface ProfileData {
  username: string;
  bio: string;
  categories: string[];
  tradingRadius: string;
}

type SelectedImageFile = {
      uri: string;
  type: string;
  name: string;
} | null;

const categories = [
  'Electronics', 'Books', 'Plants', 'Food',
  'Services', 'Art', 'Tools', 'Furniture', 'Toys'
];

const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({
  onComplete,
}) => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('John');
  const [bio, setBio] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Electronics']);
  const [tradingRadius, setTradingRadius] = useState<string>('');
    const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<SelectedImageFile>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onBack = () => {
     router.back();
  };


   const pickImage = async () => {
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
     setTempProfileImage(selectedImage.uri);
     setSelectedImageFile({
        uri: selectedImage.uri,
        type: selectedImage.type || "image/jpeg",
        name: selectedImage.fileName || "/profice-circle.png"
     });
   }
    } catch (error) {
       console.log('Error picking image:', error);
       alert('Error, Failed to pick Image. Please try again.');
    }
  };

  const removeImage = () => {
      setTempProfileImage(null);
    setSelectedImageFile(null);
  };


  const handleComplete = () => {
    const profileData: ProfileData = {
      username,
      bio,
      categories: selectedCategories,
      tradingRadius,
    };
    onComplete?.(profileData);
    console.log('Profile completed:', profileData);
    router.push('/auth/premium');
  };

  const isFormValid = username.trim().length > 0;


const renderProfileImage = () => {
  return (
    <View style={styles.profileWrapper}>
      <View style={styles.profilePictureContainer}>
        {/* Base circle background */}
        <Image 
          source={require('../../assets/images/generic-avatar.png')}
          style={styles.profileCircleImage}
        />

        {/* Uploaded image overlay */}
        {tempProfileImage && (
          <Image 
            source={{ uri: tempProfileImage }}
            style={[styles.profileCircleImage, styles.profileOverlay]}
          />
        )}

        {/* Camera Icon (show only if no image yet) */}
        {!tempProfileImage && (
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={pickImage}
          >
            <Image 
              source={require('../../assets/images/sola-camera.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        )}

        {/* Cancel Button (show only if image is selected) */}
        {tempProfileImage && (
          <TouchableOpacity
            style={styles.cancelImageButton}
            onPress={removeImage}
          >
            <Text style={styles.cancelImageText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === "ios" ? "padding" : undefined}
         keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
        {/* Title */}
        <View style={styles.titleContainer}>
          <ThemedText variant='heading' style={styles.title}>Complete your profile</ThemedText>
          <ThemedText variant='description' style={styles.subtitle}>Let others know who you are</ThemedText>
        </View>

        {renderProfileImage()}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <ThemedText variant='subheading' style={styles.inputLabel}>Username</ThemedText>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="John"
              placeholderTextColor={colors.grey900}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <ThemedText 
             variant='subheading' 
             style={styles.inputLabel}>
                Short Bio (optional)
            </ThemedText>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself"
              placeholderTextColor={colors.grey300}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Interested Categories */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Interested Categories (Max 3)</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategories.includes(category) && styles.categoryTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Trading Radius */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Trading Radius</Text>
            <TextInput
              style={styles.textInput}
              value={tradingRadius}
              onChangeText={setTradingRadius}
              placeholder="Max 5km"
            />
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Complete Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            !isFormValid && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={[
            styles.completeButtonText,
            !isFormValid && styles.completeButtonTextDisabled
          ]}>
            Send Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.xxl,
    backgroundColor: colors.shadowWhite,
    borderWidth: 1,
    borderColor: colors.deepWhite
  },
  backArrow: {
    fontSize: 20,
    color: colors.baseBlack,
  },
  skipButton: {
    padding: spacing.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sxl,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  profileWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profilePictureContainer: {
   position: 'relative',
  width: 120,
  height: 120,
  justifyContent: 'center',
  alignItems: 'center',
},
profileCircleImage: {
 width: 120,
  height: 120,
  borderRadius: radius.xl6,
  resizeMode: 'cover',
},
profileOverlay: {
  ...StyleSheet.absoluteFillObject,  
  borderRadius: radius.xl6,
},
cameraIcon: {
 position: 'absolute',
  top: 5,     
  right: 5,
  backgroundColor: colors.white,
  borderRadius: radius.xl,
  padding: 5,
  elevation: 3,
},

cancelImageButton: {
  position: 'absolute',
  top: 5,
  right: 5,
  backgroundColor: colors.error,
  borderRadius: radius.lg,
  paddingHorizontal: spacing.xs,
  paddingVertical: 2,
},
cancelImageText: {
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: "SpaceGrotesk_700Bold",
},
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  textInput: {
    paddingHorizontal: spacing.flg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    fontFamily: "SpaceGrotesk_700Bold",
    color: colors.black,
  },
  bioInput: {
    height: 80,
    paddingTop: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: spacing.flg,
    paddingVertical: radius.sm,
    borderRadius: radius.lmd,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.lightBlue,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  categoryChipSelected: {
    backgroundColor: colors.blue100,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 12,
    color: colors.nationBlue,
    fontWeight: '400',
    fontFamily: "SpaceGrotesk_700Bold",
  },
  categoryTextSelected: {
    color: colors.nationBlue,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sxl,
    paddingTop: spacing.sm,
  },
  completeButton: {
    backgroundColor: colors.nationBlue,
    paddingVertical: spacing.flg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: "SpaceGrotesk_700Bold",
    fontWeight: '600',
  },
  completeButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default CompleteProfileScreen;