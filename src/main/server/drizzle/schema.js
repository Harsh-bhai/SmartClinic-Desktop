import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 🧍 Patients Table
export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 📋 Visits Table
export const visits = sqliteTable("visits", {
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
  stock: integer("stock").default(0),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 💊 Prescribed Medicines Table
export const prescribedMedicines = sqliteTable("prescribed_medicines", {
  id: text("id").primaryKey().notNull(),
  visitId: text("visit_id")
    .notNull()
    .references(() => visits.id),
  medicineId: text("medicine_id").references(() => medicineInventory.id),
  name: text("name").notNull(),
  dose: text("dose").notNull(),
  frequency: blob("frequency", { mode: "json" }).notNull(),
  duration: text("duration").notNull(),
  remarks: text("remarks"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
