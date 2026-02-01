import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" }),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(3, { message: "Product name is too short" }),
  description: z.string().min(10, { message: "Description needs more detail" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" }),
  stock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stock cannot be negative" }),
  imageUrl: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal("")),
  category: z.string().min(1, { message: "Please select a category" }),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1, { message: "Order must contain at least one item" })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterSubmitValues = Omit<RegisterFormValues, "confirmPassword" | "acceptedTerms">;
export type ProductFormValues = z.infer<typeof productSchema>;