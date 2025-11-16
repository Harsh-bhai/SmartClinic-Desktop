import {  useRef } from "react";
import { useAppSelector } from "@/app/hooks";
import { PrescriptionForm } from "./components/PrescriptionForm";
import { randomAlphaNumId } from "@renderer/lib/id";

export default function PrescriptionPage() {
  // Generate ID once per page load
  const generatedPrescriptionId = useRef(randomAlphaNumId()).current;

  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment
  );

  if (!selectedAppointment)
    return <div className="p-6">No appointment selected.</div>;

  return (
    <PrescriptionForm
      prescriptionId={generatedPrescriptionId}
      existingPrescription={null}   // No fetching for now
    />
  );
}
