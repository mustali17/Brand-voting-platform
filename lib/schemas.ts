import * as z from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterBrandSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url(),
  website: z.string().url(),
  description: z.string(),
});

export const VerifyBrandSchema = z.object({
  brandId: z.string(),
  isVerified: z.boolean(),
});

export const AddProductSchema = z.object({
  brandId: z.string(),
  name: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string(),
});

export const FollowBrandSchema = z.object({
  brandId: z.string(),
});

export const CastVoteSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});