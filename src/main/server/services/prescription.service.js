import { db } from "../utils/drizzle.js";
import { prescriptions } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { getLocalDateTimeString } from "../utils/date.js";
import { randomAlphaNumId } from "../utils/id.js";

/**
 * CREATE Prescription
 */
export async function createPrescription(data) {
  const id = randomAlphaNumId();

  const row = {
    id,
    patientId: data.patientId,
    appointmentId: data.appointmentId || null,
    complain: data.complain || "",
    symptoms: data.symptoms || "",
    notes: data.notes || "",
    vitals: data.vitals || {}, // JSON object
    examinationFindings: data.examinationFindings || "",
    advice: data.advice || "",
    nextVisit: data.nextVisit || "",
  };

  const result = await db.insert(prescriptions).values(row).returning();
  return result[0];
}

/**
 * GET All prescriptions
 */
export async function getAllPrescriptions() {
  return await db
    .select()
    .from(prescriptions)
    .orderBy(prescriptions.createdAt);
}

/**
 * GET prescriptions for a specific patient
 */
export async function getPrescriptionsByPatient(patientId) {
  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.patientId, patientId));
}

/**
 * GET prescription by ID
 */
export async function getPrescriptionById(id) {
  const rows = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, id));

  return rows[0] || null;
}

/**
 * UPDATE Prescription
 */
export async function updatePrescription(id, data) {
  const toSet = {
    complain: data.complain,
    symptoms: data.symptoms,
    notes: data.notes,
    vitals: data.vitals || {},
    examinationFindings: data.examinationFindings,
    advice: data.advice,
    nextVisit: data.nextVisit,
    updatedAt: getLocalDateTimeString(),
  };

  const result = await db
    .update(prescriptions)
    .set(toSet)
    .where(eq(prescriptions.id, id))
    .returning();

  return result[0] || null;
}

/**
 * DELETE Prescription
 */
export async function deletePrescription(id) {
  await db.delete(prescriptions).where(eq(prescriptions.id, id));
  return { success: true, message: "Prescription deleted successfully" };
}
