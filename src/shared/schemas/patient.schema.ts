import { z } from "zod";

// Medicine Schema
export const medicineSchema = z.object({
  name: z.string(),
  dose: z.string(),
  frequency: z.array(z.string()),
  duration: z.string(),
  remarks: z.string(),
});

// Patient Schema
export const patientSchema = z.object({
  name: z.string(),
  age: z.int(),
  medicalHistory: z.string(),
  lifestyle: z.string(),
  medicines: z.array(medicineSchema).optional(),
});

// PrescriptionState Schema
export const prescriptionStateSchema = z.object({
  activeTab: z.enum(["patient", "medicines"]),
  patient: patientSchema,
  medicines: z.array(medicineSchema),
  editingIndex: z.number().nullable(),
});

// ✅ Types inferred from schemas
export type Medicine = z.infer<typeof medicineSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type PrescriptionState = z.infer<typeof prescriptionStateSchema>;
