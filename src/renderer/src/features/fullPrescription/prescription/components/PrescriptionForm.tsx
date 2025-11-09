import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { useAppSelector } from "@renderer/app/hooks";

interface PrescriptionFormProps {
  prescriptionId: string;
  existingPrescription: any;
}

export function PrescriptionForm({
  prescriptionId,
  existingPrescription,
}: PrescriptionFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [prescriptionData, setPrescriptionData] = useState({
    reason: "",
    examinationFindings: "",
  });
  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment,
  );

  useEffect(() => {
    if (existingPrescription) {
      setPrescriptionData((prev) => ({
        ...prev,
        reason: existingPrescription.reason || "",
        examinationFindings: existingPrescription.examinationFindings || "",
      }));
    }
  }, [existingPrescription]);

  const handleChange = (field: string, value: string) => {
    setPrescriptionData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-300 dark:border-gray-700">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Prescription</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-left">Patient Name</label>
                <Input
                  value={selectedAppointment?.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left">Age</label>
                <Input
                  value={selectedAppointment?.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left">Gender</label>
                <Input
                  value={selectedAppointment?.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left">Patient ID</label>
                <Input
                  value={selectedAppointment?.patientId}
                  onChange={(e) => handleChange("patientId", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left">Appointment ID</label>
                <Input
                  value={selectedAppointment?.id}
                  onChange={(e) =>
                    handleChange("appointmentId", e.target.value)
                  }
                />
              </div>
            </div>

            <label className="block mt-6 text-left">Reason</label>
            <Textarea
              placeholder="Enter reason for visit"
              value={prescriptionData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
            />

            <label className="block mt-4 text-left">Examination Findings</label>
            <Textarea
              placeholder="Enter findings"
              value={prescriptionData.examinationFindings}
              onChange={(e) =>
                handleChange("examinationFindings", e.target.value)
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side */}
      <PrescriptionPreview
        prescriptionId={prescriptionId}
        prescriptionData={prescriptionData}
        visibleSection={activeTab === "details" ? "prescription" : "medicines"}
      />
    </div>
  );
}
