// store/offer.store.ts
import { create } from 'zustand';
import type {
  CreateOfferFormState,
  LocalPhoto,
  LocalWant,
  OfferCategory,
  WantFlexibility,
  WantType,
  WantUnit,
} from '../types/offer.types';

// ─── Day label → ISO weekday map ─────────────────────────────────────────────
export const DAY_TO_ISO: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

// ─── Blank want template ──────────────────────────────────────────────────────
export const blankWant = (): LocalWant => ({
  id: Date.now().toString(),
  type: 'object',
  title: '',
  description: '',
  quantity: 1,
  unit: 'pieces',
  flexibility: 'negotiable',
  isOptional: false,
});

// ─── Initial form state ───────────────────────────────────────────────────────
const initialState: CreateOfferFormState = {
  category: '',
  title: '',
  description: '',
  location: '',
  useCurrentLocation: false,
  photos: [],
  wants: [blankWant()],
  availability: { day: '', time: '' },
};

// ─── Store interface ──────────────────────────────────────────────────────────
interface OfferStore {
  form: CreateOfferFormState;

  // Field setters
  setCategory: (category: OfferCategory | '') => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setUseCurrentLocation: (value: boolean) => void;
  setAvailabilityDay: (day: string) => void;
  setAvailabilityTime: (time: string) => void;

  // Photo actions
  addPhoto: (photo: LocalPhoto) => void;
  removePhoto: (uri: string) => void;
  markPhotoUploaded: (uri: string, fileId: string) => void;

  // Wants actions
  addWant: () => void;
  removeWant: (id: string) => void;
  updateWant: (id: string, partial: Partial<LocalWant>) => void;

  // Reset
  resetForm: () => void;
}

export const useOfferStore = create<OfferStore>((set) => ({
  form: initialState,

  setCategory: (category) =>
    set((s) => ({ form: { ...s.form, category } })),

  setTitle: (title) =>
    set((s) => ({ form: { ...s.form, title } })),

  setDescription: (description) =>
    set((s) => ({ form: { ...s.form, description } })),

  setLocation: (location) =>
    set((s) => ({ form: { ...s.form, location } })),

  setUseCurrentLocation: (value) =>
    set((s) => ({ form: { ...s.form, useCurrentLocation: value } })),

  setAvailabilityDay: (day) =>
    set((s) => ({
      form: { ...s.form, availability: { ...s.form.availability, day } },
    })),

  setAvailabilityTime: (time) =>
    set((s) => ({
      form: { ...s.form, availability: { ...s.form.availability, time } },
    })),

  // ── Photos ──────────────────────────────────────────────────────────────────
  addPhoto: (photo) =>
    set((s) => ({ form: { ...s.form, photos: [...s.form.photos, photo] } })),

  removePhoto: (uri) =>
    set((s) => ({
      form: { ...s.form, photos: s.form.photos.filter((p) => p.uri !== uri) },
    })),

  markPhotoUploaded: (uri, fileId) =>
    set((s) => ({
      form: {
        ...s.form,
        photos: s.form.photos.map((p) =>
          p.uri === uri ? { ...p, fileId, uploaded: true } : p,
        ),
      },
    })),

  // ── Wants ───────────────────────────────────────────────────────────────────
  addWant: () =>
    set((s) => ({
      form: { ...s.form, wants: [...s.form.wants, blankWant()] },
    })),

  removeWant: (id) =>
    set((s) => ({
      form: { ...s.form, wants: s.form.wants.filter((w) => w.id !== id) },
    })),

  updateWant: (id, partial) =>
    set((s) => ({
      form: {
        ...s.form,
        wants: s.form.wants.map((w) =>
          w.id === id ? { ...w, ...partial } : w,
        ),
      },
    })),

  resetForm: () => set({ form: initialState }),
}));