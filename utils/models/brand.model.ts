import { ProductDto } from './product.model';

export interface BrandFormDto {
  name: string;
  logoUrl: string;
  website: string;
  description: string;
}

export interface BrandDetailsDto {
  brand: BrandDto;
  products: ProductDto[];
}

export interface BrandDto {
  _id: string;
  name: string;
  logoUrl: string;
  followers: string[];
  website: string;
  description: string;
  isVerified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TopBrandsDto {
  success: boolean;
  brands: Brand[];
}

export interface Brand {
  _id: string;
  totalVotes: number;
  productCount: number;
  followerCount: number;
  name: string;
  logoUrl: string;
}
