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
    strength: data.strength || null,
    manufacturer: data.manufacturer || null,
    stock: data.stock ?? 0,
    notes: data.notes || null,
  };

  const result = await db.insert(medicineInventory).values(row).returning();
  return result[0];
}

export async function getAllMedicines() {
  return await db.select().from(medicineInventory).orderBy(medicineInventory.createdAt);
}

export async function getMedicineById(id) {
  const result = await db.select().from(medicineInventory).where(eq(medicineInventory.id, id));
  return result[0] || null;
}

export async function updateMedicine(id, data) {
  const updated = {
    name: data.name,
    type: data.type,
    strength: data.strength,
    manufacturer: data.manufacturer,
    stock: data.stock,
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
  return { success: true, message: "Medicine deleted successfully" };
}
