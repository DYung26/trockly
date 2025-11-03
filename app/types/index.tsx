export interface Location {
    id: string;
    name: string;
}

export interface Profile {
    phoneNumber: string;
    username: string;
    bio: string;
    photo?: string;
}

export interface Preference {
    id: string;
    name: string;
    selected: boolean;
}

export interface Trade {
    id: number;
    userId: string;
    category: string;
    title: string;
    photos: string[];
    userPhoto: string;
    userName: string;
    returnOffer: string;
    description: string;
    availability: {
      day: string;
      time: string;
    };
    location: string;
    useCurrentLocation: boolean;
    createdAt: Date;
    distance?: number;
    isLiked?: boolean;
    isSkipped?: boolean;
}