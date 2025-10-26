"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/app/hooks";
import {
  updateAppointment,
} from "@/features/appointments/appointmentSlice";
import type { ExtendedAppointment } from "@/features/appointments/appointmentSlice";

interface UpdateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPatient?: ExtendedAppointment | null;
}

const UpdateAppointmentDialog: React.FC<UpdateAppointmentDialogProps> = ({
  open,
  onOpenChange,
  selectedPatient = null,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ExtendedAppointment>({
    id: "",
    patientId: "",
    name: "",
    age: 0,
    gender: "",
    phone: "",
    address: "",
    paidStatus: false,
    paid: 0,
    treatmentStatus: "pending",
    queueNumber: 0,
    arrived: false,
  });

  // Prefill data if patient selected
  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        ...selectedPatient,
        queueNumber: 0,
        arrived: false,
      });
    } else {
      setFormData({
        id: "",
        patientId: "",
        name: "",
        age: 0,
        gender: "",
        phone: "",
        address: "",
        paidStatus: false,
        paid: 0,
        treatmentStatus: "pending",
        queueNumber: 0,
        arrived: false,
      });
    }
  }, [selectedPatient, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    await dispatch(updateAppointment(formData));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-8 rounded-2xl min-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedPatient
              ? "Create Appointment for Existing Patient"
              : "Add New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="Patient Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* 3-column layout */}
          <div className="grid grid-cols-3 gap-4">
            {/* Age */}
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                value={formData.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                placeholder="Contact Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              name="address"
              placeholder="Patient Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Payment Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between border rounded-md p-3">
              <Label>Payment Received</Label>
              <Switch
                checked={formData.paidStatus}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, paidStatus: checked }))
                }
              />
            </div>

            {formData.paidStatus && (
              <div>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  name="paid"
                  placeholder="Enter paid amount"
                  value={formData.paid}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export  {UpdateAppointmentDialog};
