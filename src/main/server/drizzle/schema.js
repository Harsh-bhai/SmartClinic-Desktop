import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

//TODO - use zod schema in express  

// 🧍 Patients Table
export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  paidStatus: integer("paid_status", {mode:"boolean"}).notNull().default(0),
  paid: integer("paid").notNull().default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 📋 Prescription Table
export const prescription = sqliteTable("prescription", {
  id: text("id").primaryKey().notNull(),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),
  reason: text("reason").notNull(),
  examinationFindings: text("examination_findings").notNull(),
  advice: text("advice").notNull(),
  nextVisit: text("next_visit"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 🏥 Medicine Inventory Table
export const medicineInventory = sqliteTable("medicine_inventory", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  type: text("type"), // e.g. Tablet, Syrup
  strength: text("strength"),
  manufacturer: text("manufacturer"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 💊 Prescribed Medicines Table
export const prescribedMedicines = sqliteTable("prescribed_medicines", {
  id: text("id").primaryKey().notNull(),
  prescriptionId: text("prescription_id")
    .notNull()
    .references(() => prescription.id),
  medicineId: text("medicine_id").references(() => medicineInventory.id),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  frequency: blob("frequency", { mode: "json" }).notNull(),
  duration: text("duration").notNull(),
  timing: text("timing"),
  remarks: text("remarks"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
