import { db } from "../utils/drizzle.js";
import { patients } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Create new patient
export async function createPatient(data) {
  data.id = uuidv4();
  const result = await db.insert(patients).values(data).returning();
  return result[0];
}

// Get all patients
export async function getAllPatients() {
  return await db.select().from(patients).orderBy(patients.createdAt);
}

// Get all patients of today
export async function getAllPatientsOfToday() {
  return await db.select().from(patients).where(eq(patients.createdAt, new Date().toISOString()));
}

// Get single patient by ID
export async function getPatientById(id) {
  const result = await db.select().from(patients).where(eq(patients.id, id));
  return result[0];
}

// Update patient by ID
export async function updatePatient(id, data) {
  const result = await db
    .update(patients)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(patients.id, id))
    .returning();
  return result[0];
}

// Delete patient by ID
export async function deletePatient(id) {
  const result = await db.delete(patients).where(eq(patients.id, id)).returning();
  return result[0];
}

// Delete patient in bulk
export async function deletePatientByBulk(data) {
  data.forEach(async (id) => {
    await db.delete(patients).where(eq(patients.id, id));
  });
  return;
}
