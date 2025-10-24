import { db } from "../utils/drizzle.js";
import { appointments, patients } from "../drizzle/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

// 🧩 Create new appointment
export async function createAppointment(data) {
  data.appointments.id = randomUUID();

  const result = await db.insert(appointments).values(data.appointments).returning();
  return {
    appointments: result[0],
    patient: data.patient || null,
  };
}

export async function createAppointmentByBulk(dataArray) {
  const inserted = [];

  for (const data of dataArray) {
    data.appointments.id = randomUUID();
    const res = await db.insert(appointments).values(data.appointments).returning();
    inserted.push({
      appointments: res[0],
      patient: data.patient || null,
    });
  }

  return inserted;
}

// 📋 Get all appointments
export async function getAllAppointments() {
  const results = await db
    .select({
      appointmentId: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      patientName: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .orderBy(appointments.createdAt);

  // 🧠 Transform into { appointments: {...}, patient: {...} } structure
  return results.map((r) => ({
    appointments: {
      id: r.appointmentId,
      treatmentStatus: r.treatmentStatus,
      paidStatus: r.paidStatus,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      patientId: r.patientId,
    },
    patient: {
      patientId: r.patientId,
      name: r.patientName,
      age: r.age,
      gender: r.gender,
      phone: r.phone,
      address: r.address,
    },
  }));
}

// 📅 Get today's appointments
export async function getTodayAppointments() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  const results = await db
    .select({
      appointmentId: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      patientName: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(gte(appointments.createdAt, startOfDay), lte(appointments.createdAt, endOfDay)))
    .orderBy(appointments.createdAt);

  return results.map((r) => ({
    appointments: {
      id: r.appointmentId,
      treatmentStatus: r.treatmentStatus,
      paidStatus: r.paidStatus,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      patientId: r.patientId,
    },
    patient: {
      patientId: r.patientId,
      name: r.patientName,
      age: r.age,
      gender: r.gender,
      phone: r.phone,
      address: r.address,
    },
  }));
}

// 🔍 Get appointment by ID
export async function getAppointmentById(id) {
  const result = await db
    .select({
      appointmentId: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      patientName: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.id, id));

  if (!result.length) return null;

  const r = result[0];
  return {
    appointments: {
      id: r.appointmentId,
      treatmentStatus: r.treatmentStatus,
      paidStatus: r.paidStatus,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      patientId: r.patientId,
    },
    patient: {
      patientId: r.patientId,
      name: r.patientName,
      age: r.age,
      gender: r.gender,
      phone: r.phone,
      address: r.address,
    },
  };
}

// 🔍 Get all appointments by patient ID
export async function getAppointmentsByPatientId(patientId) {
  const results = await db
    .select({
      appointmentId: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      patientName: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(patients.id, patientId))
    .orderBy(appointments.createdAt);

  return results.map((r) => ({
    appointments: {
      id: r.appointmentId,
      treatmentStatus: r.treatmentStatus,
      paidStatus: r.paidStatus,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      patientId: r.patientId,
    },
    patient: {
      patientId: r.patientId,
      name: r.patientName,
      age: r.age,
      gender: r.gender,
      phone: r.phone,
      address: r.address,
    },
  }));
}

// ✅ Update appointment by ID
export async function updateAppointment(id, data) {
  await db
    .update(appointments)
    .set({ ...data.appointments, updatedAt: new Date().toISOString() })
    .where(eq(appointments.id, id));

  await db
    .update(patients)
    .set({ ...data.patient, updatedAt: new Date().toISOString() })
    .where(eq(patients.id, data.patient.patientId));

  return getAppointmentById(id);
}

// 🗑️ Delete appointment by ID
export async function deleteAppointment(id) {
  const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
  return result[0];
}

// 🧹 Bulk delete
export async function deleteAppointmentsByBulk(ids) {
  for (const id of ids) {
    await db.delete(appointments).where(eq(appointments.id, id));
  }
  return { deleted: ids.length };
}
