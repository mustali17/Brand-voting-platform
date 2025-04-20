import { ProductDto } from "./product.model";

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
  website: string;
  description: string;
  isVerified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
