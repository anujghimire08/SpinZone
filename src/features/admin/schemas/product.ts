import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  category_id: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than zero"),
  slug: z.string().trim().min(1, "Slug is required"),
  img: z.string().trim().min(1, "Product image is required"),
  discount_percent: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  brand: z.string().trim().min(1, "Brand is required"),
  initialStock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .default(0),
});

export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
export type CreateProductSchemaInput = z.input<typeof CreateProductSchema>;
