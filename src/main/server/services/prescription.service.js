import { db } from "../utils/drizzle.js";
import { prescriptions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import {uuidv4} from "crypto"
import { getLocalDateTimeString } from "../utils/date.js";

export async function createPrescription(data) {
  const id = uuidv4();
  const row = {
    id,
    patientId: data.patientId,
    reason: data.reason || "",
    examinationFindings: data.examinationFindings || "",
    advice: data.advice || "",
    nextVisit: data.nextVisit || null,
  };

  const result = await db.insert(prescriptions).values(row).returning();
  return result[0];
}

export async function getAllPrescriptions() {
  return await db.select().from(prescriptions).orderBy(prescriptions.createdAt);
}


export async function getPrescriptionsByPatient(patientId) {
  return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
}


export async function getPrescriptionById(id) {
  const rows = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
  return rows[0] || null;
}


export async function updatePrescription(id, data) {
  const toSet = {
    reason: data.reason,
    examinationFindings: data.examinationFindings,
    advice: data.advice,
    nextVisit: data.nextVisit,
    updatedAt: getLocalDateTimeString()
  };

  const result = await db
    .update(prescriptions)
    .set(toSet)
    .where(eq(prescriptions.id, id))
    .returning();

  return result[0] || null;
}


export async function deletePrescription(id) {
  await db.delete(prescriptions).where(eq(prescriptions.id, id));
  return { success: true, message: "Prescription deleted successfully" };
}
