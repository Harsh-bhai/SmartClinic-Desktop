import { configureStore } from "@reduxjs/toolkit";
import { prescriptionReducer } from "@/features/fullPrescription/prescription";
import { prescribedMedicinesReducer } from "@/features/fullPrescription/prescribedMedicines";
import { medicineInventoryReducer } from "@/features/medicineInventory";
import { patientReducer } from "@/features/patients";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { appointmentReducer } from "@/features/appointments";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["appointments"],
};

const reducer = combineReducers({
  prescription: prescriptionReducer,
  prescribedMedicines: prescribedMedicinesReducer,
  medicineInventory: medicineInventoryReducer,
  patient: patientReducer,
  appointments: appointmentReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
