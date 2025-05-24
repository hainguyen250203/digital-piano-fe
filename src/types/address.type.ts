export interface ResponseAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressPayload {
  fullName: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  id: string;
  fullName?: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}
