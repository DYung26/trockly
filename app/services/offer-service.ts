import apiClient from "../lib/apiClient";
import { API_ENDPOINTS } from "../api/urls";
import type { 
 UploadUrlRequest, 
 UploadUrlResponse,
 CreateFileRecordResponse,
 OfferResponse,
 LocalPhoto,
 CreateOfferPayload,
 GetAllOffersResponse,
 Offer
} from "../types/offer.types";

export async function getUploadUrl(
  mimeType: string,
  size: number,
): Promise<UploadUrlResponse['data']> {
  const body: UploadUrlRequest = {mimeType, size };

  const { data } = await apiClient.post<UploadUrlResponse>(
    API_ENDPOINTS.files.uploadUrl,
    body,
    {
     headers: { 'Content-Type': 'application/json' },
    },
  );

  return data.data;
}

export async function uploadFileToS3(
  presignedUrl: string,
  localUri: string,
  mimeType: string,
): Promise<void> {
    // Read file as blob (stream it to s3)
    const response = await fetch(localUri);
    const blob = await response.blob();

    const s3Response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          // s3 extract content-type used to generate the URL
          'Content-Type': mimeType,
          'x-amz-acl': 'public-read'
        },
        body: blob,
    });

    if (!s3Response.ok) {
        throw new Error(`S3 upload failed: ${s3Response.status} ${s3Response.statusText}`);
    }
}

// Register uploaded file with backend 
export async function createFileRecord(
  key: string,
  mimeType: string,
  size: number,
): Promise<CreateFileRecordResponse['data']> {
    const { data } = await apiClient.post<CreateFileRecordResponse>(
      API_ENDPOINTS.files.create,
      { key, mimeType, size },
    );

    return data.data;
}


// ─── Orchestrator: runs steps 1-3 for a single photo
// Returns the file `id` that goes into  `mediaIds`
export async function uploadPhoto(photo: LocalPhoto): Promise<string> {
    // 1. Get single pre-signed URL
    const { uploadUrl, key } = await getUploadUrl(photo.mimeType, photo.size);

    // 2. Upload binary to S3
    await uploadFileToS3(uploadUrl, photo.uri, photo.mimeType);

    // 3. Create the file record and get the UUID
    const fileRecord = await createFileRecord(key, photo.mimeType, photo.size);

    return fileRecord.id;
}

// ─── Upload ALL photos in parallel, collect their IDs 
export async function uploadAllPhotos(photos: LocalPhoto[]): Promise<string[]> {
    const ids = await Promise.all(photos.map((p) => uploadPhoto(p)));
    return ids;
}

// Create the Offer 
export async function createOffer(
  payload: CreateOfferPayload,
): Promise<OfferResponse['data']> {
   const { data } = await apiClient.post<OfferResponse>(
    API_ENDPOINTS.offers.create,
    payload
   );

   return data.data;
}

export async function getAllOffers(): Promise<Offer[]> {
  const { data } = await apiClient.get<GetAllOffersResponse>(
    API_ENDPOINTS.offers.getAll,
  );
  return data.data;
}

export async function getFileById(fileId: string): Promise<string> {
  const { data } = await apiClient.get(API_ENDPOINTS.files.getById(fileId));
  return data.data.url;
}

export async function getOfferWithImages(): Promise<Offer[]> {
  const { data } = await apiClient.get<GetAllOffersResponse>(API_ENDPOINTS.offers.getAll);
  const offers = data.data;

  // For each offer, resolve all media fileIds to actual URLs in parallel
  const offerWithUrls = await Promise.all(
    offers.map(async (offer) => ({
      ...offer,
      media: await Promise.all(
       offer.media.map(async (m) => ({
        ...m,
        url: await getFileById(m.fileId),
       }))
      ),
    }))
  );
  return offerWithUrls;
}