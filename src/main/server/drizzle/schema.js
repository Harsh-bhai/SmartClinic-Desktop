import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// TODO - use zod schema in express  

// 🧍 Patients Table
export const patients = sqliteTable("patients", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone"),
  address: text("address"),
  medicalHistory: text("medical_history").default("No known history"),
  lifestyleHabits: text("lifestyle_habits").default("No addiction as per patient"),
  drugAllergies: text("drug_allergies").default("No known drug allergies"),

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 🧾 Appointment Table
export const appointments = sqliteTable("appointment", {
  id: text("id").primaryKey().notNull(),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),
  paidStatus: integer("paid_status", { mode: "boolean" })
    .notNull()
    .default(0),
  paid: integer("paid").notNull().default(0),
  treatmentStatus: text("treatment").notNull().default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 📋 Prescription Table (expanded)
export const prescriptions = sqliteTable("prescription", {
  id: text("id").primaryKey().notNull(),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id),
  complain: text("complain").notNull(),
  symptoms: text("symptoms"),
  notes: text("notes"),
  vitals: blob("vitals", { mode: "json" }),
  // 👨‍⚕️ Examination findings (G/E, CVS, R/S, etc.)
  examinationFindings: blob("examination_findings", { mode: "json" }),
  advice: text("advice"),
  nextVisit: text("next_visit"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 🏥 Medicine Inventory Table
export const medicineInventory = sqliteTable("medicine_inventory", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  type: text("type"), // e.g. Tablet, Syrup
  expectedDose: text("expected_dose"),
  manufacturer: text("manufacturer"),
  relatedDisease: text("related_disease"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 💊 Prescribed Medicines Table
export const prescribedMedicines = sqliteTable("prescribed_medicines", {
  id: text("id").primaryKey().notNull(),
  prescriptionId: text("prescription_id")
    .notNull()
    .references(() => prescriptions.id),
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
