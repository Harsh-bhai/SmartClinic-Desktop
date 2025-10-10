import { Router } from "express";
import { createPatient, getPatients } from "../controllers/patient.controller";

const router = Router();

router.post("/", createPatient);
router.get("/", getPatients);

export default router;
