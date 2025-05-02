export interface ProductFormDto {
  brandId: string;
  name: string;
  imageUrl: string;
  description: string;
  categoryId: string;
  subcategory: string[];
}

export interface ProductDto {
  _id: string;
  brandId: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  subcategory: string[];
  description: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/// Product List Response

export interface ProductListDto {
  success: boolean;
  products: Product[];
  pagination: Pagination;
}

export interface Product {
  _id: string;
  brandId: BrandId;
  name: string;
  imageUrl: string;
  categoryId: CategoryId;
  subcategory: string[];
  description: string;
  votes: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  hasVoted: boolean;
  isFollowing: boolean;
}

export interface BrandId {
  _id: string;
  name: string;
  logoUrl: string;
}

export interface CategoryId {
  _id: string;
  name: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}
