import axios from "axios";

const BASE_URL = "http://localhost:3000/api/medicine-inventory"; // adjust if needed

export interface Medicine {
  id?: string;
  name: string;
  type?: string;
  expectedDose?: string;
  manufacturer?: string;
  relatedDisease?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 🧪 1️⃣ Create a single medicine
export const createMedicineApi = async (data: Medicine) => {
  const response = await axios.post(BASE_URL, data);
  return response.data.data;
};

// 🧪 2️⃣ Create multiple medicines in one request
export const createMedicinesByBulkApi = async (data: Medicine[]) => {
  const response = await axios.post(`${BASE_URL}/bulk`, data);
  return response.data.data;
};

// 📋 3️⃣ Get all medicines
export const getAllMedicinesApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.data;
};

// 🔍 4️⃣ Get a specific medicine by ID
export const getMedicineByIdApi = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data.data;
};

// ✏️ 5️⃣ Update a medicine by ID
export const updateMedicineApi = async (id: string, data: Partial<Medicine>) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data.data;
};

// ❌ 6️⃣ Delete a medicine by ID
export const deleteMedicineApi = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data.data;
};
export const deleteMedicineByBulkApi = async (data: string[] ) => {
  const response = await axios.post(`${BASE_URL}/bulk`, data);
  return response.data.data;
};
export const deleteAllMedicinesApi = async () => {
  const response = await axios.delete(`${BASE_URL}/all`);
  return response.data.data;
};
