// prescriptionForm.tsx
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";
import { Prescription } from "../prescriptionApi";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Vitals } from "./Vitals";
import { setDraftPrescription } from "../prescriptionSlice";

interface PrescriptionFormProps {
  prescriptionId: string;
  existingPrescription: Prescription | null;
}

export function PrescriptionForm({ prescriptionId }: PrescriptionFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const draft = useAppSelector((state) => state.prescription.draft);


  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment
  );

 const [prescriptionData, setPrescriptionData] = useState<Prescription>(
  draft || {
    patientId: selectedAppointment?.patientId,
    appointmentId: selectedAppointment?.id,
    complain: "",
    medicalHistory: "",
    notes: "",
    vitals: {},
    examinationFindings: "",
    advice: "",
    nextVisit: "",
  }
);


const dispatch = useAppDispatch();

const handleChange = (field: keyof Prescription, value: any) => {
  setPrescriptionData((prev) => {
    const updated = { ...prev, [field]: value };
    dispatch(setDraftPrescription(updated));   // <-- PERSIST LIVE
    return updated;
  });
};

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-300 dark:border-gray-700">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Prescription</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            {/* Patient Info */}
            <table className="w-full mt-4 text-left border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Name</td>
                  <td className="p-2">{selectedAppointment?.name}</td>
                </tr>

                <tr className="border-b">
                  <td className="p-2 font-semibold">Age</td>
                  <td className="p-2">{selectedAppointment?.age}</td>
                  <td className="p-2 font-semibold">Gender</td>
                  <td className="p-2">{selectedAppointment?.gender}</td>
                </tr>

                <tr>
                  <td className="p-2 font-semibold">PID</td>
                  <td className="p-2">{selectedAppointment?.patientId}</td>
                  <td className="p-2 font-semibold">AID</td>
                  <td className="p-2">{selectedAppointment?.id}</td>
                </tr>
              </tbody>
            </table>


            {/* ORDER CHANGED HERE */}
            {/* 1) MEDICAL HISTORY */}
            <label className="block mt-6 text-left">Patient Medical History</label>
            <RichTextEditor
              value={selectedAppointment?.medicalHistory || ""}
              onChange={(val) => handleChange("medicalHistory" as any, val)}
            />

            {/* 2) COMPLAIN */}
            <label className="block mt-6 text-left">Chief Complaint</label>
            <RichTextEditor
              value={prescriptionData.complain ?? ""}
              onChange={(val) => handleChange("complain", val)}
            />

            {/* 3) EXAMINATION FINDINGS */}
            <label className="block mt-6 text-left">Examination Findings</label>
            <RichTextEditor
              value={prescriptionData.examinationFindings}
              onChange={(val) => handleChange("examinationFindings", val)}
            />

            {/* VITALS SECTION */}
            <Vitals
              vitals={prescriptionData.vitals || {}}
              onChange={(field, val) =>
                handleChange("vitals", {
                  ...prescriptionData.vitals,
                  [field]: val,
                })
              }
            />

            {/* Notes */}
            <label className="block mt-4 text-left">Notes</label>
            <Textarea
              value={prescriptionData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />

            {/* Advice */}
            <label className="block mt-4 text-left">Advice</label>
            <Textarea
              value={prescriptionData.advice}
              onChange={(e) => handleChange("advice", e.target.value)}
            />

            {/* Next Visit */}
            <label className="block mt-4 text-left">Next Visit</label>
            <Input
              value={prescriptionData.nextVisit}
              onChange={(e) => handleChange("nextVisit", e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT PANEL */}
      <PrescriptionPreview
        prescriptionId={prescriptionId}
        prescriptionData={prescriptionData}
        visibleSection={activeTab === "details" ? "prescription" : "medicines"}
      />
    </div>
  );
}
