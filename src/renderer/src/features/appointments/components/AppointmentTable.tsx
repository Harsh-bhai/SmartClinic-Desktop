"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  markArrivedToggle,
  deleteAppointment,
  deleteAppointmentsByBulk,
  setSelectedAppointment,
  completeAppointment,
} from "@/features/appointments/appointmentSlice";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ExtendedAppointment } from "@/features/appointments/appointmentSlice";
import { UpdateAppointmentDialog } from "./UpdateAppointmentDialog";
import { Link } from "react-router-dom";

interface AppointmentTableProps {
  newAppointments?: ExtendedAppointment[];
  completedAppointments?: ExtendedAppointment[];
  loading?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  newAppointments = [],
  completedAppointments = [],
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false)
  const { selectedAppointment } = useAppSelector((state) => state.appointments);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allIds = newAppointments.map((a) => a.id!);
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleEdit = (appointment: ExtendedAppointment) => {
    console.log(appointment, "here");
    
    dispatch(setSelectedAppointment(appointment));
    setDialogOpen(true);
  };

  const handlePrescription = (appointment: ExtendedAppointment) => {
    dispatch(setSelectedAppointment(appointment));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      dispatch(deleteAppointmentsByBulk(selectedIds));
      setSelectedIds([]);
    }
  };

  const handleBulkDone = () => {
    selectedIds.forEach((id) => dispatch(completeAppointment(id)));
    setSelectedIds([]);
  };

  const renderRow = (
    appointment: ExtendedAppointment,
    index: number,
    isCompleted = false,
  ) => (
    <TableRow key={appointment.id || index}>
      <TableCell>
        <Checkbox
          checked={selectedIds.includes(appointment.id!)}
          onCheckedChange={() => handleCheckboxChange(appointment.id!)}
        />
      </TableCell>
      <TableCell>{appointment.queueNumber ?? "-"}</TableCell>
      <TableCell>{appointment.name}</TableCell>
      <TableCell>{appointment.gender}</TableCell>
      <TableCell>{appointment.age}</TableCell>
      <TableCell>{appointment.phone}</TableCell>
      <TableCell>{appointment.paidStatus ? "Paid" : "Unpaid"}</TableCell>
      <TableCell>₹{appointment.paid}</TableCell>
      <TableCell>
        <Badge
          variant={
            appointment.treatmentStatus === "complete"
              ? "secondary"
              : appointment.arrived
              ? "default"
              : "outline"
          }
        >
          {appointment.treatmentStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Send (Prescription Mode) */}
          <Link to={`/prescription`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePrescription(appointment)}
              title="Open in prescription mode"
            >
              <Send className="h-4 w-4" />
            </Button>
          </Link>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleEdit(appointment)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>

              {!isCompleted && (
                <DropdownMenuItem
                  onClick={() => dispatch(markArrivedToggle(appointment.id!))}
                >
                  {appointment.arrived ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" /> Mark as Not Arrived
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" /> Mark as Arrived
                    </>
                  )}
                </DropdownMenuItem>
              )}

              {!isCompleted && (
                <DropdownMenuItem
                  onClick={() => dispatch(completeAppointment(appointment.id!))}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Done
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => dispatch(deleteAppointment(appointment.id!))}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="overflow-hidden border shadow-sm text-left">
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
          <p className="text-sm text-gray-700">
            {selectedIds.length} selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkDone}
              disabled={!selectedIds.length}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Done
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={!selectedIds.length}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === newAppointments.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Queue</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Paid ₹</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : newAppointments.length || completedAppointments.length ? (
              <>
                {newAppointments.map((a, i) => renderRow(a, i, false))}
                {completedAppointments.map((a, i) => renderRow(a, i, true))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
            <UpdateAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedPatient={selectedAppointment}
      />
    </Card>
  );
};

export { AppointmentTable };
