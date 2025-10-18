import { z } from "zod";

export const patientInsertSchema = z.object({
  id: z.string().uuid({ version: "v4" }).optional(),
  name: z.string().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be positive"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(5, "Phone number required"),
  address: z.string().min(1, "Address required"),
});

export const patientSelectSchema = patientInsertSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PatientInsert = z.infer<typeof patientInsertSchema>;
export type PatientSelect = z.infer<typeof patientSelectSchema>;
