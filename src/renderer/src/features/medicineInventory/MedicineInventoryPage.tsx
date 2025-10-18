"use client";

import { useEffect, useState } from "react";
import { fetchAllMedicines , deleteMedicine } from "./medicineInventorySlice";
import { Button } from "@/components/ui/button";
import AddMedicineDialog from "./components/AddMedicineDialog";
import MedicineList from "./components/MedicineList";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";

export default function MedicineInventoryPage() {
  const dispatch = useAppDispatch();
  const { medicines, loading, error } = useAppSelector(
    (state) => state.medicineInventory
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllMedicines());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteMedicine(id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medicine Inventory</h2>
        <Button onClick={() => setOpen(true)}>Add Medicine</Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <MedicineList medicines={medicines} onDelete={handleDelete} />
      <AddMedicineDialog open={open} setOpen={setOpen} />
    </div>
  );
}
