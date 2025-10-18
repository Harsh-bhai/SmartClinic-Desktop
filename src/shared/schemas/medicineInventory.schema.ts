import { z } from "zod";

export const medicineInventoryInsertSchema = z.object({
  id: z.string().uuid({version: "v4"}).optional(),
  name: z.string().min(1, "Medicine name required"),
  type: z.string().optional(), // Tablet, Syrup, etc.
  strength: z.string().optional(),
  manufacturer: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export const medicineInventorySelectSchema = medicineInventoryInsertSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type MedicineInventoryInsert = z.infer<typeof medicineInventoryInsertSchema>;
export type MedicineInventorySelect = z.infer<typeof medicineInventorySelectSchema>;
