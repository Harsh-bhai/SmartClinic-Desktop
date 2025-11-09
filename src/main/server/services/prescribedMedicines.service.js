import { db } from "../utils/drizzle.js";
import { prescribedMedicines } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { randomAlphaNumId } from "../utils/id.js";

// ✅ 1. Create prescribed medicine for a prescription
export async function createPrescribedMedicine(data) {
  const id = randomAlphaNumId();

  const row = {
    id,
    prescriptionId: data.prescriptionId,
    medicineId: data.medicineId || null,
    name: data.name,
    dose: data.dose,
    frequency: JSON.stringify(data.frequency || []),
    duration: data.duration,
    timing: data.timing,
    remarks: data.remarks || null,
  };

  const result = await db.insert(prescribedMedicines).values(row).returning();
  return result[0];
}


// ✅ 2. Get prescribed medicines by Prescription ID
export async function getPrescribedMedicinesByPrescriptionId(prescriptionId) {
  const result = await db
    .select()
    .from(prescribedMedicines)
    .where(eq(prescribedMedicines.prescriptionId, prescriptionId))
    .orderBy(prescribedMedicines.createdAt);
  return result;
}

// ✅ 3. Get prescribed medicines by Medicine ID (to track usage of a specific drug)
export async function getPrescribedMedicinesByMedicineId(medicineId) {
  const result = await db
    .select()
    .from(prescribedMedicines)
    .where(eq(prescribedMedicines.medicineId, medicineId))
    .orderBy(prescribedMedicines.createdAt);
  return result;
}

// ✅ 4. Get prescribed medicine by its ID
export async function getPrescribedMedicineById(id) {
  const result = await db
    .select()
    .from(prescribedMedicines)
    .where(eq(prescribedMedicines.id, id));
  return result[0] || null;
}

// ✅ 5. Update prescribed medicine by ID
export async function updatePrescribedMedicine(id, data) {
  const updated = {
    name: data.name,
    dose: data.dose,
    frequency: JSON.stringify(data.frequency || []),
    duration: data.duration,
    timing: data.timing,
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

// ✅ 6. Update prescribed medicine by prescriptionId + medicineId
export async function updatePrescribedMedicineByPrescriptionAndMedicineId(
  prescriptionId,
  medicineId,
  data
) {
  const updated = {
    name: data.name,
    dose: data.dose,
    frequency: JSON.stringify(data.frequency || []),
    duration: data.duration,
    timing: data.timing,
    remarks: data.remarks,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(prescribedMedicines)
    .set(updated)
    .where(
      and(
        eq(prescribedMedicines.prescriptionId, prescriptionId),
        eq(prescribedMedicines.medicineId, medicineId)
      )
    )
    .returning();

  return result[0] || null;
}

// ✅ 7. Delete prescribed medicine by ID
export async function deletePrescribedMedicine(id) {
  await db.delete(prescribedMedicines).where(eq(prescribedMedicines.id, id));
  return { success: true, message: "Prescribed medicine deleted successfully" };
}

// ✅ 8. Delete all prescribed medicines by Prescription ID (cleanup when deleting prescription)
export async function deletePrescribedMedicinesByPrescriptionId(prescriptionId) {
  await db
    .delete(prescribedMedicines)
    .where(eq(prescribedMedicines.prescriptionId, prescriptionId));
  return { success: true, message: "All medicines for prescription deleted" };
}
