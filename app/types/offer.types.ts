export type OfferCategory = 'object' | 'service' | 'food';

export type WantType = 'object' | 'service' | 'food';

export type WantFlexibility = 'negotiable' | 'fixed'  | 'flexible';

export type WantUnit = 
  | 'pieces'
  | 'hours'
  | 'kg'
  | 'liters'
  | 'units'
  | 'sessions';

export interface CreateWantDto {
  type: WantType;
  title: string;
  description?: string;
  quantity: number;
  unit: WantUnit;
  flexibility: WantFlexibility;
  isOptional: boolean;
}


export interface CreateAvailabilityDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone: string;
}

export interface CreateOfferPayload {
   category: OfferCategory;
   title: string;
   description: string;
   location: string;
   mediaIds: string[];
   wants: CreateWantDto[];
   availability: CreateAvailabilityDto[];
}

// File Upload Types 
export interface UploadUrlRequest {
    mimeType: string;
    size: number;
}

export interface UploadUrlResponse {
    statusCode: number;
    message: string;
    data: {
      uploadUrl: string;
      key: string;
      expiresAt: string;
    };
}

export interface CreateFileRecordRequest {
  key: string;
  mimeType: string;
  size: number;
}

export interface FileRecord {
    id: string;
    key: string;
    bucket: string | null;
    mimeType: string;
    size: number;
    url: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface CreateFileRecordResponse {
    statusCode: number;
    message: string;
    data: FileRecord;
}


export interface OfferResponse {
    statusCode: number;
    message: string;
    data: {
      id: string;
      category: OfferCategory;
      title: string;
      description: string;
      location: string;
      media: FileRecord[];
      wants: CreateWantDto[];
      availability: CreateAvailabilityDto[];
      createdAt: string;
      updatedAt: string;
    };
}

export interface LocalWant {
    id: string;
    type: WantType;
    title: string;
    description: string;
    quantity: number;
    unit:  WantUnit;
    flexibility: WantFlexibility;
    isOptional: boolean;
}

export interface LocalPhoto {
    uri: string;
    mimeType: string;
    size: number;
    fileId?: string;
    uploaded: boolean;
}

export interface CreateOfferFormState {
    category: OfferCategory | '';
    title: string;
    description: string;
    location: string;
    useCurrentLocation: boolean;
    photos: LocalPhoto[];
    wants: LocalWant[];
    availability: {
        day: string;
        time: string;
    }
}

export interface OfferMedia {
    id: string;
    offerId: string;
    fileId: string;
    type: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
 
export interface OfferAvailability {
    id: string;
    offerId: string;
    dayOfWeek: number;   
    startTime: string;
    endTime: string;
    timeZone: string;
    createdAt: string;
    updatedAt: string;
}

// Offer want item from API 
export interface OfferWant {
    id: string;
    offerId: string;
    type: WantType;
    title: string;
    description: string;
    quantity: number;
    unit: WantUnit;
    flexibility: WantFlexibility;
    isOptional: boolean;
    createdAt: string;
}

// Single offer from API 
export interface Offer {
    id: string;
    category: OfferCategory;
    title: string;
    description: string;
    location: string;
    media: OfferMedia[];
    wants: OfferWant[];
    availability: OfferAvailability[];
    createdAt: string;
    updatedAt: string;
}

// Get all offer response 
export interface GetAllOffersResponse {
    statusCode: number;
    message: string;
    data: Offer[];
}