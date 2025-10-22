import axios from "axios";

// 🏥 Base API URL (adjust if your backend runs elsewhere)
const API_URL = "http://localhost:3000/api/patients";

// 🌱 Patient Type
export interface Patient {
  id?: string;
  name: string;
  age: number;
  gender: string;
  paidStatus: boolean;
  paid: number;
  phone?: string;
  address?: string;
  treatment: string;
  createdAt?: string;
  updatedAt?: string;
}

// ➕ Create new patient
export const createPatientApi = async (data: Patient) => {
  const response = await axios.post(API_URL, data);
  return response.data.data;
};

// 📋 Get all patients
export const getAllPatientsApi = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// 🔍 Get single patient by ID
export const getPatientByIdApi = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// ✏️ Update patient by ID
export const updatePatientApi = async (id: string, data: Partial<Patient>) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data.data;
};

// ❌ Delete patient by ID
export const deletePatientApi = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// 🗑️ Bulk delete patients
export const deletePatientByBulkApi = async (ids: string[]) => {
  const response = await axios.post(`${API_URL}/bulkdelete`, ids);
  return response.data;
};
