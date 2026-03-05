import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/app/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING, BORDER_RADIUS } from '@/app/constants/layout';
import { useGetOffers } from '@/app/hooks/offer';
import type { Offer } from '@/app/types/offer.types';
import { FONT_SIZES, FONT_WEIGHTS } from '@/app/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ThemedText from '@/app/reusables/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = SCREEN_WIDTH - 40;

type MappedTrade = {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  photos: string[];
  returnOffer: string;
  availability: { day: string; time: string };
  userPhoto: string;
  userName: string;
};

interface HomeScreenProps {
  userProfile: {
    name: string;
    location: string;
    photo: string;
  };
  onLike: (tradeId: string | number) => void;
  onSkip: (tradeId: string | number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  onLike,
  onSkip,
}) => {
  const router = useRouter();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const tradesRef = useRef<MappedTrade[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'distance' | 'date' | null>(null);
  const [showTooltip, setShowTooltip] = useState<'like' | 'skip' | null>(null);

  const { data: offers = [], isLoading } = useGetOffers();

  const trades: MappedTrade[] = offers.map((offer: Offer) => ({
    id: offer.id,
    category: offer.category,
    title: offer.title,
    description: offer.description,
    location: offer.location,
    photos: offer.media
      .sort((a, b) => a.order - b.order)
      .map((m) => (m as any).url ?? m.fileId),
    returnOffer: offer.wants[0]?.title ?? '',
    availability: {
      day: String(offer.availability[0]?.dayOfWeek ?? ''),
      time: offer.availability[0]?.startTime ?? '',
    },
    userPhoto: '',
    userName: '',
  }));

  tradesRef.current = trades;

  const [selectedFilters, setSelectedFilters] = useState({
    category: 'Category',
    distance: 'Distance',
    date: 'Posted Date',
  });

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const handleResetFilters = () => {
    Animated.sequence([
      Animated.timing(dropdownAnim, { toValue: 0.2, duration: 100, useNativeDriver: true }),
      Animated.timing(dropdownAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setSelectedFilters({ category: 'Category', distance: 'Distance', date: 'Posted Date' });
    setActiveDropdown(null);
  };

  const toggleDropdown = (type: 'category' | 'distance' | 'date') => {
    if (activeDropdown === type) {
      Animated.timing(dropdownAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        .start(() => setActiveDropdown(null));
    } else {
      setActiveDropdown(type);
      Animated.timing(dropdownAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    }
  };

  const position = useRef(new Animated.ValueXY()).current;

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // ─── PanResponder: only claims gesture when clearly horizontal (not photo scroll) ───
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (currentIndexRef.current >= tradesRef.current.length) return false;
        return Math.abs(gesture.dx) > 30 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    if (currentIndexRef.current >= tradesRef.current.length) return;
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

const onSwipeComplete = (direction: 'left' | 'right') => {
  const trade = tradesRef.current[currentIndexRef.current];
  if (!trade) return;
  if (direction === 'right') {
    onLike(trade.id);
  } else {
    onSkip(trade.id);
  }
  position.setValue({ x: 0, y: 0 });
  currentIndexRef.current = currentIndexRef.current + 1;
  setCurrentIndex(currentIndexRef.current);
  setCurrentPhotoIndex(0);
}

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  // ─── Shared card inner content ────────────────────────────────────────────
  const renderCardContent = (trade: MappedTrade, isActive: boolean) => (
    <>
      {/* Photo ScrollView */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          scrollEnabled={isActive}
          style={{ width: CARD_WIDTH, flex: 1 }}
          onMomentumScrollEnd={(e) => {
            if (isActive) {
              const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              setCurrentPhotoIndex(idx);
            }
          }}
        >
          {trade.photos.map((photo, i) => (
            <Image
              key={i}
              source={{ uri: photo }}
              style={{ width: CARD_WIDTH, height: '100%', resizeMode: 'cover' }}
            />
          ))}
        </ScrollView>
        <LinearGradient
          colors={['#00000000', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
      </View>

      {/* Like & Skip buttons */}
      <View style={styles.iconColumn}>
        <TouchableOpacity
          onPress={() => forceSwipe('right')}
          onPressIn={() => isActive && setShowTooltip('like')}
          onPressOut={() => isActive && setShowTooltip(null)}
          style={styles.likeIconContainer}
        >
          <Image source={require('../../../assets/images/heart-love.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => forceSwipe('left')}
          onPressIn={() => isActive && setShowTooltip('skip')}
          onPressOut={() => isActive && setShowTooltip(null)}
          style={styles.skipIconContainer}
        >
          <Image source={require('../../../assets/images/dislike-cancel.png')} />
        </TouchableOpacity>
      </View>

      {/* Text overlay */}
      <View style={styles.textContainer}>
        <View style={styles.userInfo}>
          {trade.userPhoto ? (
            <Image source={{ uri: trade.userPhoto }} style={styles.userAvatar} />
          ) : (
           <Image 
            source={require('../../../assets/images/default-avatar.png')}
            style={styles.userAvatar}
            />
          )}
          <Pressable onPress={() => router.push('/protected/Home/trockler-profile')}>
            <ThemedText variant="userName">{trade.userName || 'John Doe'}</ThemedText>
          </Pressable>
        </View>

        <TouchableOpacity>
          <ThemedText variant="tradeTitle">{trade.title}</ThemedText>
        </TouchableOpacity>

        <ThemedText variant="tradeQuality" numberOfLines={2}>
          {trade.description}
        </ThemedText>

        {trade.returnOffer ? (
          <TouchableOpacity style={styles.returnOfferButton}>
            <ThemedText variant="returnOfferText">{trade.returnOffer}</ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Photo indicator dots */}
      {trade.photos.length > 1 && (
        <View style={styles.swiperDots}>
          {trade.photos.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                dotIndex === (isActive ? currentPhotoIndex : 0) && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </>
  );

  // ─── Render card ──────────────────────────────────────────────────────────
  const renderCard = (trade: MappedTrade, index: number) => {
    if (index < currentIndex) return null;

    const isActive = index === currentIndex;

    if (isActive) {
      return (
        <Animated.View
          key={trade.id}
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
              zIndex: trades.length - index,
            },
          ]}
        >
          {renderCardContent(trade, true)}
        </Animated.View>
      );
    }

    // Background cards (peek behind active card)
    return (
      <Animated.View
        key={trade.id}
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            zIndex: trades.length - index,
            transform: [{ scale: 0.95 }],
          },
        ]}
      >
        {renderCardContent(trade, false)}
      </Animated.View>
    );
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading trades...</Text>
      </View>
    );
  }

  const CATEGORIES = ['Books', 'Clothes', 'Tutoring', 'Electronics'];
  const DISTANCES = ['1 km', '2 km', '3 km', '4 km', '5 km'];
  const DATES = ['All time', '24 hours ago', 'This Week', 'This Month'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {userProfile.photo ? (
            <Image source={{ uri: userProfile.photo }} style={styles.profilePhoto} />
          ): (
            <Image 
               source={require('../../../assets/images/default-avatar.png')}
               style={styles.profilePhoto}
            />
          )}
          <View>
            <ThemedText variant="welcomeText">
              <ThemedText variant="welcomeWord">Welcome</ThemedText>
              <ThemedText variant="userNames"> {userProfile.name}</ThemedText>
            </ThemedText>
            <View style={styles.locationRow}>
              <ThemedText variant="locationText">{userProfile.location}</ThemedText>
              <Ionicons name="chevron-down" size={16} color={colors.textDisabled} />
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.textDisabled} />
        </TouchableOpacity>
      </View>

      {/* Filter bar */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <View style={styles.filterBar}>
            <ThemedText variant="filterButtonText">Filter by:</ThemedText>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => toggleDropdown('category')}
            >
              <ThemedText variant="filterButtonText">{selectedFilters.category}</ThemedText>
              <Ionicons
                name={activeDropdown === 'category' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.darkSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => toggleDropdown('distance')}
            >
              <ThemedText variant="filterButtonText">{selectedFilters.distance}</ThemedText>
              <Ionicons
                name={activeDropdown === 'distance' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.darkSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => toggleDropdown('date')}
            >
              <ThemedText variant="filterButtonText">{selectedFilters.date}</ThemedText>
              <Ionicons
                name={activeDropdown === 'date' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.darkSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetFilter} onPress={handleResetFilters}>
              <Ionicons name="refresh" size={16} color="#A33132" />
              <ThemedText variant="resetFilterText">Reset Filter</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Dropdown overlay */}
      {activeDropdown && (
        <Animated.View
          style={[
            styles.dropdownOverlay,
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
            activeDropdown === 'category' && { left: SPACING.xl + 60 },
            activeDropdown === 'distance' && { left: SPACING.xl + 170 },
            activeDropdown === 'date' && { right: SPACING.xl },
          ]}
        >
          <View style={styles.filterDropdown}>
            {activeDropdown === 'category' && (
              <View style={styles.filterColumn}>
                <Text style={styles.filterColumnTitle}>Category</Text>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.filterOption}
                    onPress={() => {
                      setSelectedFilters((prev) => ({ ...prev, category: cat }));
                      toggleDropdown('category');
                    }}
                  >
                    <ThemedText
                      variant="filterOptionText"
                      style={
                        selectedFilters.category === cat
                          ? { color: colors.blue, fontWeight: '600' }
                          : undefined
                      }
                    >
                      {cat}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeDropdown === 'distance' && (
              <View style={styles.filterColumn}>
                <Text style={styles.filterColumnTitle}>Distance</Text>
                {DISTANCES.map((dist) => (
                  <TouchableOpacity
                    key={dist}
                    style={styles.filterOption}
                    onPress={() => {
                      setSelectedFilters((prev) => ({ ...prev, distance: dist }));
                      toggleDropdown('distance');
                    }}
                  >
                    <ThemedText
                      variant="filterOptionText"
                      style={
                        selectedFilters.distance === dist
                          ? { color: colors.blue, fontWeight: '600' }
                          : undefined
                      }
                    >
                      {dist}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeDropdown === 'date' && (
              <View style={styles.filterColumn}>
                <Text style={styles.filterColumnTitle}>Posted Date</Text>
                {DATES.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={styles.filterOption}
                    onPress={() => {
                      setSelectedFilters((prev) => ({ ...prev, date }));
                      toggleDropdown('date');
                    }}
                  >
                    <ThemedText
                      variant="filterOptionText"
                      style={
                        selectedFilters.date === date
                          ? { color: colors.blue, fontWeight: '600' }
                          : undefined
                      }
                    >
                      {date}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Cards container */}
      <View style={styles.cardsContainer}>
        {trades.map((trade, index) => renderCard(trade, index))}

        {currentIndex >= trades.length && trades.length > 0 && (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreText}>No more trades available</Text>
            <Text style={styles.noMoreSubtext}>Check back later for new offers!</Text>
          </View>
        )}
      </View>

      {/* Tooltips */}
      {showTooltip === 'like' && (
        <View style={[styles.tooltip, styles.tooltipLike]}>
          <Text style={styles.tooltipTitle}>Like button</Text>
          <Text style={styles.tooltipText}>
            Tap the heart icon or swipe right to like an offer you&apos;d love to exchange for
          </Text>
        </View>
      )}

      {showTooltip === 'skip' && (
        <View style={[styles.tooltip, styles.tooltipSkip]}>
          <Text style={styles.tooltipTitle}>Skip button</Text>
          <Text style={styles.tooltipText}>
            Not interested? Tap this icon or swipe left to pass and move to the next offer
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePage,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: Platform.OS === 'android' ? SPACING['2xl'] : SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  profilePhoto: {
    width: 44,
    height: 44,
    borderRadius: 52,
  },
  userNames: {
    color: '#383A40',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterWrapper: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginBottom: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    gap: 4,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: '#374151',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 135,
    left: SPACING.xl + 60,
    right: 0,
    zIndex: 999,
  },
  filterDropdown: {
    width: 160,
    backgroundColor: colors.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#4242421C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.md,
    gap: 4,
  },
  filterColumn: {
    flex: 1,
  },
  filterColumnTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: colors.blue,
    marginBottom: SPACING.md,
  },
  filterOption: {
    paddingVertical: SPACING.sm,
  },
  filterOptionText: {
    fontSize: FONT_SIZES.sm,
    color: '#555965',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    bottom: 10,
    width: CARD_WIDTH,
    height: '100%',
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  tradeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  cardContent: {
    padding: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.sm,
  },
  tradeDescription: {
    fontSize: FONT_SIZES.sm,
    color: '#f3f3f3',
    marginBottom: SPACING.sm,
  },
  returnOfferButton: {
    backgroundColor: '#D2DBF04A',
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },
  cardActionButtons: {
    position: 'absolute',
    bottom: '80%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING['3xl'],
    zIndex: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    right: 30,
    transform: [{ rotate: '20deg' }],
    zIndex: 10,
    borderWidth: 4,
    borderColor: '#3B82F6',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  likeText: {
    fontSize: 40,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#3B82F6',
  },
  iconColumn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 15,
    gap: 12,
  },
  likeIconContainer: {
    backgroundColor: colors.surfacePrimary,
    padding: 10,
    borderRadius: 32,
  },
  skipIconContainer: {
    backgroundColor: '#ECDDDF',
    padding: 10,
    borderRadius: 32,
  },
  swiperDots: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    width: 58,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  skipOverlay: {
    position: 'absolute',
    top: 50,
    left: 30,
    transform: [{ rotate: '-20deg' }],
    zIndex: 10,
    borderWidth: 4,
    borderColor: '#EF4444',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  skipText: {
    fontSize: 40,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#EF4444',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING['3xl'],
    zIndex: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: '#3B82F6',
  },
  skipButton: {
    backgroundColor: '#EF4444',
  },
  tooltip: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: colors.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 250,
  },
  tooltipLike: {
    left: 30,
  },
  tooltipSkip: {
    right: 30,
  },
  tooltipTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  tooltipText: {
    fontSize: FONT_SIZES.sm,
    color: '#6B7280',
    lineHeight: 18,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  noMoreText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  noMoreSubtext: {
    fontSize: FONT_SIZES.base,
    color: '#6B7280',
    textAlign: 'center',
  },
});