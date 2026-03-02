import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../reusables/PostButton';
import ThemedText from '../reusables/ThemedText';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { useOfferStore } from '../store/offer.store';
import { useCreateOffer } from '../hooks/offer';
import { colors } from '../constants/theme';
//import { Trade } from '../types';

interface TradePreviewProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');

 const TradePreview: React.FC<TradePreviewProps> = ({  onBack }) => {
  const { form } = useOfferStore();
  const { mutate: submitOffer, isPending } = useCreateOffer();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack} 
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#4F535A" />
          <ThemedText variant='preview'>Preview details</ThemedText>
        </TouchableOpacity>
      </View>


      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        {form.title ? (
          <ThemedText variant='previewTitle'>{form.title}</ThemedText>
        ) : null}

        {/* Image Carousel */}
        {form.photos && form.photos.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {form.photos.map((photo, index) => (
                <Image 
                  key={index}
                  source={{ uri: photo.uri }} 
                  style={styles.carouselImage} 
                />
              ))}
            </ScrollView>
            
            {/* Image Counter */}
            {form.photos.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{form.photos.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        {form.description ? (
          <ThemedText variant='tradeDescription'>{form.description}</ThemedText>
        ) : null}

        {/* Wants Section */}
        {form.wants.filter(w => w.title.trim() !== '').length > 0 && (
          <View style={styles.section}>
            <ThemedText variant='inputLabel'>What  I want In Return</ThemedText>
            {form.wants 
              .filter(w => w.title.trim() !== '')
              .map((want, index) => (
                <View key={want.id} style={{ marginBottom: 8 }}>
                  <ThemedText variant='tradeText'>
                     {index + 1}. {want.title}
                  </ThemedText>
                  {want.description ? (
                    <ThemedText variant='tradeDescription'>{want.description}</ThemedText>
                  ): null}
                </View>
              ))
            }
          </View>
        )}


        {/* Availability Section */}
        {(form.availability?.day || form.availability?.time) && (
          <View style={styles.section}>
            <ThemedText variant='inputLabel'>AVAILABILITY</ThemedText>
            <ThemedText variant='tradeText'>
              {form.availability.day} at {form.availability.time || '9:00 AM'}
            </ThemedText>
          </View>
        )}

        {/* Location Section */}
        {form.location ? (
          <View style={styles.section}>
            <ThemedText variant='inputLabel'>LOCATION</ThemedText>
            <ThemedText variant='tradeText'>{form.location}</ThemedText>
          </View>
        ) : null}
      </ScrollView>

      {/* Publish Button */}
      <View style={styles.fullWidthButtonWrapper}>
        <View style={styles.buttonContainer}>
          <Button 
            title={isPending ? 'Publishing...' : 'Publish'}
            onPress={() => submitOffer()}
            disabled={isPending}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.surfacePage
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: colors.surfacePage,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  imageContainer: {
    width: width - ((SPACING.xl || 20) * 2),
    height: 280,
    borderRadius: BORDER_RADIUS.lg || 12,
    overflow: 'hidden',
    marginBottom: SPACING.lg || 16,
    position: 'relative',
  },
  carouselImage: {
    width: width - ((SPACING.xl || 20) * 2),
    height: 280,
    resizeMode: 'cover',
  },
  imageCounter: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
  },
  imageCounterText: {
    color: colors.white || '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg 
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

export default TradePreview;