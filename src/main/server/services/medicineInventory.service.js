import { db } from "../utils/drizzle.js";
import { medicineInventory } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createMedicine(data) {
  const id = randomUUID();
  const row = {
    id,
    name: data.name,
    type: data.type || null,
    expectedDose: data.expectedDose || null,
    manufacturer: data.manufacturer || null,
    relatedDisease: data.relatedDisease || null,
    notes: data.notes || null,
  };

  const result = await db.insert(medicineInventory).values(row).returning();
  return result[0];
}

export async function createMedicinesByBulk(dataArray) {
  
  dataArray.forEach(async (data) => {
    const id = randomUUID();
    const row = {
      id,
      name: data.name,
      type: data.type || null,
      expectedDose: data.expectedDose || null,
      manufacturer: data.manufacturer || null,
      relatedDisease: data.relatedDisease || null,
      notes: data.notes || null,
    };
    await db.insert(medicineInventory).values(row).returning();
  });
  return { success: true, message: "Medicines created successfully" };
}

export async function getAllMedicines() {
  return await db
    .select()
    .from(medicineInventory)
    .orderBy(medicineInventory.createdAt);
}

export async function getMedicineById(id) {
  const result = await db
    .select()
    .from(medicineInventory)
    .where(eq(medicineInventory.id, id));
  return result[0] || null;
}

export async function updateMedicine(id, data) {
  const updated = {
    name: data.name,
    type: data.type,
    expectedDose: data.expectedDose,
    manufacturer: data.manufacturer,
    relatedDisease: data.relatedDisease,
    notes: data.notes,
    updatedAt: new Date().toISOString(),
  };

  const result = await db
    .update(medicineInventory)
    .set(updated)
    .where(eq(medicineInventory.id, id))
    .returning();

  return result[0] || null;
}

export async function deleteMedicine(id) {
  await db.delete(medicineInventory).where(eq(medicineInventory.id, id));
  return;
}
export async function deleteMedicineByBulk(data) {
  data.forEach(async (id) => {
    await db.delete(medicineInventory).where(eq(medicineInventory.id, id));
  });
  return;
}
export async function deleteAllMedicine() {
  await db.delete(medicineInventory);
  return;
}
