import { db } from "../utils/drizzle.js";
import { appointments, patients } from "../drizzle/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";
import { getLocalDateString, getLocalDateTimeString } from "../utils/date.js";

/* -------------------------------------------------------
 🩺 CREATE APPOINTMENT
------------------------------------------------------- */
export async function createAppointment(data) {
  data.createdAt = getLocalDateTimeString();
  data.updatedAt = getLocalDateTimeString();

  // Create appointment
  const result = await db.insert(appointments).values(data).returning();

  // Return with patient details if available
  return {
    ...result[0],
    name: data.name,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    address: data.address,
    lifestyleHabits: data?.lifestyleHabits ?? "",
    drugAllergies: data?.drugAllergies ?? "",
  };
}

/* -------------------------------------------------------
 📦 BULK CREATE APPOINTMENTS
------------------------------------------------------- */
export async function createAppointmentByBulk(dataArray) {
  const created = [];

  for (const data of dataArray) {
    data.createdAt = getLocalDateTimeString();
    data.updatedAt = getLocalDateTimeString();

    const result = await db
      .insert(appointments)
      .values(data.appointments)
      .returning();

    created.push({
      ...result[0],
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      lifestyleHabits: data?.lifestyleHabits ?? "",
      drugAllergies: data?.drugAllergies ?? "",
    });
  }

  return created;
}

/* -------------------------------------------------------
 📋 GET ALL APPOINTMENTS
------------------------------------------------------- */
export async function getAllAppointments() {
  const results = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      queueNumber: appointments.queueNumber,
      arrived: appointments.arrived,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,

      // Include full patient info
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
      lifestyleHabits: patients.lifestyleHabits,
      drugAllergies: patients.drugAllergies,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .orderBy(appointments.createdAt);

  return results;
}

/* -------------------------------------------------------
 📅 GET TODAY'S APPOINTMENTS
------------------------------------------------------- */
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
      queueNumber: appointments.queueNumber,
      arrived: appointments.arrived,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,

      // Patient details
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
      lifestyleHabits: patients.lifestyleHabits,
      drugAllergies: patients.drugAllergies,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(
      and(gte(appointments.createdAt, start), lte(appointments.createdAt, end)),
    )
    .orderBy(appointments.createdAt);

  return results;
}

/* -------------------------------------------------------
 🔍 GET APPOINTMENT BY ID
------------------------------------------------------- */
export async function getAppointmentById(id) {
  const result = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      queueNumber: appointments.queueNumber,
      arrived: appointments.arrived,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,

      // Patient details
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
      lifestyleHabits: patients.lifestyleHabits,
      drugAllergies: patients.drugAllergies,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.id, id));

  return result[0];
}

/* -------------------------------------------------------
 🔍 GET APPOINTMENTS BY PATIENT ID
------------------------------------------------------- */
export async function getAppointmentsByPatientId(patientId) {
  const results = await db
    .select({
      id: appointments.id,
      treatmentStatus: appointments.treatmentStatus,
      paidStatus: appointments.paidStatus,
      paid: appointments.paid,
      queueNumber: appointments.queueNumber,
      arrived: appointments.arrived,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientId: appointments.patientId,

      // Patient details
      name: patients.name,
      age: patients.age,
      gender: patients.gender,
      phone: patients.phone,
      address: patients.address,
      lifestyleHabits: patients.lifestyleHabits,
      drugAllergies: patients.drugAllergies,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(patients.id, patientId))
    .orderBy(appointments.createdAt);

  return results;
}

/* -------------------------------------------------------
 ✏️ UPDATE APPOINTMENT
------------------------------------------------------- */
export async function updateAppointment(id, data) {
  data.updatedAt = getLocalDateTimeString();

  // Patient fields
  const patient = {
    id: data.patientId,
    name: data.name,
    age: data.age,
    gender: data.gender,
    phone: data.phone,
    address: data.address,
    lifestyleHabits: data?.lifestyleHabits ?? "",
    drugAllergies: data?.drugAllergies ?? "",
  };

  // Appointment fields
  const appointment = {
    id: data.id,
    patientId: data.patientId,
    treatmentStatus: data.treatmentStatus,
    paidStatus: data.paidStatus,
    paid: data.paid,
    arrived: data.arrived ? 1 : 0,
    queueNumber: data.queueNumber,
  };

  // Update appointment
  await db
    .update(appointments)
    .set({ ...appointment, updatedAt: getLocalDateTimeString() })
    .where(eq(appointments.id, id));

  // Update patient info
  await db
    .update(patients)
    .set({ ...patient, updatedAt: getLocalDateTimeString() })
    .where(eq(patients.id, data.patientId));

  return getAppointmentById(id);
}

/* -------------------------------------------------------
 🗑️ DELETE SINGLE APPOINTMENT
------------------------------------------------------- */
export async function deleteAppointment(id) {
  const result = await db
    .delete(appointments)
    .where(eq(appointments.id, id))
    .returning();
  return result[0];
}

/* -------------------------------------------------------
 🧹 BULK DELETE
------------------------------------------------------- */
export async function deleteAppointmentsByBulk(ids) {
  for (const id of ids) {
    await db.delete(appointments).where(eq(appointments.id, id));
  }
  return { deleted: ids.length };
}
