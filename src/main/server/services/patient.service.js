// src/modules/patient/patient.service.js
import { db } from "../utils/drizzle.js";
import { patients, medicines } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const PatientService = {
  // ✅ Create a new patient
  async createPatient(data) {
    const id = randomUUID();

    await db.insert(patients).values({
      id,
      name: data.name,
      age: data.age,
      medicalHistory: data.medicalHistory || "",
      lifestyle: data.lifestyle || "",
    });

    return { id, ...data };
  },

  // ✅ Get all patients
  async getAllPatients() {
    return await db.select().from(patients);
  },

  // ✅ Get single patient with medicines
  async getPatientById(id) {
    const patient = await db.select().from(patients).where(eq(patients.id, id)).get();
    if (!patient) return null;

    const meds = await db.select().from(medicines).where(eq(medicines.patientId, id));
    return { ...patient, medicines: meds };
  },

  // ✅ Update patient
  async updatePatient(id, data) {
    await db
      .update(patients)
      .set({
        name: data.name,
        age: data.age,
        medicalHistory: data.medicalHistory,
        lifestyle: data.lifestyle,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(patients.id, id));

    return this.getPatientById(id);
  },

  // ✅ Delete patient (and related medicines)
  async deletePatient(id) {
    await db.delete(medicines).where(eq(medicines.patientId, id));
    await db.delete(patients).where(eq(patients.id, id));
    return { success: true };
  },
};
