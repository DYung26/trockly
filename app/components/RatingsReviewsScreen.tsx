import React, { useRef, useState } from 'react';
import { 
 View,
 Text,
 TouchableOpacity,
 Image,
 StyleSheet as RRStyles,
 Dimensions,
 ScrollView,
 Modal,
 Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Review } from '../types/profile.types';
import { colors } from '../constants/theme';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import ThemedText from '../reusables/ThemedText';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';


interface RatingReviewsScreenProps {
   reviews: Review[];
   averageRating: number;
   totalReviews: number;
   onBack: () => void;
   onUserPress: (userId: string) => void;
   onBlockUser?: () => void;
   onReportUser?: () => void;
}



const RatingReviewsScreen: React.FC<RatingReviewsScreenProps> =  ({
   reviews,
   averageRating,
   totalReviews,
   onBack,
   onUserPress,
   onBlockUser,
   onReportUser
}) => {
   const [sortBy, setSortBy] = useState('Sort by');
   const [filterRating, setFilterRating] = useState('Rating');
   const [showRatingDropdown, setShowRatingDropdown] = useState(false);
   const [showSortDropdown, setShowSortDropdown] = useState(false);
   const [showHeaderMenu, setShowHeaderMenu] = useState(false);
   const [menuPosition, setMenuPosition] =  useState<{x: number; y: number} | null>(null);
   const [showItemMenu, setShowItemMenu] = useState(false);
   const [showActionMenu, setShowActionMenu] = useState(false);
   const slideAmin = useRef(new Animated.Value(300)).current;

   const ratingOptions = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];
   const sortOptions = ['New to old', 'Old to new'];

   const handleSelectRating = (rating: any) => {
      setFilterRating(rating);
      setShowRatingDropdown(false)
   };

   const handleSelectSort = (sort: any) => {
     setSortBy(sort);
     setShowSortDropdown(false);
   };


   const closeMenu = () => {
     Animated.timing(slideAmin, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true
     }).start(() => setShowActionMenu(false));
   }


   const handleHeaderMenuPress = (event: any) => {
     const { pageX, pageY } = event.nativeEvent;
     const { height, width } = Dimensions.get('window');

     const adjustedY = pageY + 120 > height ? pageY - 120 : pageY;
     const adjustedX = pageX + 220 > width ? width - 220 : pageX;

     setMenuPosition({ x: adjustedX, y: adjustedY });
     setShowHeaderMenu(true);
     setShowItemMenu(false);
   };

   const closeMenus = () => {
    setShowHeaderMenu(false);
    setShowItemMenu(false);
   };


  const handleBlockUser = () => {
    closeMenu();
    onBlockUser?.();
  };

  const handleReportUser = () => {
    closeMenu();
    onReportUser?.();
  };
   const renderStars = (rating: number) => {
     return (
        <View style={rrStyles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
             <Ionicons
                key={star}
                name={star <= 3 ? 'star' : 'star-outline'} // First 3 filled
               size={16}
               color={star <= 3 ? '#FFCC00' : '#777A84'} // 3 yellow, 2 grey
              />
            ))}
          {/* {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <=  rating ? 'star' : 'star-outline'}
              size={16}
              color={star <= rating ? "#FFCC00" : "#777A84"}
            />
          ))} */}
        </View>
     );
   };

   return (
    <SafeAreaView style={rrStyles.container} edges={['top']}>
      {/* Header */}
      <View style={rrStyles.header}>
        <TouchableOpacity onPress={onBack} style={rrStyles.backButton}>
         <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant='headerTitle'>Ratings & Reviews</ThemedText>
        <View style={rrStyles.headerRight}>
          <TouchableOpacity style={rrStyles.iconButton}>
             {/* <Ionicons name="share-outline" size={24} color={colors.textPrimary} /> */}
             <Image 
                source={require('../../assets/images/share.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: colors.textPrimary,
                  resizeMode: 'contain'
                }}
             />
          </TouchableOpacity>
         <TouchableOpacity onPress={handleHeaderMenuPress} style={rrStyles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={rrStyles.filterBar}>
         <Text style={rrStyles.filterLabel}>Filter by:</Text>
         <TouchableOpacity
           style={rrStyles.filterButton}
           onPress={() => {
             setShowRatingDropdown(!showRatingDropdown);
             setShowSortDropdown(false);
           }}
         >
          <Text style={rrStyles.filterButtonText}>{filterRating}</Text>
           <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
         </TouchableOpacity>

         <TouchableOpacity
           style={rrStyles.filterButton}
           onPress={() => {
             setShowSortDropdown(!showSortDropdown);
             setShowRatingDropdown(false);
           }}
         >
            <Text style={rrStyles.filterButtonText}>{sortBy}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
         </TouchableOpacity>
      </View>

      {/* Rating Dropdown */}
      <Modal 
        visible={showRatingDropdown} 
        transparent animationType="fade">
         <TouchableOpacity
           style={rrStyles.dropdownOverlay}
           onPress={() => setShowRatingDropdown(false)}
         >
         <View style={rrStyles.dropdownMenu}>
          {ratingOptions.map((option) => (
             <TouchableOpacity
               key={option}
               style={rrStyles.dropdownItem}
               onPress={() => handleSelectRating(option)}
             >
               <Text style={rrStyles.dropdownItemText}>{option}</Text>
             </TouchableOpacity>
          ))}
         </View>
         </TouchableOpacity>
      </Modal>

      {/* Sort Dropdown */}
      <Modal visible={showSortDropdown} transparent animationType="fade">
        <TouchableOpacity
          style={rrStyles.dropdownOverlay}
          onPress={() => setShowSortDropdown(false)}
        >
          <View style={[rrStyles.dropdownMenu, { left: 150}]}>
           {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={rrStyles.dropdownItem}
              onPress={() => handleSelectSort(option)}
            >
            <Text style={rrStyles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
           ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        showsVerticalScrollIndicator={false}>
        {/* Overall Rating */}
        <View style={rrStyles.overallRatingContainer}>
          <View style={rrStyles.largeStarsContainer}>
             {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
               name={star <= 4 ? 'star' : 'star-outline'} 
               size={20}
               color={star <= 4 ? '#FFCC00' : '#777A84'} 
              />
            ))}
            {/* {[1, 2, 3, 4, 5].map((star) => (
             <Ionicons 
               key={star}
               name={star <= Math.round(averageRating) ? 'star' : 'star-outline'}
               size={20}
               color={star <= Math.round(averageRating) ? '#FFCC00' : '#777A84'}
             />
            ))} */}
          </View>
          <Text style={rrStyles.ratingNumber}>{averageRating.toFixed(1)} / 5.0</Text>
          <ThemedText variant='filterOptionText'>({totalReviews} reviews)</ThemedText>
        </View>

        {/* Reviews List */}
        <View style={rrStyles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={rrStyles.reviewCard}>
              <View style={rrStyles.reviewHeader}>
                <TouchableOpacity
                  style={rrStyles.reviewUserInfo}
                  onPress={() => onUserPress(review.id)}
                >
                  <Image 
                    source={{ uri: review.userPhoto }}
                    style={rrStyles.reviewUserPhoto}
                  />
                  <View>
                    <ThemedText variant='subheading'>{review.userName}</ThemedText>
                    <ThemedText variant='reviewDate'>{review.date}</ThemedText>
                  </View>
                </TouchableOpacity>
                <View style={rrStyles.reviewRating}>
                    {renderStars(review.rating)}
                </View>
             </View>
             <ThemedText variant='preferenceText'>{review.comment}</ThemedText>
             <ThemedText variant='reviewItem'>{review.itemName}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>


      {/*Action menu modal */}
      {showHeaderMenu && menuPosition && (
        <TouchableOpacity
          activeOpacity={1}
          style={rrStyles.overlay}
          onPress={closeMenus}
        >
         <View 
            style={[
              rrStyles.popMenu,
              {
                top: menuPosition.y + 10, right: 20, position: 'absolute'
              }
            ]}
          >
          <TouchableOpacity
            style={rrStyles.menuItem}
            onPress={handleBlockUser}
          >
           <ThemedText variant='menuText'>
             Block this trader
           </ThemedText>
           <Ionicons name="ban-outline" size={20} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity
            style={rrStyles.menuItem}
            onPress={handleReportUser}
          >
            <ThemedText variant='menuText'>
                Report item
            </ThemedText>
             <Ionicons name='flag-outline' size={20} color={colors.red} />
          </TouchableOpacity>
         </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
   );
};



const rrStyles = RRStyles.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePage
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  filterLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: 'Poppins_500Medium',
    color: colors.darkSecondary
  },
  filterButton: {
   flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: BORDER_RADIUS.sm,
     justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    marginLeft: SPACING.sm,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
   dropdownOverlay: {
     flex: 1,
  backgroundColor: 'rgba(0,0,0,0.2)',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  },
  dropdownMenu: {
   backgroundColor: colors.white,
    borderRadius: 8,
    width: 180,
    elevation: 5,
    paddingVertical: 8,
    position: 'absolute',
    top: 100,
    left: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  overallRatingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFCD001A',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#F3D8B0",
    marginHorizontal: SPACING.lg,
  },
  largeStarsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: SPACING.md,
  },
  ratingNumber: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: colors.textBody,
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold'
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reviewsList: {
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.lg,
  },
  reviewCard: {
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  reviewUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewRating: {
    marginLeft: 'auto',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  overlay: {
    ... RRStyles.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  popMenu: {
      backgroundColor: colors.white,
     borderRadius: 8,
     elevation: 5,
     paddingVertical: 8,
     width: 228,
     shadowColor: '#4242421C',
     borderColor: colors.surfaceDisabled,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 4,
  },
  menuItem: {
     flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  }
});

export default RatingReviewsScreen;