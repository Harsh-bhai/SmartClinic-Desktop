import { configureStore } from "@reduxjs/toolkit";
import { prescriptionReducer } from "@/features/fullPrescription/prescription";
import { prescribedMedicinesReducer } from "@/features/fullPrescription/prescribedMedicines";
import { medicineInventoryReducer } from "@/features/medicineInventory";
import { patientReducer } from "@/features/patients";
import { combineReducers } from "@reduxjs/toolkit";
import { appointmentReducer } from "@/features/appointments";

const reducer = combineReducers({
  prescription: prescriptionReducer,
  prescribedMedicines: prescribedMedicinesReducer,
  medicineInventory: medicineInventoryReducer,
  patient: patientReducer,
  appointments: appointmentReducer,
});

const store = configureStore({
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
