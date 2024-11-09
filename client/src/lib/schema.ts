import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(1, { message: "Full Name is required" }),
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username is too short" })
    .max(60, { message: "Username is too long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Name is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be up to 6 characters" }),
});

export const loginUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username is too short" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be up to 6 characters" }),
});
