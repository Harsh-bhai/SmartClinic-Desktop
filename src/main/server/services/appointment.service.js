import { db } from "../utils/drizzle.js";
import { appointments } from "../drizzle/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

// 🧩 Create new appointment
export async function createAppointment(data) {
  data.id = randomUUID();
  const result = await db.insert(appointments).values(data).returning();
  return result[0];
}
export async function createAppointmentByBulk(dataArray) {
  dataArray.forEach(async (data) => {
    data.id = randomUUID();
    await db.insert(appointments).values(data).returning();
  });
  return;
}

// 📋 Get all appointments
export async function getAllAppointments() {
  return await db.select().from(appointments).orderBy(appointments.createdAt);
}

// 📅 Get all appointments of today
export async function getTodayAppointments() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  const result = await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.createdAt, startOfDay),
        lte(appointments.createdAt, endOfDay),
      ),
    );
  return result;
}

// 🔍 Get single appointment by ID
export async function getAppointmentById(id) {
  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id));
  return result[0];
}

// ✅ Update appointment by ID
export async function updateAppointment(id, data) {
  const result = await db
    .update(appointments)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(appointments.id, id))
    .returning();
  return result[0];
}

// 🗑️ Delete appointment by ID
export async function deleteAppointment(id) {
  const result = await db
    .delete(appointments)
    .where(eq(appointments.id, id))
    .returning();
  return result[0];
}

// 🧹 Delete appointments in bulk
export async function deleteAppointmentsByBulk(data) {
  for (const id of data) {
    await db.delete(appointments).where(eq(appointments.id, id));
  }
  return;
}
