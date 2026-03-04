import { useMutation, useQuery  } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { 
 uploadAllPhotos, 
 createOffer,
 getOfferWithImages,
} from "../services/offer-service";
import { useOfferStore, DAY_TO_ISO } from "../store/offer.store";
import type { 
  CreateOfferPayload, 
  CreateAvailabilityDto, 
  LocalWant,
  Offer
} from "../types/offer.types";

function toServerTime(displayTime: string): string {
  if (!displayTime) return '09:00'
  const [timePart, meridiem] = displayTime.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function toEndTime(startTime: string): string {
    const [h, m] = startTime.split(':').map(Number);
    const endH = Math.min(h + 8, 21);
    return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function useCreateOffer() {
    const { form, resetForm } = useOfferStore();
    const router = useRouter();

    return useMutation({
      mutationFn: async () => {
       // console.log('🚀 Starting offer creation...');
       //console.log('📋 Form data:', JSON.stringify(form, null, 2));

  
        // upload all photos and collect thier UUIDs 
        //console.log('📸 Uploading photos...');
        const mediaIds = await uploadAllPhotos(form.photos);
       // console.log('✅ Photos uploaded, mediaIds:', mediaIds);

        const availability: CreateAvailabilityDto[] = [];

        if (form.availability.day) {
          const startTime = toServerTime(form.availability.time || '09:00 AM');
          availability.push({
             dayOfWeek: DAY_TO_ISO[form.availability.day] ?? 1,
             startTime,
             endTime: toEndTime(startTime),
             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }

        const payload: CreateOfferPayload = {
            category: form.category as CreateOfferPayload['category'],
            title: form.title,
            description: form.description,
            location: form.location,
            mediaIds,
            wants: form.wants
             .filter((w) => w.title.trim() !== '')
             .map(({ id: _id, ...w }: LocalWant) => ({
             type: w.type,
             title: w.title,
             description: w.description,
             quantity: Number(w.quantity),
             unit: w.unit,
             flexibility: w.flexibility,
             isOptional: w.isOptional,
          })),
            availability,
        };
        //console.log('📦 Final payload:', JSON.stringify(payload, null, 2));

        const result = await createOffer(payload);
       // console.log('🎉 Offer created:', result);
         return result;
      },
      onSuccess: (data) => {
        //console.log('✅ onSuccess fired:', data);
        showSuccessToast('Success! Offer Created Your Trade is now live.');
        resetForm();
        router.replace('/Dashboard/dashboard');
      },
      onError:  (error: Error) => {
        //console.log('❌ onError fired:', error.message);
        // console.log('❌ Full error:', error);
        showErrorToast(`Error, Failed to create offer, ${error.message}`);
      },
    })
}


export function useGetOffers() {
  return useQuery<Offer[]>({
    queryKey: ['offers'],
    queryFn: getOfferWithImages,
  });
}