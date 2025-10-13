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
    category: string;
    title: string;
    photos: string[];
    returnOffer: string;
    description: string;
    availability: {
      day: string;
      time: string;
    };
    location: string;
    useCurrentLocation: boolean;
}