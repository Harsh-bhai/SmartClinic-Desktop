import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const patients = sqliteTable("patients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  medicalHistory: text("medical_history"),
  lifestyle: text("lifestyle"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export const medicines = sqliteTable("medicines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  frequency: text("frequency"), // store JSON as string
  duration: text("duration"),
  remarks: text("remarks"),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});
