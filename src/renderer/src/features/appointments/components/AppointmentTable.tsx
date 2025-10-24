"use client";

import React from "react";
import { useAppDispatch } from "@/app/hooks";
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
  markArrived,
  markCompleted,
  deleteAppointment,
} from "@/features/appointments/appointmentSlice";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trash2, UserCheck } from "lucide-react";

interface AppointmentTableProps {
  newAppointments?: any[];
  completedAppointments?: any[];
  loading?: boolean;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  newAppointments = [],
  completedAppointments = [],
  loading = false,
}) => {
  const dispatch = useAppDispatch();

  const renderRow = (appointment: any, index: number, isCompleted = false) => (
    <TableRow key={appointment.id || index}>
      <TableCell className="font-medium">{appointment.queueNumber}</TableCell>
      <TableCell>{appointment.name}</TableCell>
      <TableCell>{appointment.gender}</TableCell>
      <TableCell>{appointment.age}</TableCell>
      <TableCell>{appointment.phone}</TableCell>
      <TableCell>{appointment.paidStatus ? "Paid" : "Unpaid"}</TableCell>
      <TableCell>₹{appointment.paid || 0}</TableCell>
      <TableCell>
        <Badge
          variant={
            appointment.appointmentStatus === "completed"
              ? "secondary"
              : appointment.arrived
              ? "default"
              : "outline"
          }
        >
          {appointment.appointmentStatus}
        </Badge>
      </TableCell>
      <TableCell className="flex gap-2">
        {!isCompleted && (
          <>
            {!appointment.arrived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch(markArrived(appointment.id))
                }
              >
                <UserCheck className="h-4 w-4 mr-1" /> Arrived
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                dispatch(markCompleted(appointment.id))
              }
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Done
            </Button>
          </>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => dispatch(deleteAppointment(appointment.id))}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={9} className="text-center py-6">
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : newAppointments.length || completedAppointments.length ? (
              <>
                {newAppointments.map((a, i) => renderRow(a, i, false))}
                {completedAppointments.map((a, i) =>
                  renderRow(a, i, true),
                )}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default AppointmentTable;
