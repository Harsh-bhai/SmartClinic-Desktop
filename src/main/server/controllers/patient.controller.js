import { Request, Response, NextFunction } from "express";
import * as patientService from "../services/patient.service";
import { patientSchema } from "../../../shared/schemas/patient.schema";

export const createPatient = async (req, res, next) => {
  try {
    const parsed = patientSchema.parse(req.body); // ✅ Validate with Zod
    const patient = await patientService.createPatient(parsed);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

export const getPatients = async (_, res, next) => {
  try {
    const patients = await patientService.getPatients();
    res.json(patients);
  } catch (err) {
    next(err);
  }
};
