import { db } from "../utils/drizzle.js";
import { visits } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {randomUUID} from "crypto"

export async function createVisit(data) {
  const id = randomUUID();
  const row = {
    id,
    patientId: data.patientId,
    reason: data.reason || "",
    examinationFindings: data.examinationFindings || "",
    advice: data.advice || "",
    nextVisit: data.nextVisit || null,
  };

  const result = await db.insert(visits).values(row).returning();
  return result[0];
}

export async function getAllVisits() {
  return await db.select().from(visits).orderBy(visits.createdAt);
}


export async function getVisitsByPatient(patientId) {
  return await db.select().from(visits).where(eq(visits.patientId, patientId));
}


export async function getVisitById(id) {
  const rows = await db.select().from(visits).where(eq(visits.id, id));
  return rows[0] || null;
}


export async function updateVisit(id, data) {
  const toSet = {
    reason: data.reason,
    examinationFindings: data.examinationFindings,
    advice: data.advice,
    nextVisit: data.nextVisit,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(visits)
    .set(toSet)
    .where(eq(visits.id, id))
    .returning();

  return result[0] || null;
}


export async function deleteVisit(id) {
  await db.delete(visits).where(eq(visits.id, id));
  return { success: true, message: "Visit deleted successfully" };
}
