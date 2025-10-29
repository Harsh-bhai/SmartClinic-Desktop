import { db } from "../utils/drizzle.js";
import { appointments, patients } from "../drizzle/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";
import { getLocalDateString, getLocalDateTimeString } from "../utils/date.js";

//FIXME - gettodayappointment fixed, create appointment api is not calling after we select patient from patient serach box, arrived/completed is not persisting after refresh

// 🧩 Create new appointment
export async function createAppointment(data) {
  data.createdAt = getLocalDateTimeString();
  data.updatedAt = getLocalDateTimeString();

  const result = await db.insert(appointments).values(data).returning();

  // Return single flat object
  return {
    ...result[0],
    name: data.name,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    address: data.address,
  };
}

// 🧩 Create appointments in bulk
export async function createAppointmentByBulk(dataArray) {
  const created = [];

  for (const data of dataArray) {
    data.createdAt = getLocalDateTimeString();
    data.updatedAt = getLocalDateTimeString();

    const result = await db.insert(appointments).values(data.appointments).returning();

    created.push({
      ...result[0],
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
    });
  }

  return created;
}

// 📋 Get all appointments
export async function getAllAppointments() {
  const results = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .orderBy(appointments.createdAt);

  return results;
}

// 📅 Get today's appointments (purely local)
export async function getTodayAppointments() {
  const today = getLocalDateString();
  const start = `${today} 00:00:00`;
  const end = `${today} 23:59:59`;

  const results = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(
      and(
        gte(appointments.createdAt, start),
        lte(appointments.createdAt, end)
      )
    )
    .orderBy(appointments.createdAt);

  return results;
}

// 🔍 Get appointment by ID
export async function getAppointmentById(id) {
  const result = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.id, id));

  return result[0];
}

// 🔍 Get appointments by patient ID
export async function getAppointmentsByPatientId(patientId) {
  const results = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(patients.id, patientId))
    .orderBy(appointments.createdAt);

  return results;
}

// ✅ Update appointment by ID
export async function updateAppointment(id, data) {
  data.updatedAt = getLocalDateTimeString();

  const patient = {
    id: data.patientId,
    name: data.name,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    address: data.address,
  };

  const appointment = {
    id: data.id,
    patientId: data.patientId,
    treatmentStatus: data.treatmentStatus,
    paidStatus: data.paidStatus,
    paid: data.paid,
  };

  await db
    .update(appointments)
    .set({ ...appointment, updatedAt: getLocalDateTimeString() })
    .where(eq(appointments.id, id));

  await db
    .update(patients)
    .set({ ...patient, updatedAt: getLocalDateTimeString() })
    .where(eq(patients.id, data.patientId));

  return getAppointmentById(id);
}

// 🗑️ Delete appointment by ID
export async function deleteAppointment(id) {
  const result = await db
    .delete(appointments)
    .where(eq(appointments.id, id))
    .returning();

  return result[0];
}

// 🧹 Bulk delete
export async function deleteAppointmentsByBulk(ids) {
  for (const id of ids) {
    await db.delete(appointments).where(eq(appointments.id, id));
  }
  return { deleted: ids.length };
}
