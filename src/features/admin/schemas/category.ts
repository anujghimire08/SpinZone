import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(50, "Category name cannot exceed 50 characters"),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
