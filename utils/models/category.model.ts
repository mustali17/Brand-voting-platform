export interface CategoryDetailsDto {
  subcategories: CommonCategoryDto[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
  name: string;
  categoryImageURL: string;
}

export interface CommonCategoryDto {
  _id?: string;
  name: string;
  imageUrl: string;
}

export interface CategoryFormDto {
  _id?: string;
  name: string;
  categoryImageURL: string;
  subcategories: CommonCategoryDto[];
}

export interface SubCategoryPostDto {
  category: string;
  subcategory: Subcategory;
}

export interface Subcategory {
  name: string;
  imageUrl: string;
}
