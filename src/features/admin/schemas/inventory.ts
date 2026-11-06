import { z } from "zod";

export const UpdateInventorySchema = z.object({
  productId: z.string().min(1, "Product is required"),

  type: z.enum(["ADD", "REMOVE"]),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than zero"),
});

export type UpdateInventorySchemaType = z.infer<typeof UpdateInventorySchema>;
