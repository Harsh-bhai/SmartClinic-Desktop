"use client";

import { useEffect } from "react";
import { fetchAllMedicines } from "@/features/medicineInventory";


import MedicineList from "./components/MedicineList";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";

export default function MedicineInventoryPage() {
  const dispatch = useAppDispatch();
  const { medicines, loading, error } = useAppSelector(
    (state) => state.medicineInventory
  );


  useEffect(() => {
    dispatch(fetchAllMedicines());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medicine Inventory</h2>
        
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <MedicineList medicines={medicines}  />
      
    </div>
  );
}
