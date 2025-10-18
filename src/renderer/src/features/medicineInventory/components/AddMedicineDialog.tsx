"use client";

import { useState } from "react";
import { createMedicine } from "../medicineInventorySlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@renderer/app/hooks";

export default function createMedicineDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    strength: "",
    manufacturer: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await dispatch(createMedicine(formData));
    setFormData({
      name: "",
      type: "",
      strength: "",
      manufacturer: "",
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Medicine</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" value={formData.type} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="strength">Strength</Label>
            <Input id="strength" name="strength" value={formData.strength} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
