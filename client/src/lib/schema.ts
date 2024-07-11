import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Full Name is required" }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(24, { message: "Username is too long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Name is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be up to 6 characters" }),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Name is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be up to 6 characters" }),
});