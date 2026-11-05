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

  brand: z.string().trim().min(1, "Brand is required"),
});

export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
