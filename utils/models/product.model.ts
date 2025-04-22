export interface ProductFormDto {
  brandId: string;
  name: string;
  imageUrl: string;
  description: string;
  category: string;
  subcategory: string[];
}

export interface ProductDto {
  _id: string;
  brandId: string;
  name: string;
  imageUrl: string;
  category: string;
  subcategory: string[];
  description: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
