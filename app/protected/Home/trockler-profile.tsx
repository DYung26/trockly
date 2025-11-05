import React, { useState } from 'react';
import { ProfileDetailsScreen } from '@/app/components/ProfileDetailsScreen';
import { RatingReviewsScreen } from '@/app/components/RatingsReviewsScreen';
import { UserProfile, ListedItem, Review } from '@/app/types/profile.types';

export default function TrocklerProfileApp() {
    const [currentScreen, setCurrentScreen] = useState<'profile' | 'reviews'>('profile');

    const mockUserProfile: UserProfile = {
    id: '1',
    name: 'John Doe',
    location: 'Ogudu, Lagos',
    photo: 'https://i.pravatar.cc/200?img=12',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    isVerified: true,
    preferences: ['Bike repair', 'PC repair', 'Dry goods'],
    rating: 4.5,
    totalReviews: 24,
  };
  const mockListedItems: ListedItem[] = [
    {
      id: '1',
      title: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
     updatedDate: 'June 20, 2025',
      status: 'available',
    },
    {
      id: '2',
      title: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
      updatedDate: 'June 18, 2025',
      status: 'available',
    },
    {
      id: '3',
      title: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
      updatedDate: 'May 15, 2025',
      tradedDate: 'June 10, 2025', 
      status: 'traded',
    },
    {
      id: '4',
      title: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
      updatedDate: 'May 10, 2025',
      tradedDate: 'June 5, 2025',
      status: 'traded',
    },
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      userName: 'John Doe',
      userPhoto: 'https://i.pravatar.cc/100?img=8',
      rating: 4,
      date: 'June 13, 2025',
      comment: 'Very polite and punctual. Trade went smoothly. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      itemName: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
    },
    {
      id: '2',
      userName: 'John Doe',
      userPhoto: 'https://i.pravatar.cc/100?img=9',
      rating: 4,
      date: 'June 13, 2025',
      comment: 'Very polite and punctual. Trade went smoothly. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      itemName: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
    },
    {
      id: '3',
      userName: 'Jane Smith',
      userPhoto: 'https://i.pravatar.cc/100?img=10',
      rating: 5,
      date: 'June 10, 2025',
      comment: 'Excellent trader! Would definitely trade again. The item was exactly as described.',
      itemName: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
    },
    {
      id: '4',
      userName: 'Mike Johnson',
      userPhoto: 'https://i.pravatar.cc/100?img=11',
      rating: 3,
      date: 'June 5, 2025',
      comment: 'Good experience overall. Communication could be better but the trade was fair.',
      itemName: 'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
    },
  ];

  const handleBlockUser = () => {
    console.log('User blocked');
    // Implement block report logic here 
  };

    const handleReportUser = () => {
    console.log('User reported');
    // Implement your report logic here
  };

  const handleUserPress = (userId: string) => {
    console.log('Navigate to user profile:', userId);
    setCurrentScreen('profile');
  };

  if (currentScreen === 'reviews') {
    return (
      <RatingReviewsScreen
        reviews={mockReviews}
        averageRating={mockUserProfile.rating}
        totalReviews={mockUserProfile.totalReviews}
        onBack={() => setCurrentScreen('profile')}
        onUserPress={handleUserPress}
      />
    );
  }

  return (
    <>
     <ProfileDetailsScreen
       userProfile={mockUserProfile}
       listedItems={mockListedItems}
       onNavigateToReviews={() => setCurrentScreen('reviews')}
       onBack={() => console.log('Go back to previous screen')}
       onBlockUser={handleBlockUser}
       onReportUser={handleReportUser}
     />
    </>
  )
}