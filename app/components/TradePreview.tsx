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
import { Button } from '../reusables/PostButton';
import ThemedText from '../reusables/ThemedText';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { colors } from '../constants/theme';
import { Trade } from '../types';

interface TradePreviewProps {
  trade: Trade;
  onPublish: () => void;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export const TradePreview: React.FC<TradePreviewProps> = ({ trade, onPublish, onBack }) => {
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
        {trade.title ? (
          <ThemedText variant='previewTitle'>{trade.title}</ThemedText>
        ) : null}

        {/* Image Carousel */}
        {trade.photos && trade.photos.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {trade.photos.map((photo, index) => (
                <Image 
                  key={index}
                  source={{ uri: photo }} 
                  style={styles.carouselImage} 
                />
              ))}
            </ScrollView>
            
            {/* Image Counter */}
            {trade.photos.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{trade.photos.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        {trade.description ? (
          <ThemedText variant='tradeDescription'>{trade.description}</ThemedText>
        ) : null}

        {/* Return Offer */}
        {trade.returnOffer ? (
            <ThemedText variant='returnOffer'>
            I want {trade.returnOffer}
          </ThemedText>
        ) : null}

        {/* Availability Section */}
        {(trade.availability?.day || trade.availability?.time) && (
          <View style={styles.section}>
            <ThemedText variant='inputLabel'>AVAILABILITY</ThemedText>
            <ThemedText variant='tradeText'>
              {trade.availability.day} at {trade.availability.time || '9:00 AM'}
            </ThemedText>
          </View>
        )}

        {/* Location Section */}
        {trade.location ? (
          <View style={styles.section}>
            <ThemedText variant='inputLabel'>LOCATION</ThemedText>
            <ThemedText variant='tradeText'>{trade.location}</ThemedText>
          </View>
        ) : null}
      </ScrollView>

      {/* Publish Button */}
      <View style={styles.fullWidthButtonWrapper}>
        <View style={styles.buttonContainer}>
          <Button title="Publish" onPress={onPublish} />
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