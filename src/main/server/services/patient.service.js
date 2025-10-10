import {db} from "../utils/drizzle.js"
import { Patient } from "../../../shared/schemas/patient.schema"

export const createPatient = async (data) => {
  return prisma.patient.create({
    data: {
      name: data.name,
      age: data.age,
      medicalHistory: data.medicalHistory,
      lifestyle: data.lifestyle,
      medicines: data.medicines
        ? {
            create: data.medicines.map((med) => ({
              name: med.name,
              dose: med.dose,
              frequency: med.frequency,
              duration: med.duration,
              remarks: med.remarks,
            })),
          }
        : undefined,
    },
    include: { medicines: true },
  });
};

export const getPatients = async () => {
  return prisma.patient.findMany({
    include: { medicines: true },
  });
};
