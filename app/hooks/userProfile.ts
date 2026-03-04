import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import apiClient from "../lib/apiClient";
import { API_ENDPOINTS } from "../api/urls";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { userProfileStore } from "../store/profile.store";
import { 
  CreateTrocklerProfileRequest, 
  CreateTrocklerProfileResponse 
} from "../types/profile.types";
import { 
  UploadUrlRequest, 
  UploadUrlResponse, 
  CreateFileRecordRequest, 
  CreateFileRecordResponse 
} from "../types/offer.types";


async function uploadProfilePhoto(
    uri: string,
    mimeType: string,
    size: number,
): Promise<string> {
    // get presigned URL 
    const urlRes = await apiClient.post<UploadUrlResponse>(
        API_ENDPOINTS.files.uploadUrl,
        { mimeType, size } as UploadUrlRequest
    );
    const { uploadUrl, key } =  urlRes.data.data;

    // Upload to s3
    const blob = await fetch(uri).then((r) => r.blob());
    await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: blob,
    });


    // Create file record 
    const fileRes = await apiClient.post<CreateFileRecordResponse>(
        API_ENDPOINTS.files.create,
        { key, mimeType, size} as CreateFileRecordRequest
    );
    return fileRes.data.data.id;
}


export function useCreateTrockerProfile() {
    const router = useRouter();
    const { form, resetForm } = userProfileStore();

    return useMutation({
        mutationFn: async () => {
          let profilePhotoId: string | undefined;

          // upload photo if one was selected 
          if (form.photoUri && form.photoMimeType && form.photoSize) {
            profilePhotoId = await uploadProfilePhoto(
               form.photoUri,
               form.photoMimeType,
               form.photoSize
            );
          }

          const payload: CreateTrocklerProfileRequest = {
           username: form.username,
           phoneNumber: form.phoneNumber,
           preferences: form.preferences,
           swapRadiusKm: form.swapRadiusKm,
           address: form.address,
            ...(profilePhotoId && { profilePhotoId }),
          };

          const response = await apiClient.post<CreateTrocklerProfileResponse>(
            API_ENDPOINTS.trocklerProfile.create,
            payload
          );
          return response.data;
        },
        onSuccess: () => {
         showSuccessToast('Profile created successfully');
         resetForm();
         router.replace('/protected/Home/home');
        },
        onError: (error: Error) => {
            showErrorToast(error.message || 'Failed to create profile.');
        }
    });
}