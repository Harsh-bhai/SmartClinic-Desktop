import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Patients Table
export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  medicalHistory: text("medical_history").notNull(),
  lifestyle: text("lifestyle").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Medicines Table
export const medicines = sqliteTable("medicines", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  frequency: blob("frequency", { mode: "json" }).notNull(), // matches z.array(z.string())
  duration: text("duration").notNull(),
  remarks: text("remarks").notNull(),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
