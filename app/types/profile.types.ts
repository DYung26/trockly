export interface UserProfile {
    id: string;
    name: string;
    location: string;
    photo: string;
    bio: string;
    isVerified: boolean;
    preferences: string[];
    rating: number;
    totalReviews: number;
}

export interface ListedItem {
    id: string;
    title: string;
    image: string;
    updatedDate: string;
    tradedDate?: string;
    status: 'available' | 'traded';
}

export interface Review {
    id: string;
    userName: string;
    userPhoto: string;
    rating: number;
    date: string;
    comment: string;
    itemName: string;
}

export interface CreateTrocklerProfileRequest {
   username: string;
   address: string;
   bio?: string;
   avatarMediaId?: string;
   phoneNumber?: string;
}

export interface SetPreferencesRequest {
    preferences: string[];
    swapRadiusKm: number;
}

export interface SetPreferencesResponse {
    statusCode: number;
    message: string;
    data: TrocklerProfile;
}

export interface TrocklerProfile {
  id: string;
  userId: string;
  username: string;
  phoneNumber?: string;
  preferences: string[];
  swapRadiusKm: number;
  bio?: string;
  address: string;
  avatarMediaId?: string;
  isOnboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export interface CreateTrocklerProfileResponse {
    statusCode: number;
    message: string;
    data: TrocklerProfile;
}

export interface GetMyProfileResponse {
    statusCode: number;
    message: string;
    data: TrocklerProfile;
}