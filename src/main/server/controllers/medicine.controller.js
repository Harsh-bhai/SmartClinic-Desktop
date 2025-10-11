import {
  getAllMedicinesService,
  getMedicineByIdService,
  addMedicineService,
  updateMedicineService,
  deleteMedicineService,
} from "../services/medicine.service.js";

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await getAllMedicinesService();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await getMedicineByIdService(req.params.id);
    if (!medicine) return res.status(404).json({ error: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const response = await addMedicineService(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const response = await updateMedicineService(req.params.id, req.body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const response = await deleteMedicineService(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
