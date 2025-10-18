import { configureStore } from "@reduxjs/toolkit";
import prescriptionReducer from "@/features/fullPrescription/prescription/prescriptionSlice";
import prescribedMedicinesReducer from "@/features/fullPrescription/prescribedMedicines/prescribedMedicinesSlice";
import medicineInventoryReducer from "@/features/medicineInventory/medicineInventorySlice";
const store = configureStore({
  reducer: {
    prescription: prescriptionReducer,
    prescribedMedicines: prescribedMedicinesReducer,
    medicineInventory: medicineInventoryReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
