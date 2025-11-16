import axios from "axios";

// 🧩 Base URL for all appointment APIs
const API_BASE_URL = `http://localhost:3000/api/appointments`;

// 🧠 Appointment interface
export interface Appointment {
  id?: string;
  treatmentStatus: string;
  paidStatus: boolean;
  paid: number;
  createdAt?: string;
  updatedAt?: string;
  patientId: string;
  name?: string;
  age?: number;
  gender?: string;
  medicalHistory?: string;
  phone?: string;
  address?: string;
}

// 🌐 Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ➕ Create a single appointment
export const createAppointmentApi = async (data: Appointment) => {
  const response = await api.post("/", data);
  return response.data.data;
};

// ➕ Create multiple appointments (bulk)
export const createAppointmentByBulkApi = async (data: Appointment[]) => {
  const response = await api.post("/bulk", data);
  return response.data.data;
};

// 📋 Get all appointments
export const getAllAppointmentsApi = async () => {
  const response = await api.get("/");
  return response.data.data;
};

// 📅 Get today’s appointments
export const getTodayAppointmentsApi = async () => {
  const response = await api.get("/today");
  return response.data.data;
};

// 🔍 Get appointment by ID
export const getAppointmentByIdApi = async (id: string) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

// 🔍 Get appointments by patient ID
export const getAppointmentsByPatientIdApi = async (patientId: string) => {
  const response = await api.get(`/patient/${patientId}`);
  return response.data.data;
};

// ✏️ Update appointment
export const updateAppointmentApi = async (data: Appointment) => {
  const response = await api.put(`/${data.id}`, data);
  return response.data.data;
};

// 🗑️ Delete appointment by ID
export const deleteAppointmentApi = async (id: string) => {
  const response = await api.delete(`/${id}`);
  return response.data.data;
};

// 🧹 Delete multiple appointments
export const deleteAppointmentsByBulkApi = async (ids: string[]) => {
  const response = await api.post("/bulkdelete", { ids });
  return response.data.data;
};
