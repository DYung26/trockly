import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BORDER_RADIUS, SPACING } from '../constants/layout';
import { useRouter } from 'expo-router';
import { colors } from '../constants/theme';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import ThemedText from '../reusables/ThemedText';
import { ListedItem, UserProfile } from '../types/profile.types';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileDetailsScreenProps {
    userProfile: UserProfile;
    listedItems: ListedItem[];
    onNavigateToReviews: () => void;
    onBack: () => void;
    onBlockUser?: () => void;
    onReportUser?: () => void;
}


const ProfileDetailsScreen: React.FC<ProfileDetailsScreenProps> = ({
   userProfile,
   listedItems,
   onNavigateToReviews,
   onBack,
   onBlockUser,
   onReportUser
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'traded'>('available');
  const [menuPosition, setMenuPosition] = useState<{x: number; y: number} | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showItemMenu, setShowItemMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListedItem | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const filteredItems = listedItems.filter(item => item.status === activeTab);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true
    }).start(() => setShowActionMenu(false));
  };

 const handleHeaderMenuPress = (event: any) => {
  const { pageX, pageY } = event.nativeEvent;
  const { height, width } = Dimensions.get('window');

  const adjustedY = pageY + 120 > height ? pageY - 120 : pageY; 
  const adjustedX = pageX + 220 > width ? width - 220 : pageX; 

  setMenuPosition({ x: adjustedX, y: adjustedY });
  setShowHeaderMenu(true);
  setShowItemMenu(false);
};

const handleItemMenuPress = (event: any, item: any) => {
  const { pageX, pageY } = event.nativeEvent;
  const { height, width } = Dimensions.get('window');

  const adjustedY = pageY + 120 > height ? pageY - 120 : pageY;
  const adjustedX = pageX + 220 > width ? width - 220 : pageX;

  setMenuPosition({ x: adjustedX, y: adjustedY });
  setSelectedItem(item);
  setShowItemMenu(true);
  setShowHeaderMenu(false);
};


