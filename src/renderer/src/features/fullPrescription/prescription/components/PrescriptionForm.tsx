import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { useAppSelector } from "@renderer/app/hooks";
import { Prescription } from "../prescriptionApi";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface PrescriptionFormProps {
  prescriptionId: string;
  existingPrescription: Prescription | null;
}

export function PrescriptionForm({
  prescriptionId,
  existingPrescription,
}: PrescriptionFormProps) {
  const [activeTab, setActiveTab] = useState("details");

  const [prescriptionData, setPrescriptionData] = useState<Prescription>({
    complain: "",
    symptoms: "",
    notes: "",
    vitals: {},
    examinationFindings: "",
    advice: "",
    nextVisit: "",
  });

  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment,
  );

  useEffect(() => {
    if (existingPrescription) {
      setPrescriptionData({
        ...existingPrescription,
        vitals: existingPrescription.vitals || {},
        examinationFindings: existingPrescription.examinationFindings,
      });
    }
  }, [existingPrescription]);

  const handleChange = (field: keyof Prescription, value: any) => {
    setPrescriptionData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
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
                {/* Row 1 — Name */}
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-2 font-semibold">Name</td>
                  <td className="p-2">{selectedAppointment?.name || "—"}</td>
                </tr>

                {/* Row 2 — Age + Gender */}
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-2 font-semibold">Age</td>
                  <td className="p-2">{selectedAppointment?.age || "—"}</td>

                  <td className="p-2 font-semibold">Gender</td>
                  <td className="p-2">{selectedAppointment?.gender || "—"}</td>
                </tr>

                {/* Row 3 — Patient ID + Appointment ID */}
                <tr>
                  <td className="p-2 font-semibold">PID</td>
                  <td className="p-2">
                    {selectedAppointment?.patientId || "—"}
                  </td>

                  <td className="p-2 font-semibold">AID</td>
                  <td className="p-2">{selectedAppointment?.id || "—"}</td>
                </tr>
              </tbody>
            </table>

            {/* Reason */}
            <label className="block mt-6 text-left">Reason</label>
            <RichTextEditor
              value={prescriptionData.complain || ""}
              onChange={(val) => handleChange("complain", val)}
            />

            {/* Examination Findings */}
            <h3 className="font-semibold text-md mt-6 mb-2 text-left">
              Examination Findings
            </h3>
            <RichTextEditor
              value={prescriptionData.examinationFindings || ""}
              onChange={(val) => handleChange("examinationFindings", val)}
            />

            {/* Notes */}
            <label className="block mt-4 text-left">Notes</label>
            <Textarea
              placeholder="Doctor’s observations or remarks"
              value={prescriptionData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />

            {/* Examination Findings */}
            <h3 className="font-semibold text-md mt-6 mb-2 text-left">
              Examination Findings
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["general", "cvs", "rs", "pa", "cns"].map((field) => (
                <div key={field}>
                  <label className="block uppercase text-left">{field}</label>
                  <Input
                    value={
                      (prescriptionData.examinationFindings as any)[field] || ""
                    }
                    onChange={(e) =>
                      handleChange("examinationFindings", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Advice */}
            <label className="block mt-4 text-left">Advice</label>
            <Textarea
              placeholder="Enter advice or follow-up instructions"
              value={prescriptionData.advice}
              onChange={(e) => handleChange("advice", e.target.value)}
            />

            {/* Next Visit */}
            <label className="block mt-4 text-left">Next Visit</label>
            <Input
              placeholder="e.g., After 2 weeks or date"
              value={prescriptionData.nextVisit}
              onChange={(e) => handleChange("nextVisit", e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel (Preview) */}
      <PrescriptionPreview
        prescriptionId={prescriptionId}
        prescriptionData={prescriptionData}
        visibleSection={activeTab === "details" ? "prescription" : "medicines"}
      />
    </div>
  );
}
