import React  from 'react';
import { Dashboard } from '../protected/_layout';
import { useGetMyProfile } from '../hooks/userProfile';


export default function MainLayout() {
  const { data: myProfile, isLoading } = useGetMyProfile();


  
  const userProfile = {
    name: myProfile?.username ?? '',
    location: myProfile?.address ?? '',
    photo: myProfile?.avatarUrl ?? '',
  };

  const handleCreatePost = () => {
    // Navigate to create trade screen
  };

  return (
    <Dashboard
      userProfile={userProfile}
      onCreatePost={handleCreatePost}
    />
  );
}