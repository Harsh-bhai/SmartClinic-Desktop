import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Medicine } from "../medicineInventoryApi";


export default function MedicineList({
  medicines,
  onDelete,
}: {
  medicines: Medicine[];
  onDelete: (id: string) => void;
}) {
  if (medicines.length === 0) return <p>No medicines found.</p>;
  
  

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Strength</TableHead>
          <TableHead>Manufacturer</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((m) => 
          {
            console.log(m.name);
            return <TableRow key={m.id}>
            <TableCell>{m.name}</TableCell>
            <TableCell>{m.type}</TableCell>
            <TableCell>{m.strength}</TableCell>
            <TableCell>{m.manufacturer}</TableCell>
            <TableCell>{m.notes || "-"}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => onDelete(m.id!)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>}
        )}
      </TableBody>
    </Table>
  );
}
