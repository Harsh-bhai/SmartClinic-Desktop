import { z } from "zod";

export const visitInsertSchema = z.object({
  id: z.string().uuid({ version: "v4" }).optional(),
  patientId: z.string().uuid({ message: "Invalid patient ID" }),
  reason: z.string().min(1, "Reason required"),
  examinationFindings: z.string().min(1, "Examination findings required"),
  advice: z.string().min(1, "Advice required"),
  nextVisit: z.string().optional(), // store as text (date string)
});

export const visitSelectSchema = visitInsertSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type VisitInsert = z.infer<typeof visitInsertSchema>;
export type VisitSelect = z.infer<typeof visitSelectSchema>;
