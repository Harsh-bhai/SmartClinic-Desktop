import { db } from "../utils/drizzle.js"; // your drizzle db instance
import { medicines } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

export const getAllMedicinesService = async () => {
  return await db.select().from(medicines);
};

export const getMedicineByIdService = async (id) => {
  const result = await db.select().from(medicines).where(eq(medicines.id, id));
  return result[0] || null;
};

export const addMedicineService = async (data) => {
  await db.insert(medicines).values(data);
  return { message: "Medicine added successfully" };
};

export const updateMedicineService = async (id, data) => {
  await db.update(medicines).set(data).where(eq(medicines.id, id));
  return { message: "Medicine updated successfully" };
};

export const deleteMedicineService = async (id) => {
  await db.delete(medicines).where(eq(medicines.id, id));
  return { message: "Medicine deleted successfully" };
};
