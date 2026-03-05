import { create } from "zustand";

interface ProfileFormState {
    address: string;
    phoneNumber: string;
    username: string;
    photoUri: string;
    photoMimeType: string;
    bio: string;
    photoSize: number;
    photoFileId: string;
    preferences: string[];
    swapRadiusKm: number;
}

interface ProfileStore {
    form: ProfileFormState;
    setAddress: (address: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setUsername: (username: string) => void;
    setPhoto: (uri: string, mimeType: string, size: number) => void;
    setBio: (bio: string) => void;
    setPhotoFileId: (fileId: string) => void;
    setPreferences: (preferences: string[]) => void;
    setSwapRadiusKm: (km: number) => void;
    resetForm: () => void;
}

const initialState: ProfileFormState = {
    address: '',
    phoneNumber: '',
    username: '',
    photoUri: '',
    photoMimeType: '',
    photoSize: 0,
    bio: '',
    photoFileId: '',
    preferences: [],
    swapRadiusKm: 1,
};

export const useProfileStore = create<ProfileStore>((set) => ({
    form: initialState,
    setAddress: (address) => set((s) => ({ form: { ...s.form, address } })),
    setPhoneNumber: (phoneNumber) => set((s) => ({ form: { ...s.form, phoneNumber } })),
    setUsername: (username) => set((s) => ({ form: { ...s.form, username } })),
    setPhoto: (uri, mimeType, size) => 
    set((s) => ({ form: { ...s.form, photoUri: uri, photoMimeType: mimeType, photoSize: size } })),
    setPhotoFileId: (fileId) => set((s) => ({ form: { ...s.form, photoFileId: fileId } })),
    setBio: (bio) => set((s) => ({ form: { ...s.form, bio } })),
    setPreferences: (preferences) => set((s) => ({ form: { ...s.form, preferences } })),
    setSwapRadiusKm: (swapRadiusKm) => set((s) => ({ form: { ...s.form, swapRadiusKm } })),
    resetForm: () => set({ form: initialState }),
}));
