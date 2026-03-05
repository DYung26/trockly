import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateTrade from '../components/CreateTrade';
import TradePreview from '../components/TradePreview';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CreateTradeScreen() {
    const [showPreview, setShowPreview] = useState(false);
    const router = useRouter();
    const { fromApp } = useLocalSearchParams<{ fromApp?: string }>();

    return (
      <SafeAreaView style={styles.container}>
        {showPreview ? (
            <TradePreview onBack={() => setShowPreview(false)} />
        ): (
         <CreateTrade 
           onPreview={() => setShowPreview(true)}
            onSkip={() => fromApp === 'true' ? router.back() : router.replace('/Dashboard/dashboard')}
           fromApp={fromApp === 'true'} 
          />
        )}
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: { flex: 1 },
});