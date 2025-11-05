// Example: How to integrate the Dashboard into your app
// This would typically be in your main App.tsx or a navigation file

import React, { useState } from 'react';
import { Dashboard } from '../protected/_layout';
import { Trade } from '../types';

// Sample trades data - replace with your actual data from backend/state management
const sampleTrades: Trade[] = [
  {
    id: 1,
    userId: 'user123',
    userName: 'John Doe',
    userPhoto: 'https://i.pravatar.cc/150?img=1',
    category: 'Books',
    title: 'Half of a Yellow Sun',
    description: 'Classy, Quality thick material, Unisex, Red & Black, Long lasting...',
    photos: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f'],
    returnOffer: 'I want another novel (preferably African literature)',
    availability: {
      day: 'Monday',
      time: '10:00 AM',
    },
    location: 'Ikeja, Lagos',
    useCurrentLocation: false,
    createdAt: new Date(),
    distance: 2.5,
  },
  {
    id: 2,
    userId: 'user456',
    userName: 'Jane Smith',
    userPhoto: 'https://i.pravatar.cc/150?img=2',
    category: 'Clothes',
    title: 'Danami Classic Red & Black Colour Block Hoodie',
    description: 'Classy, Quality thick material, Unisex, Red & Black, Long Sleeves, Long lasting...',
    photos: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'],
    returnOffer: 'Looking for a denim jacket or gift card',
    availability: {
      day: 'Tuesday',
      time: '02:00 PM',
    },
    location: 'Yaba, Lagos',
    useCurrentLocation: true,
    createdAt: new Date(),
    distance: 1.2,
  },
  {
    id: 3,
    userId: 'user789',
    userName: 'Michael Brown',
    userPhoto: 'https://i.pravatar.cc/150?img=3',
    category: 'Electronics',
    title: 'PlayStation 4 Controller',
    description: 'Original PS4 controller in excellent condition. Barely used, all buttons working perfectly.',
    photos: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48'],
    returnOffer: 'Looking for Xbox controller or gaming headset',
    availability: {
      day: 'Wednesday',
      time: '05:00 PM',
    },
    location: 'Surulere, Lagos',
    useCurrentLocation: false,
    createdAt: new Date(),
    distance: 3.8,
  },
];

export default function MainLayout() {
  const [trades, setTrades] = useState<Trade[]>(sampleTrades);
  
  const userProfile = {
    name: 'Golibe Faith',
    location: 'Ogba, Lagos',
    photo: 'https://i.pravatar.cc/150?img=5',
  };

  const handleCreatePost = () => {
    // Navigate to create trade screen
    console.log('Navigate to create trade');
  };

  return (
    <Dashboard
      userProfile={userProfile}
      trades={trades}
      onCreatePost={handleCreatePost}
    />
  );
}