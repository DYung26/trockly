import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import apiClient from "../lib/apiClient";
import { API_ENDPOINTS } from "../api/urls";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useProfileStore } from "../store/profile.store";
import { 
  CreateTrocklerProfileRequest, 
  CreateTrocklerProfileResponse,
  SetPreferencesRequest,
  GetMyProfileResponse,
  SetPreferencesResponse,
} from "../types/profile.types";
import { 
  UploadUrlRequest, 
  UploadUrlResponse, 
  CreateFileRecordRequest, 
  CreateFileRecordResponse,
} from "../types/offer.types";


async function uploadProfilePhoto(
    uri: string,
    mimeType: string,
    size: number,
): Promise<string> {
  console.log('📸 [uploadProfilePhoto] Starting upload...');
    console.log('📸 uri:', uri);
    console.log('📸 mimeType:', mimeType);
    console.log('📸 size:', size);
    // get presigned URL 
    const urlRes = await apiClient.post<UploadUrlResponse>(
        API_ENDPOINTS.files.uploadUrl,
        { mimeType, size } as UploadUrlRequest
    );
    console.log('✅ [uploadProfilePhoto] Got presigned URL response:', JSON.stringify(urlRes.data, null, 2));
    const { uploadUrl, key } =  urlRes.data.data;

    console.log('🔑 key:', key);
    console.log('🔗 uploadUrl:', uploadUrl);

    // Upload to s3
    const blob = await fetch(uri).then((r) => r.blob());
     console.log('📦 blob size:', blob.size, 'type:', blob.type);

    const s3Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 
         'Content-Type': mimeType,
         'x-amz-acl': 'public-read',
       },
        body: blob,
    });

    console.log('✅ [S3 PUT] status:', s3Res.status);


    // Create file record 
    const fileRes = await apiClient.post<CreateFileRecordResponse>(
        API_ENDPOINTS.files.create,
        { key, mimeType, size} as CreateFileRecordRequest
    );
    console.log('✅ [createFileRecord] response:', JSON.stringify(fileRes.data, null, 2));
    const fileId = fileRes.data.data.id;
    console.log('🆔 fileId returned:', fileId);

    return fileId;
}

export function useCreateTrocklerProfile() {
  return useMutation({
    mutationFn: async () => {
      const { form } = useProfileStore.getState();
      console.log('🚀 createProfile fired');
      console.log('🚀 form.photoUri:', form.photoUri);
      console.log('🚀 form.photoMimeType:', form.photoMimeType);
      console.log('🚀 form.photoSize:', form.photoSize);
      console.log('🚀 form.username:', form.username);
      console.log('🚀 form.address:', form.address);
      console.log('🚀 form.bio:', form.bio);
      console.log('🚀 form.phoneNumber:', form.phoneNumber);

      let avatarMediaId: string | undefined;

      if (form.photoUri && form.photoMimeType && form.photoSize) {
        avatarMediaId = await uploadProfilePhoto(
          form.photoUri,
          form.photoMimeType,
          form.photoSize,
        );
      }

      const payload: CreateTrocklerProfileRequest = {
        username: form.username,
        address: form.address,
        ...(form.bio && { bio: form.bio }),
        ...(form.phoneNumber && { phoneNumber: form.phoneNumber }),
        ...(avatarMediaId && { avatarMediaId }),
      };

      const response = await apiClient.post<CreateTrocklerProfileResponse>(
         API_ENDPOINTS.trocklerProfile.create,
         payload
      );
      return response.data;
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to create profile.');
    },
  });
}

export function useSetPreferencesAndSwap() {
  const router = useRouter();

  return useMutation({
     mutationFn: async () => {
        const { form  } = useProfileStore.getState();
       const payload: SetPreferencesRequest = {
         preferences: form.preferences,
         swapRadiusKm: form.swapRadiusKm,
       };
       const response = await apiClient.patch<SetPreferencesResponse>(
        API_ENDPOINTS.trocklerProfile.setPreferences,
        payload
       );
       return response.data;
     },
     onSuccess: () => {
      useProfileStore.getState().resetForm();
      showSuccessToast('Profile setup complete! Welcome to Trockly 🎉');
      router.replace('/offer/create-offer');
     },
     onError: (error: Error) => {
      showErrorToast(error.message || 'Failed to save preferences');
     },
  });
}


export function useGetMyProfile() {
  return useQuery({
     queryKey: ['my-profile'],
     queryFn: async () => {
      const response = await apiClient.get<GetMyProfileResponse>(
        API_ENDPOINTS.trocklerProfile.me
      );
      const profile = response.data.data;

      // Fetch avatar image URL if avatarMediaId exists 
      let avatarUrl = '';
      if (profile.avatarMediaId) {
        const fileRes = await apiClient.get(
           API_ENDPOINTS.files.getById(profile.avatarMediaId)
        );
        console.log('🖼 File response:', JSON.stringify(fileRes.data, null, 2));
        avatarUrl = fileRes.data?.data?.url ?? fileRes.data.url ?? '';
        console.log('🖼 avatarUrl resolved:', avatarUrl);
      }

      return { ...profile, avatarUrl };
     },
  });
}

export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const response = await apiClient.get<GetMyProfileResponse>(
      API_ENDPOINTS.trocklerProfile.me
    );
    console.log('🔍 checkOnboardingStatus response:', JSON.stringify(response.data, null, 2));
    return response.data.data.isOnboardingComplete;
  } catch (error) {
    console.log('🔍 checkOnboardingStatus error (no profile yet):', error);
    return false;
  }
}
