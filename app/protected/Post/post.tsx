import { BORDER_RADIUS, SPACING } from '@/app/constants/layout';
import { colors } from '@/app/constants/theme';
import React from 'react';
import { useRouter } from 'expo-router';
import {
View,
Text,
TouchableOpacity,
Image, 
StyleSheet,
Platform,
 } from 'react-native';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import ThemedText from '@/app/reusables/ThemedText';

 interface PostScreenProps {
   createTrade?: () => void;
 }

 export const PostScreen: React.FC<PostScreenProps> = ({
  createTrade
 })  => {
    const router = useRouter();
  
     return (
      <SafeAreaView style={styles.container} edges={['top']}>
       {/* Header */}
       <View style={styles.header}>
         <ThemedText variant='h1'>
            Posts
         </ThemedText>
         <TouchableOpacity
           onPress={() => router.push('/offer/create-offer?fromApp=true')}
           style={styles.createButton}
         >
         <Image 
           source={require('../../../assets/images/add-item-icon.png')}
           style={{ width: 16, height: 16}}
         />
         <ThemedText variant='returnOfferText'>Create an Item</ThemedText>
         </TouchableOpacity>
       </View>
      </SafeAreaView>
     );
 }


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfacePage
  },
  header: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingHorizontal: SPACING.xl,
   paddingBottom: SPACING.md,
   paddingTop: Platform.OS === 'android' ? SPACING['2xl'] : SPACING.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.itemBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
    gap: 6
  }
 })