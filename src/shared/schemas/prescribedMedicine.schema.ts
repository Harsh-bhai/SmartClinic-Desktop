import { z } from "zod";

export const prescribedMedicineInsertSchema = z.object({
  id: z.string().uuid({ version: "v4" }).optional(),
  visitId: z.string().uuid({ message: "Invalid visit ID" }),
  medicineId: z.string().uuid().optional(),
  name: z.string().min(1, "Medicine name required"),
  dose: z.string().min(1, "Dose required"),
  frequency: z.array(z.string()).nonempty("Frequency required"),
  duration: z.string().min(1, "Duration required"),
  remarks: z.string().optional(),
});

export const prescribedMedicineSelectSchema = prescribedMedicineInsertSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PrescribedMedicineInsert = z.infer<typeof prescribedMedicineInsertSchema>;
export type PrescribedMedicineSelect = z.infer<typeof prescribedMedicineSelectSchema>;
