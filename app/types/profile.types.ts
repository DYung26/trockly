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