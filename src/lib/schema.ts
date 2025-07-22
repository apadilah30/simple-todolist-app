import { z } from "zod"

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address."),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirm Password do not match.",
  path: ["confirmPassword"],
})

export const ChecklistSchema = z.object({
  name: z.string(),
})

export const ChecklistItemSchema = z.object({
  itemName: z.string().optional(),
  name: z.string().optional(),
})