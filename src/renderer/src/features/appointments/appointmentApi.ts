import axios from "axios";

const API_URL = `http://localhost:3000/api/appointments`;

export interface Appointment {
  id?: string;
  patientId: string;
  paidStatus: boolean;
  paid: number;
  treatmentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

// ➕ Create a new appointment
export async function createAppointmentApi(data: Appointment){
  const res = await axios.post(API_URL, data);
  return res.data.data;
}

// ➕ Create appointments in bulk
export async function createAppointmentsByBulkApi(data: Appointment[]) {
  const res = await axios.post(`${API_URL}/bulk`, data);
  return res.data.data;
}

// 📋 Get all appointments
export async function getAllAppointmentsApi() {
  const res = await axios.get(API_URL);
  return res.data.data;
}

// 📅 Get today's appointments
export async function getTodayAppointmentsApi() {
  const res = await axios.get(`${API_URL}/today`);
  return res.data.data;
}

// 🔍 Get appointment by ID
export async function getAppointmentByIdApi(id: string){
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
}

// ✏️ Update appointment
export async function updateAppointmentApi(id: string, data: Appointment){
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data.data;
}

// ❌ Delete appointment
export async function deleteAppointmentApi(id: string){
  await axios.delete(`${API_URL}/${id}`);
}

// 🧹 Delete appointments in bulk
export async function deleteAppointmentsByBulkApi(ids: string[]){
  await axios.post(`${API_URL}/bulkdelete`, { ids });
}
