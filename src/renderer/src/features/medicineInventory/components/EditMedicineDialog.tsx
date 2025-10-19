"use client";

import { useEffect, useState } from "react";
import { updateMedicine } from "../medicineInventorySlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@renderer/app/hooks";
import { Medicine } from "../medicineInventoryApi";

interface EditMedicineDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  medicine: Medicine
}

export default function EditMedicineDialog({
  open,
  setOpen,
  medicine,
}: EditMedicineDialogProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    relatedDisease: "",
    expectedDose: "",
    manufacturer: "",
    notes: "",
  });

  // prefill form when medicine changes
  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || "",
        type: medicine.type || "",
        relatedDisease: medicine.relatedDisease || "",
        expectedDose: medicine.expectedDose || "",
        manufacturer: medicine.manufacturer || "",
        notes: medicine.notes || "",
      });
    }
  }, [medicine]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = async () => {
    if (!medicine?.id) return;
    await dispatch(updateMedicine({ id: medicine.id, data: formData }));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Edit Medicine
          </DialogTitle>
        </DialogHeader>

        {/* Name */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter medicine name"
            className="h-11 text-base"
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {/* Type */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="type" className="text-base font-medium">
              Type
            </Label>
            <Select onValueChange={handleTypeChange} value={formData.type}>
              <SelectTrigger id="type" className="h-11 text-base">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Tablet",
                  "Mouthwash",
                  "Gel",
                  "Syrup",
                  "Toothpaste",
                  "Injection",
                  "Brush",
                ].map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Manufacturer */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="manufacturer" className="text-base font-medium">
              Manufacturer
            </Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer name"
              className="h-11 text-base"
            />
          </div>

          {/* Expected Dose */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="expectedDose" className="text-base font-medium">
              Expected Dose
            </Label>
            <Input
              id="expectedDose"
              name="expectedDose"
              value={formData.expectedDose}
              onChange={handleChange}
              placeholder="e.g. 1 tablet twice a day"
              className="h-11 text-base"
            />
          </div>

          {/* Related Disease */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="relatedDisease" className="text-base font-medium">
              Related Disease
            </Label>
            <Input
              id="relatedDisease"
              name="relatedDisease"
              value={formData.relatedDisease}
              onChange={handleChange}
              placeholder="e.g. Gum swelling, Tooth infection"
              className="h-11 text-base"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col space-y-2 col-span-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add special instructions (e.g. avoid spicy food, take after meal)"
              className="min-h-[100px] text-base resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSubmit}
            className="px-8 py-2 text-base font-medium"
          >
            Update Medicine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
