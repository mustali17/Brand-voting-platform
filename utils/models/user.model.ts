export interface UserDto {
  _id: string;
  name: string;
  email: string;
  role: string;
  following: any[];
  emailVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ownedBrands: OwnedBrand[];
}

export interface OwnedBrand {
  _id: string;
  name: string;
  logoUrl: string;
  website: string;
  description: string;
  isVerified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