const closeMenus = () => {
  setShowHeaderMenu(false);
  setShowItemMenu(false);
  setSelectedItem(null);
};

  const handleBlockUser = () => {
    closeMenu();
    onBlockUser?.();
  };

  const handleReportUser = () => {
    closeMenu();
    onReportUser?.();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/*header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText variant='headerTitle'>Details</ThemedText>
        <View style={styles.headerRight}>
         <TouchableOpacity style={styles.iconButton}>
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
         <TouchableOpacity onPress={handleHeaderMenuPress} style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
         </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/*Profile section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.photo }} style={styles.profileImage} />
          </View>
           <View style={styles.profileRow}>
            <ThemedText variant='h1'>{userProfile.name}</ThemedText>
            <Image source={require('../../assets/images/verifyBadge.png')} />
           </View>
          <View style={styles.locationRow}>
              {/* <Ionicons name="location-outline" size={16} color={colors.textSecondary} /> */}
              <Image 
                source={require('../../assets/images/location-pinner.png')}
              />
            <ThemedText variant='locationText'>{userProfile.location}</ThemedText>
          </View>
        </View>

        {/* Short Bio */}
        <View style={styles.section}>
          <ThemedText variant='bioText'>Short Bio</ThemedText>
          <ThemedText variant='dropdownItemText'>{userProfile.bio}</ThemedText>

          <View style={{ marginTop:  8}} />
          <ThemedText variant='dropdownItemText'>Joined Trockly since May 2025</ThemedText>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <ThemedText variant='bioText'>Preferences</ThemedText>
          <View style={styles.preferencesContainer}>
            {userProfile.preferences.map((pref, index) => (
             <View key={index} style={styles.preferenceTag}>
                <ThemedText variant='preferenceText'>{pref}</ThemedText>
             </View>
            ))}
          </View>
        </View>

        {/* Rating & Reviews */}
        <TouchableOpacity
          style={styles.ratingsSection}
          onPress={onNavigateToReviews}
        >
          <View style={{ flex: 1 }}>
             <ThemedText variant='bioText'>Ratings & Reviews</ThemedText>
             <View style={styles.starRow}>
                <Image source={require('../../assets/images/star.png')} />
              <ThemedText variant='dropdownItemText'>
                {userProfile.rating.toFixed(1)} ({userProfile.totalReviews} reviews)
             </ThemedText>
             </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
        </TouchableOpacity>

        {/* Listed Items */}
        <View style={styles.section}>
          <ThemedText variant='bioText'>Listed Items</ThemedText>

          {/* Tab Buttons */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
               style={[
                 styles.tabButton,
                 activeTab === 'available' && styles.tabButtonActive,
               ]}
               onPress={() => setActiveTab('available')}
            >
             <Text 
               style={[
                 styles.tabText,
                 activeTab === 'available' && styles.tabTextActive,
               ]}
             >
                Available Items
             </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                 styles.tabButton,
                 activeTab === 'traded' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('traded')}
            >
              <Text
                 style={[
                    styles.tabText,
                    activeTab === 'traded' && styles.tabTextActive,
                 ]}
               >
                Traded Items
              </Text>
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <View style={styles.itemsList}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                {activeTab === 'traded' && (
                  <LinearGradient
                    colors={['#00000000', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.itemCardOverlay}
                  />
                )}
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                    <ThemedText 
                        variant='itemTitle' 
                        numberOfLines={2}
                        style={activeTab === 'traded' && {opacity: 0.5}}
                        >
                      {item.title}
                    </ThemedText>
                     <ThemedText 
                       variant='itemDate'
                       style={activeTab === 'traded' && { color: '#49935C', opacity: 0.5}}
                       >
                     {activeTab === 'available' 
                      ? `Updated on ${item.updatedDate}`
                      : `Traded on ${item.tradedDate || item.updatedDate}`
                     }
                    </ThemedText>
                    {/* <Text style={styles.itemDate}>
                     {activeTab === 'available' ? 'Updated' : 'Traded'} on {item.updatedDate}
                    </Text> */}
                </View>

                {/* Dots icons triggeres popup menu */}
                <TouchableOpacity 
                  onPress={(e) => handleItemMenuPress(e, item)}
                    style={styles.itemMenuIcon}>
                  <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Menu Modal */}
     {showHeaderMenu && menuPosition && (
      <TouchableOpacity
       activeOpacity={1}
       style={styles.overlay}
       onPress={closeMenus}
      >
       <View
        style={[
          styles.popMenu,
          { 
            top: menuPosition.y + 10, right: 20, position: 'absolute'},
        ]}
       >
         <TouchableOpacity
          style={styles.menuItem} 
          onPress={handleBlockUser}>
           <ThemedText variant='menuText'>
             Block this trader
           </ThemedText>
           <Ionicons name="ban-outline" size={20} color={colors.red} />
         </TouchableOpacity>
         <TouchableOpacity 
           style={styles.menuItem} 
          onPress={handleReportUser}>
          <ThemedText variant='menuText'>
            Report item
          </ThemedText>
          <Ionicons name='flag-outline' size={20} color={colors.red} />
         </TouchableOpacity>
       </View>
      </TouchableOpacity>
     )}

     {/* Item Menu: Trade / Report */}
     {showItemMenu && menuPosition && selectedItem && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={closeMenus}
        >
         <View
           style={[
            styles.popMenu,
            { top: menuPosition.y + 10, right: 20, position: 'absolute' },
           ]}
         >
         <TouchableOpacity
           style={styles.menuItem}
           onPress={() => {
             closeMenus();
           }}
         >
           <Text style={[styles.menuText, { color: colors.textPrimary}]}>
            Trade with this item
           </Text>
            <Ionicons name="swap-horizontal-outline" size={20} color={colors.textPrimary} />
         </TouchableOpacity>
         <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
             closeMenus();
             handleReportUser();
            }}
          >
          <ThemedText variant='menuText'>
            Report item
          </ThemedText>
          <Ionicons name="flag-outline" size={20} color={colors.red}  />
         </TouchableOpacity>
         </View>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
 profileRow: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 5,
 },
  itemMenuIcon: {
    padding: 6,
  },
  itemCardOverlay: {
  ...StyleSheet.absoluteFillObject,
  zIndex: 1,
  opacity: 0.3,
},
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    //marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  bioText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  preferenceTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: colors.lightSurface,
  },
  preferenceText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  ratingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: colors.lightSurface,
    padding: 6,
    borderRadius: BORDER_RADIUS.lg
  },
  tabButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: colors.blue,
    borderRadius: BORDER_RADIUS.md
  },
  tabText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily: 'Poppins_500Medium',
    color: colors.textHeading,
  },
  tabTextActive: {
    color: colors.greyWhite,
  },
  itemsList: {
    gap: SPACING.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.lg,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  },
  menuText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    fontFamily:'Poppins_500Medium',
    color: colors.textBody
  },
});


export default ProfileDetailsScreen;