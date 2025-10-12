import { db } from "../utils/drizzle.js";
import { prescribedMedicines } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createPrescribedMedicine(data) {
  const id = randomUUID();

  const row = {
    id,
    visitId: data.visitId,
    medicineId: data.medicineId || null,
    name: data.name,
    dose: data.dose,
    frequency: JSON.stringify(data.frequency || []),
    duration: data.duration,
    remarks: data.remarks || null,
  };

  const result = await db.insert(prescribedMedicines).values(row).returning();
  return result[0];
}

export async function getAllPrescribedMedicines(visitId = null) {
  if (visitId) {
    return await db
      .select()
      .from(prescribedMedicines)
      .where(eq(prescribedMedicines.visitId, visitId))
      .orderBy(prescribedMedicines.createdAt);
  }

  return await db.select().from(prescribedMedicines).orderBy(prescribedMedicines.createdAt);
}

export async function getPrescribedMedicineById(id) {
  const result = await db.select().from(prescribedMedicines).where(eq(prescribedMedicines.id, id));
  return result[0] || null;
}

export async function updatePrescribedMedicine(id, data) {
  const updated = {
    name: data.name,
    dose: data.dose,
    frequency: JSON.stringify(data.frequency || []),
    duration: data.duration,
    remarks: data.remarks,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(prescribedMedicines)
    .set(updated)
    .where(eq(prescribedMedicines.id, id))
    .returning();

  return result[0] || null;
}

export async function deletePrescribedMedicine(id) {
  await db.delete(prescribedMedicines).where(eq(prescribedMedicines.id, id));
  return { success: true, message: "Prescribed medicine deleted successfully" };
}
