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
    phoneNumber: string;
    preferences: string[];
    swapRadiusKm: number;
    address: string;
    profilePhotoId?: string; // fieldId from upload 
}

export interface TrocklerProfile {
    id: string;
    username: string;
    phoneNumber: string;
    preferences: string[];
    swapRadiusKm: number;
    address: string;
    profilePhoto?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrocklerProfileResponse {
    statusCode: number;
    message: string;
    data: TrocklerProfile;
}