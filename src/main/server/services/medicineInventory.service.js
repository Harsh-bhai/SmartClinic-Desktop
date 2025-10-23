import { db } from "../utils/drizzle.js";
import { medicineInventory } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createMedicine(data) {
  data.id = randomUUID();
  const result = await db.insert(medicineInventory).values(data).returning();
  return result[0];
}

export async function createMedicinesByBulk(dataArray) {
  dataArray.forEach(async (data) => {
    data.id = randomUUID();
    await db.insert(medicineInventory).values(data).returning();
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
  const result = await db
    .update(medicineInventory)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(medicineInventory.id, id))
    .returning();
  return result[0];
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
