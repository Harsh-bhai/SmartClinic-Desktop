import { Medicine } from "../medicineInventoryApi";
import DataTable from "@renderer/features/medicineInventory/components/medicineInventoryDataTable";

export default function MedicineList({ medicines }: { medicines: Medicine[] }) {
  if (medicines.length === 0) return <p>No medicines found.</p>;

  return <DataTable medicines={medicines} />;
}
