import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './Home';
import { colors } from '../constants/theme';
import { BlurView } from 'expo-blur';
import { SPACING  } from '../constants/layout';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { Trade } from '../types';

interface DashboardProps {
    userProfile: {
      name: string;
      location: string;
      photo: string;
    };
    trades: Trade[];
    onCreatePost: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  trades,
  onCreatePost
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'posts' | 'inbox' | 'profile'>('home');

  const handleLike = (tradeId: string | number) => {
    console.log('Liked trade:', tradeId);
  };

  const handleSkip = (tradeId: string | number) => {
     console.log('Skipped trade:', tradeId);
     // Handle skip logic - move to next trade 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return (
         <HomeScreen
           trades={trades}
           userProfile={userProfile}
           onLike={handleLike}
           onSkip={handleSkip}
         />
        );
        case 'posts': 
        return (
         <View style={styles.placeholderContainer}>
           <Ionicons name="file-tray-stacked-outline" size={60} color="#9CA3AF" /> 
           <Text style={styles.placeholderText}>Posts Screen</Text>
           <Text style={styles.placeholderSubtext}>View and manage your trades</Text>
         </View>
        );
      case 'inbox': 
       return (
        <View style={styles.placeholderContainer}>
          <Ionicons name="chatbubbles-outline" size={60} color="#9CA3AF" />
          <Text style={styles.placeholderText}>Inbox Screen</Text>
          <Text style={styles.placeholderSubtext}>Chat with other traders</Text>
        </View>
       );
       case 'profile':
         return (
          <View style={styles.placeholderContainer}>
           <Ionicons name="person-outline" size={60} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Profile Screen</Text>
            <Text style={styles.placeholderSubtext}>Manage your account settings</Text>
          </View>
         );
         default: 
          return null;
    }
  };

  return (
    <View style={styles.container}>
     {/* Main Content */}
     <View style={styles.content}>{renderContent()}</View>

     {/* Bottom Navigation */}
     <BlurView intensity={23.6} style={styles.bottomNav}>
       <TouchableOpacity
         style={styles.navItem}
         onPress={() => setActiveTab('home')}
         activeOpacity={0.7}
       >
        <View style={[styles.navIconContainer, activeTab === 'home' && styles.activeNavIcon ]}>
         <Ionicons
          name={activeTab === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={activeTab === 'home' ? colors.blue :  '#777A84'}
         />
        </View>
        <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>
            Home
        </Text>
       </TouchableOpacity>

       <TouchableOpacity
         style={styles.navItem}
         onPress={() => setActiveTab('posts')}
         activeOpacity={0.7}
       >
         <View style={[styles.navIconContainer, activeTab === 'posts' && styles.activeNavIcon]}>
          <Ionicons
           name={activeTab === 'posts' ? 'document-text-outline': 'document-text-outline'}
           size={24}
           color={activeTab === 'posts' ? colors.blue : '#777A84'}
          />
         </View>
         <Text style={[styles.navLabel, activeTab === 'posts' && styles.activeNavLabel]}>
            Posts
         </Text>
       </TouchableOpacity>

       <TouchableOpacity
         style={styles.navItem}
         onPress={() => setActiveTab('inbox')}
         activeOpacity={0.7}
       >
        <View style={[styles.navIconContainer, activeTab === 'inbox' && styles.activeNavIcon]}>
          <Ionicons
           name={activeTab === 'inbox' ? 'chatbubbles' : 'chatbubbles-outline'}
           size={24}
           color={activeTab === 'inbox' ? colors.blue : '#777A84'}
          />
        </View>
        <Text style={[styles.navLabel, activeTab === 'inbox' && styles.activeNavLabel]}>
          Inbox
        </Text>
       </TouchableOpacity>

       <TouchableOpacity
         style={styles.navItem}
         onPress={() => setActiveTab('profile')}
         activeOpacity={0.7}
       >
        <View style={[styles.navIconContainer, activeTab === 'profile' && styles.activeNavIcon]}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? colors.blue : '#777A84'}
          />
         <Text style={[styles.navLabel, activeTab === 'profile' && styles.activeNavLabel]}>
           Profile 
         </Text>
        </View>
       </TouchableOpacity>
     </BlurView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePage,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
    paddingTop: SPACING.sm,
    shadowColor: '#4242421C',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  navIconContainer: {
    marginBottom: 4,
  },
  activeNavIcon: {
    // Optional: add background circle for active state
  },
  navLabel: {
    fontSize: FONT_SIZES.xs,
    color: '#9CA3AF',
    fontWeight: FONT_WEIGHTS.medium,
  },
  activeNavLabel: {
    color: colors.priBlue,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  placeholderText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#374151',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  placeholderSubtext: {
    fontSize: FONT_SIZES.base,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});