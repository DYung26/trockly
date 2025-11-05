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
import { FONT_SIZES, FONT_WEIGHTS } from '@/app/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Trade } from '@/app/types';
import { useRouter } from 'expo-router';
import ThemedText from '@/app/reusables/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface HomeScreenProps {
  trades: Trade[];
  userProfile: {
    name: string;
    location: string;
    photo: string;
  };
  onLike: (tradeId: string | number) => void;
  onSkip: (tradeId: string | number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  trades,
  userProfile,
  onLike,
  onSkip,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'distance' | 'date' | null>(null);
  const [showTooltip, setShowTooltip] = useState<'like' | 'skip' | null>(null);

  const [selectedFilters, setSelectedFilters] = useState({
    category: 'Category',
    distance: 'Distance',
    date: 'Posted Date',
  });

  const handleResetFilters = () => {
    Animated.sequence([
     Animated.timing(dropdownAnim, {
          toValue: 0.2,
          duration: 100,
          useNativeDriver: true,
        }),
       Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
     }),
    ]).start();
     setSelectedFilters({
       category: 'Category',
       distance: 'Distance',
       date: 'Posted Date'
     });
     setActiveDropdown(null);
  };

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  // Animate dropdown apperance/dissaperance 
  const toggleDropdown = (type: any) => {
    if (activeDropdown === type) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => setActiveDropdown(null));
    } else {
        setActiveDropdown(type);
        Animated.timing(dropdownAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }).start();
    };
  }


  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
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
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'left' | 'right') => {
    const trade = trades[currentIndex];
    if (direction === 'right') {
      onLike(trade.id);
    } else {
      onSkip(trade.id);
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };


const renderCard = (trade: Trade, index: number) => {
    if (index < currentIndex) return null;

    if (index === currentIndex) {
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
              },
            ]}
          >
           {/* Image Background with dark overlay */}
           <View style={styles.imageContainer}>
             <Image source={{ uri: trade.photos[0] }} style={styles.tradeImage} />
             <LinearGradient
                  colors={['#00000000', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientOverlay}
             />
           </View>

           {/* Like & Skip buttons (stacked at top-right) */}
           <View style={styles.iconColumn}>
             <TouchableOpacity
               onPress={() => forceSwipe('right')}
               onPressIn={() => setShowTooltip('like')}
               onPressOut={() => setShowTooltip(null)}
               style={styles.likeIconContainer}
             >
                <Image 
                 source={require('../../../assets/images/heart-love.png')}
                />
               {/* <View style={{ 
                  position: 'relative',
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center'
                  }}>
                 <Ionicons name="heart" size={28} color={colors.blue} style={{ position: 'absolute', top: 0, right: 6, opacity: 0.9 }} />
                  <Ionicons name="heart" size={28} color={colors.blue} style={{ position: 'absolute', top: 4, left: 6 }} />
               </View> */}
             </TouchableOpacity>

             <TouchableOpacity
               onPress={() => forceSwipe('left')}
               onPressIn={() => setShowTooltip('skip')}
               onPressOut={() => setShowTooltip(null)}
               style={styles.skipIconContainer}
             >
              <Image 
                source={require('../../../assets/images/dislike-cancel.png')}
              />
               {/* <Ionicons name="hand-down-outline" size={28} color={colors.white} /> */}
             </TouchableOpacity>
           </View>

           {/* Text Overlay */}
           <View style={styles.textContainer}>
             <View style={styles.userInfo}>
               <Image source={{ uri: trade.userPhoto }} style={styles.userAvatar} />
               <Pressable 
                 onPress={() => router.push('/protected/Home/trockler-profile')}
               >
                <ThemedText variant='userName'>{trade.userName}</ThemedText>
               </Pressable>
             </View>

             <TouchableOpacity>
                  <ThemedText variant='tradeTitle'>{trade.title}</ThemedText>
             </TouchableOpacity>
             <ThemedText variant='tradeQuality'  numberOfLines={2}>
                {trade.description}
             </ThemedText>

             <TouchableOpacity style={styles.returnOfferButton}>
               <ThemedText variant='returnOfferText'>{trade.returnOffer}</ThemedText>
             </TouchableOpacity>
           </View>

           {/* Swiper Indication */}
           <View style={styles.swiperDots}>
             {trades.map((_, dotIndex) => (
               <View
                 key={dotIndex}
                 style={[
                  styles.dot,
                  dotIndex === currentIndex && styles.activeDot,
                 ]}
               >
               </View>
             ))}
           </View>
          </Animated.View>
        );
    }
};


  const CATEGORIES = ['Books', 'Clothes', 'Tutoring', 'Electronics'];
  const DISTANCES = ['1 km', '2 km', '3 km', '4 km', '5 km'];
  const DATES = ['All time', '24 hours ago', 'This Week', 'This Month'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: userProfile.photo }} style={styles.profilePhoto} />
          <View>
            <ThemedText variant='welcomeText'>
                <ThemedText variant='welcomeWord'>Welcome</ThemedText>
               <ThemedText variant='userNames'> {userProfile.name}</ThemedText>
            </ThemedText>
            <View style={styles.locationRow}>
              <ThemedText variant='locationText'>{userProfile.location}</ThemedText>
              <Ionicons name="chevron-down" size={16} color={colors.textDisabled} />
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.textDisabled} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView
         horizontal
         showsHorizontalScrollIndicator={false}
         contentContainerStyle={styles.filterScroll}
        >
       <View style={styles.filterBar}>
        <ThemedText variant='filterButtonText'>Filter by:</ThemedText>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => 
            toggleDropdown('category')
          }
        >
          <ThemedText variant='filterButtonText'>{selectedFilters.category}</ThemedText>
          <Ionicons
             name={activeDropdown === 'category' ? 'chevron-up' : 'chevron-down'}
             size={16} 
             color={colors.darkSecondary}
              />
        </TouchableOpacity>
        <TouchableOpacity 
         style={styles.filterButton}
         onPress={() => 
            toggleDropdown('distance')
         }
         >
          <ThemedText variant='filterButtonText' style={styles.filterButtonText}>{selectedFilters.distance}</ThemedText>
          <Ionicons
           name={activeDropdown === 'distance' ? 'chevron-up' : 'chevron-down'}
           size={16} 
           color={colors.darkSecondary} 
           />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => 
            toggleDropdown('date')
          }
          >
          <ThemedText variant='filterButtonText'>{selectedFilters.date}</ThemedText>
          <Ionicons 
            name={activeDropdown === 'date' ? 'chevron-up' : 'chevron-down'}
            size={16} 
            color={colors.darkSecondary} 
            />
        </TouchableOpacity>
        <TouchableOpacity 
           style={styles.resetFilter} 
           onPress={handleResetFilters}>
            <Ionicons name="refresh" size={16} color="#A33132" />
            <ThemedText variant='resetFilterText'>Reset Filter</ThemedText>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </View>

      {activeDropdown && (
        <Animated.View style={[
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
         activeDropdown === 'date' && { right: SPACING.xl, },
        ]}>
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
                   style={
                    selectedFilters.category === cat && { color: colors.blue, fontWeight: '600'}
                   }
                   variant='filterOptionText'>
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
                     style={
                        selectedFilters.distance === dist && { color: colors.blue, fontWeight: '600' }
                     }
                     variant='filterOptionText'
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
                      setSelectedFilters((prev) => ({ ...prev, date}));
                      toggleDropdown('date');
                    }}
                    >
                   <ThemedText
                     variant='filterOptionText'
                     style={
                        selectedFilters.date === date && { color: colors.blue, fontWeight: '600'}
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

      <View style={styles.cardsContainer}>
        {trades.map((trade, index) => renderCard(trade, index)).reverse()}

        {currentIndex >= trades.length && (
          <View style={styles.noMoreCards}>
            <Text style={styles.noMoreText}>No more trades available</Text>
            <Text style={styles.noMoreSubtext}>Check back later for new offers!</Text>
          </View>
        )}
      </View>

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
    paddingTop: Platform.OS ===  'android' ? SPACING['2xl'] : SPACING.lg,
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
    color: '#383A40'
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
    paddingTop: 0,
  },
  card: {
    position: 'absolute',
    bottom: 10,
    width: SCREEN_WIDTH - 40,
    height: '100%',
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageContainer: {
   flex: 1,
   width: '100%',
   height: '100%'
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%'
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
  backgroundColor: 'rgba(0,0,0,0.45)'
 },
 textContainer: {
  position: 'absolute',
  bottom: 20,
  left: 16,
  right: 16,
  zIndex: 10
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
    backgroundColor: '#D9D9D9'
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