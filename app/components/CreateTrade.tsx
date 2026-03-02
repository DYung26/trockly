import React, { useState } from 'react';
import {
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
 } from 'react-native';
import Button from '../reusables/PostButton';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore } from '../store/offer.store';
import { useCreateOffer } from '../hooks/offer';
import type { LocalPhoto, OfferCategory } from '../types/offer.types';
import ThemedText from '../reusables/ThemedText';
import { CustomInput } from '../reusables/CustomInput';
import { SPACING, BORDER_RADIUS } from '../constants/layout';
import { colors } from '../constants/theme';
import {  DAYS  } from '../constants/data';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export const CATEGORIES: OfferCategory[] = ['object', 'service', 'food'];

interface CreateTradeProps {
  onPreview: () => void;
}

 const CreateTrade: React.FC<CreateTradeProps> = ({ 
 onPreview,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

 const TIMES = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM'
];

const {
  form,
  setCategory, setTitle, setDescription,
  setLocation, setUseCurrentLocation,
  setAvailabilityDay, setAvailabilityTime,
  addPhoto, removePhoto,
  addWant, removeWant, updateWant,
} = useOfferStore();

const { mutate: submitOffer, isPending } = useCreateOffer();



const handlePhotoAdd = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: false,
      ...(Platform.OS === 'ios' && {
        videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
      }),
    });

    if (!result.canceled && result.assets?.length > 0) {
      const img = result.assets[0];
      const photo: LocalPhoto = {
        uri: img.uri,
        mimeType: img.mimeType ?? 'image/jpeg',
        size: img.fileSize ?? 0,
        uploaded: false,
      };
      addPhoto(photo);
    }
  } catch {
    alert('Failed to pick image. Please try again.');
  }
};

 const handleRemovePhoto = (uri: string) => removePhoto(uri);

  const isFormValid = form.category && form.title && form.photos.length > 0 && form.availability.day;

  return (
    <KeyboardAvoidingView 
       style={{ flex: 1 }}
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
     <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText variant='preferenceTitle'>Create an Item</ThemedText>
        
        <View style={{ marginTop: 10 }}>
            <ThemedText variant='subtitle'>Post what you want to swap with other trackers</ThemedText>
        </View>

         {/* --- Category Dropdown --- */}
         <View style={styles.dropdownContainer}>
            <ThemedText variant='h3'>Categories</ThemedText>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setCategoryOpen(!categoryOpen)}
              activeOpacity={0.8}
            >
             <Text style={styles.dropdownText}>
                {form.category || 'Select Category'}
             </Text>
             <Ionicons
               name={categoryOpen ? 'chevron-up' : 'chevron-down'}
               size={20}
               color="#6B7280"
             />
            </TouchableOpacity>
            {categoryOpen && (
              <View style={styles.dropdownList}>
                {CATEGORIES.map((cat) => (
                 <TouchableOpacity
                   key={cat}
                   style={styles.dropdownItem}
                   onPress={() => {
                     setCategory(cat as OfferCategory);
                     setCategoryOpen(false);
                   }}
                 >
                  <Text style={styles.dropdownItemText}>{cat}</Text>
                 </TouchableOpacity>
                ))}
              </View>
            )}
         </View>

        {/* --- Title Input --- */}
         <CustomInput
           label="Title"
           value={form.title}
           onChangeText={(text) => setTitle(text)}
           placeholder="E.g A Home-Sewing Kit"
           maxLength={140}
         />

        {/* --- Add Trade Photos --- */}
       <View style={styles.inputContainer}>
        <View style={styles.photoHeaderRow}>
       <ThemedText variant='h3'>Add Trade Photos</ThemedText>
      {form.photos.length > 0 && (
      <TouchableOpacity 
        style={styles.uploadImagesButton} 
        onPress={handlePhotoAdd}
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={16} color="#3B82F6" />
        <Text style={styles.uploadImagesText}>Upload images</Text>
      </TouchableOpacity>
    )}
  </View>

  {form.photos.length === 0 ? (
    <TouchableOpacity style={styles.uploadBox} onPress={handlePhotoAdd}>
      <Image 
        source={require('../../assets/images/sect-action.png')}
        style={styles.actionIcon}
      />
      <ThemedText variant='uploadText'>Upload your images</ThemedText>
    </TouchableOpacity>
  ) : (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={{ marginTop: 12}}
      contentContainerStyle={{paddingRight: SPACING.md}} 
      >
      {form.photos.map((photo, index) => (
        <View key={index} style={styles.photoWrapper}>
          <Image source={{ uri: photo.uri }} style={styles.tradePhoto} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemovePhoto(photo.uri)}
          >
            <Ionicons name="close" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )}
</View>

         {/* --- Trade Description --- */ }
         <CustomInput
           label="Trade Description"
           value={form.description}
           onChangeText={(text) => setDescription(text)}
           placeholder="Share details about what you're offering..."
           maxLength={340}
           multiline
           numberOfLines={4}
         />
        <Text style={styles.characterCount}>{form.description.length}/340 words</Text>

        <ThemedText variant='h3'>What do you want in return?</ThemedText>

        {form.wants.map((want, index) => (
         <View key={want.id} style={{ marginBottom: 12 }}>
          <CustomInput
            label={`Want ${index + 1}`}
            value={want.title}
            onChangeText={(text) => updateWant(want.id, { title: text })}
            placeholder="E.g MacBook Air, Cleaning Service..."
          />

         <CustomInput
           label="Description (optional)"
           value={want.description}
           onChangeText={(text) => updateWant(want.id, { description: text })}
           placeholder="Any specific details..."
          />

        {form.wants.length > 1 && (
         <TouchableOpacity onPress={() => removeWant(want.id)}>
          <Text style={{ color: '#EF4444', fontSize: 13, marginTop: 4 }}>Remove</Text>
         </TouchableOpacity>
        )}
      </View>
    ))}

     <TouchableOpacity onPress={addWant} style={{ marginBottom: 20 }}>
       <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '600' }}>+ Add another want</Text>
     </TouchableOpacity>


         {/* Availability */ }
         <ThemedText variant='inputLabel'>AVAILABILITY</ThemedText>
        <View style={styles.availabilityWrapper}>
         {/* Day Dropdown */}
         <View style={styles.availabilityCol}>
           <Text style={styles.availabilityLabel}>Day</Text>
           <TouchableOpacity
             style={styles.dropdownButtonSmall}
             onPress={() => {
                setDayOpen(!dayOpen)
                setTimeOpen(false); 
             }}
           >
            <Text style={styles.dropdownText}>
                {form.availability.day || 'Select'}
            </Text>
            <Ionicons
             name={dayOpen ? 'chevron-up' : 'chevron-down'}
             size={20}
             color="#777A84"
            />
           </TouchableOpacity>

           {dayOpen && (
            <View style={styles.dropdownOverlay}>
              <ScrollView
               style={styles.dropdownScroll}
               nestedScrollEnabled={true}
               showsVerticalScrollIndicator={true}
              >
               {DAYS.map((day) => (
                 <TouchableOpacity
                   key={day}
                   style={styles.dropdownItem}
                   onPress={() => {
                     setAvailabilityDay(day)
                     setDayOpen(false);
                   }}
                 >
                  <Text style={styles.dropdownItemText}>{day}</Text>
                 </TouchableOpacity>
               ))}
              </ScrollView>
            </View>
           )}
         </View>

         {/* Time Dropdown */ }
         <View style={styles.availabilityCol}>
            <Text style={styles.availabilityLabel}>Time</Text>
            <TouchableOpacity
              style={styles.dropdownButtonSmall}
              onPress={() => {
                setTimeOpen(!timeOpen);
                setDayOpen(false);
              }}
            > 
             <Text style={styles.dropdownText}>
              {form.availability.time || 'Select'}
             </Text>
             <Ionicons name="time-outline" size={20}  color="#777A84" />
            </TouchableOpacity>

            {timeOpen && (
             <View style={styles.dropdownOverlay}>
              <ScrollView
                style={styles.dropdownScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
               >
              {TIMES.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAvailabilityTime(time)
                    setTimeOpen(false);
                  }}
                >
                <Text style={styles.dropdownItemText}>{time}</Text>
                </TouchableOpacity>
              ))}
              </ScrollView>
             </View>
            )}
         </View>
        </View>


        <CustomInput
          label="Location"
          value={form.location}
          onChangeText={(text) => setLocation(text)}
          placeholder="Ifako-Ijaye, lagos"
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setUseCurrentLocation(!form.useCurrentLocation)}
          activeOpacity={0.7}
        >
         <Image 
           source={require('../../assets/images/use-location.png')}
           style={{
            width: 13.3,
            height: 13.33
           }}
         />
          <ThemedText variant='current'>Use my current location</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.fullWidthButtonWrapper}>
         <View style={styles.buttonContainer}>
           <Button 
             title={isPending ? 'Posting...' : 'Post Trade'}
             onPress={onPreview}
            disabled={!isFormValid}
           />
          {/* <Button title={isPending ? 'Posting...' : 'Post Trade'} onPress={() => submitOffer()} disabled={!isFormValid || isPending} /> */}
      </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.surfacePage,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: 120,
  },
  availabilityWrapper: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   gap: 15,
   marginBottom: 25,
  },
  dropdownOverlay: {
   position: 'absolute',
  top: 72,
  left: 0,
  right: 0,
  backgroundColor: colors.white,
  borderRadius: BORDER_RADIUS.lg,
  borderWidth: 1,
  borderColor: colors.borderColor,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 20,
  maxHeight: 160,
  zIndex: 100,
  },
  dropdownScroll: {
    maxHeight: 160,
  },
  dropdownContainer: {
   marginTop: SPACING.xl,
   marginBottom: SPACING.xl,
  },
  dropdownButton: {
   borderWidth: 1,
   borderColor: colors.borderColor,
   borderRadius: BORDER_RADIUS.lg,
   paddingVertical: 14,
   paddingHorizontal: SPACING.lg,
   flexDirection: "row",
   justifyContent: "space-between",
   alignItems: 'center'
  },
  dropdownList: {
    borderRadius: BORDER_RADIUS.lg,
    marginTop: 6,
    backgroundColor: colors.white,
    shadowColor: '#4242421C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8, 
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  dropdownItemText: {
   fontSize: 14,
   color: '#374151'
  },
  dropdownText: {
    fontSize: FONT_SIZES.base,
    color: colors.textBody,
    fontWeight: FONT_WEIGHTS.medium
  },
  inputContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  photoHeaderRow: {
    flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  },
  uploadImagesButton: {
   flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: '#EFF6FF',
  borderRadius: BORDER_RADIUS.md,
  borderWidth: 1,
  borderColor: '#BFDBFE',
  },
  uploadImagesText: {
     fontSize: 13,
  color: '#3B82F6',
  fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightSurface,
    width: '100%'
  },
  actionIcon: {
    width: 20,
    height: 18,
    marginBottom: SPACING.sm,
    resizeMode: 'contain'
  },
  photoWrapper: {
     width: 200, 
     height: 200,
     marginRight: SPACING.md,
     position: 'relative',
     alignItems: 'center',
     justifyContent: 'center',
  },
  tradePhoto: {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.lg,
  resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    padding: 2,
  },
  photoPreviewScroll: {
    marginTop: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
 
  characterCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: -15,
    marginBottom: 10,
  },
  availabilityCol: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  dropdownButtonSmall: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  fullWidthButtonWrapper: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   backgroundColor: colors.white,
   borderTopWidth: 1,
   borderTopColor: '#E5E7EB',
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: SPACING.xl,
    backgroundColor: colors.white,
  },
});

export default CreateTrade;