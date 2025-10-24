import { Medicine } from "@/features/medicineInventory";
import DataTable from "@renderer/features/medicineInventory/components/medicineInventoryDataTable";

export default function MedicineList({ medicines }: { medicines: Medicine[] }) {
  return <DataTable medicines={medicines} />;
}
