import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Medicine } from "../medicineInventorySlice";

interface MedicineTableProps {
  medicines: Medicine[];
  onDelete: (id: string) => void;
}

export function MedicineTable({ medicines, onDelete }: MedicineTableProps) {
  if (medicines.length === 0) {
    return <p className="text-sm text-gray-500">No medicines available.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Manufacturer</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((med) => (
          <TableRow key={med.id}>
            <TableCell>{med.name}</TableCell>
            <TableCell>{med.strength}</TableCell>
            <TableCell>{med.manufacturer}</TableCell>
            <TableCell>{med.notes}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => med.id && onDelete(med.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
