import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string().trim().min(1, "Product is required."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(100, "Maximum quantity per request is 100."),
});

export type AddToCartSchemaType = z.infer<typeof AddToCartSchema>;
