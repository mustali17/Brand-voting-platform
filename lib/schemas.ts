import * as z from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  provider: z.enum(["credentials", "google"]).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["user", "admin"]).optional(),
  following: z.array(z.string()).optional(),
  emailVerified: z.boolean().optional(),
  otp: z.string().optional(),
  otpExpires: z.date().optional(),
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