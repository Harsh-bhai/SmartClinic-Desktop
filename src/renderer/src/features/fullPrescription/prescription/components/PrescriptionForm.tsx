import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

import { PatientInfo } from "./PatientInfo";
import { RichTextSection } from "./RichTextSection";
import { Vitals } from "./Vitals";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";
import { Input } from "@renderer/components/ui/input";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@renderer/components/ui/tabs";
import { Textarea } from "@renderer/components/ui/textarea";

import { useState } from "react";
import { Prescription } from "../prescriptionApi";
import { setDraftPrescription } from "../prescriptionSlice";
import { PrescriptionPreview } from "./PrescriptionPreview";

export function PrescriptionForm({ prescriptionId }: { prescriptionId: string }) {
  const [activeTab, setActiveTab] = useState("details");
  const dispatch = useAppDispatch();

  const draft = useAppSelector((state) => state.prescription.draft);
  const selectedAppointment = useAppSelector((state) => state.appointments.selectedAppointment);

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

  const handleChange = (field: keyof Prescription, value: any) => {
    setPrescriptionData((prev) => {
      const updated = { ...prev, [field]: value };
      dispatch(setDraftPrescription(updated));
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

            {/* PATIENT INFO ALWAYS VISIBLE */}
            <PatientInfo selectedAppointment={selectedAppointment} />

            {/* MAIN ACCORDION */}
            <Accordion type="multiple" className="mt-4">

              {/* MEDICAL HISTORY */}
              <AccordionItem value="medicalHistory">
                <AccordionTrigger>Patient Medical History</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder={"No Medical History"}
                    label=""
                    value={prescriptionData.medicalHistory}
                    onChange={(val: any) => handleChange("medicalHistory", val)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* COMPLAIN */}
              <AccordionItem value="complain">
                <AccordionTrigger>Chief Complaint</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder={"Write the Cheif Complain"}
                    label=""
                    value={prescriptionData.complain}
                    onChange={(val: any) => handleChange("complain", val)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* EXAMINATION FINDINGS */}
              <AccordionItem value="examFindings">
                <AccordionTrigger>Examination Findings</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder={"Write Examination Findings"}
                    label=""
                    value={prescriptionData.examinationFindings}
                    onChange={(val: any) => handleChange("examinationFindings", val)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* VITALS */}
              <AccordionItem value="vitals">
                <AccordionTrigger>Vitals</AccordionTrigger>
                <AccordionContent>
                  <Vitals
                    vitals={prescriptionData.vitals}
                    onChange={(field, val) =>
                      handleChange("vitals", {
                        ...prescriptionData.vitals,
                        [field]: val,
                      })
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              {/* NOTES */}
              <AccordionItem value="notes">
                <AccordionTrigger>Notes</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    placeholder="Write Notes Here ..."
                    value={prescriptionData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* ADVICE */}
              <AccordionItem value="advice">
                <AccordionTrigger>Advice</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    placeholder="Write Advice Here ..."
                    value={prescriptionData.advice}
                    onChange={(e) => handleChange("advice", e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* NEXT VISIT */}
              <AccordionItem value="nextVisit">
                <AccordionTrigger>Next Visit</AccordionTrigger>
                <AccordionContent>
                  <Input
                    value={prescriptionData.nextVisit}
                    onChange={(e) => handleChange("nextVisit", e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
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
