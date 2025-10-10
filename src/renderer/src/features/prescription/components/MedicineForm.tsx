import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addMedicine,
  updateMedicine,
  setEditingIndex,
} from "@/features/prescription";

export default function MedicineForm() {
  const dispatch = useAppDispatch();
  const { medicines, editingIndex } = useAppSelector((state) => state.prescription);

  const editingMedicine = editingIndex !== null ? medicines[editingIndex] : null;

  const handleSave = (form: typeof editingMedicine) => {
    if (!form) return;
    if (editingIndex !== null) {
      dispatch(updateMedicine({ index: editingIndex, data: form }));
      dispatch(setEditingIndex(null));
    } else {
      dispatch(addMedicine(form));
    }
  };

  const [form, setForm] = useState(
    editingMedicine || {
      name: "",
      dose: "",
      frequency: [] as string[],
      duration: "",
      remarks: "",
    }
  );

  // If editingIndex changes, update local form
  useEffect(() => {
    if (editingMedicine) setForm(editingMedicine);
  }, [editingMedicine]);

  return (
    <div>
      <label className="block mt-2 font-medium text-left p-2">Medicine Name</label>
      <Input
        placeholder="Medicine Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label className="block mt-4 font-medium text-left p-2">Dose</label>
      <Select
        value={form.dose}
        onValueChange={(val) => setForm({ ...form, dose: val })}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select Dose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1 Tablet">1 Tablet</SelectItem>
          <SelectItem value="2 Tablets">2 Tablets</SelectItem>
          <SelectItem value="5 ml">5 ml</SelectItem>
          <SelectItem value="10 ml">10 ml</SelectItem>
        </SelectContent>
      </Select>

      <label className="block mt-4 font-medium text-left p-2">Frequency</label>
      <div className="flex justify-around mt-2">
        {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
          <label key={time} className="flex items-center gap-2">
            <Checkbox
              checked={form.frequency.includes(time)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setForm({ ...form, frequency: [...form.frequency, time] });
                } else {
                  setForm({
                    ...form,
                    frequency: form.frequency.filter((f: string) => f !== time),
                  });
                }
              }}
            />
            {time}
          </label>
        ))}
      </div>

      <label className="block mt-4 font-medium text-left p-2">Duration</label>
      <Select
        value={form.duration}
        onValueChange={(val) => setForm({ ...form, duration: val })}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3 Days">3 Days</SelectItem>
          <SelectItem value="5 Days">5 Days</SelectItem>
          <SelectItem value="1 Week">1 Week</SelectItem>
          <SelectItem value="2 Weeks">2 Weeks</SelectItem>
        </SelectContent>
      </Select>

      <label className="block mt-4 font-medium text-left p-2">Remarks</label>
      <Textarea
        placeholder="Remarks"
        value={form.remarks}
        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
      />

      <Button className="mt-4" onClick={() => handleSave(form)}>
        {editingIndex !== null ? "Update Medicine" : "Add Medicine"}
      </Button>
    </div>
  );
}
