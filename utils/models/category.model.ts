export interface CategoryDetailsDto extends CommonCategoryDto {
  subcategories: CommonCategoryDto[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CommonCategoryDto {
  _id: string;
  name: string;
  imageUrl: string;
}
