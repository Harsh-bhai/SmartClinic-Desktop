import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { PatientInfo } from "./PatientInfo";
import { RichTextSection } from "./RichTextSection";
import { Vitals } from "./Vitals";
import { useAppDispatch, useAppSelector } from "@renderer/app/hooks";

import {
  TabsList,
  TabsTrigger,
  TabsContent,
  Tabs,
} from "@renderer/components/ui/tabs";
import { Textarea } from "@renderer/components/ui/textarea";
import { Input } from "@renderer/components/ui/input";

import { useEffect, useState } from "react";
import { Prescription } from "../prescriptionApi";
import { setDraftPrescription } from "../prescriptionSlice";
import { PrescriptionPreview } from "./PrescriptionPreview";

import { CalendarIcon } from "lucide-react";
import {
  DatePicker,
  Button,
  Group,
  Label,
  Popover,
  Dialog,
} from "react-aria-components";

import { DateInput } from "@/components/ui/datefield-rac";
import { Calendar } from "@/components/ui/calendar-rac";
import { today, parseDate } from "@internationalized/date";
import { getDefaultNextVisit } from "@renderer/lib/utils";

export function PrescriptionForm({
  prescriptionId,
}: {
  prescriptionId: string;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const dispatch = useAppDispatch();

  
  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment,
  );
  
  const draft = useAppSelector(
    (state) => state.prescription.drafts[selectedAppointment?.id || ""],
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
    },
  );


  const handleChange = (field: keyof Prescription, value: any) => {
    setPrescriptionData((prev) => {
      const updated = { ...prev, [field]: value };
      dispatch(
        setDraftPrescription({
          appointmentId: selectedAppointment?.id!,
          data: updated,
        }),
      );

      return updated;
    });
  };
  // Set default nextVisit only if not already set
  useEffect(() => {
    if (prescriptionData.nextVisit === "") {
      const def = getDefaultNextVisit();
      console.log(def.toString(), "def");
      handleChange("nextVisit", def.toString());
    }
  }, []);

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
            {/* PATIENT INFO */}
            <PatientInfo selectedAppointment={selectedAppointment} />

            <Accordion type="multiple" className="mt-4">
              {/* MEDICAL HISTORY */}
              <AccordionItem value="medicalHistory">
                <AccordionTrigger>Patient Medical History</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder="No Medical History"
                    label=""
                    value={prescriptionData.medicalHistory}
                    onChange={(val) => handleChange("medicalHistory", val)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* COMPLAIN */}
              <AccordionItem value="complain">
                <AccordionTrigger>Chief Complaint</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder="Write the Chief Complaint"
                    label=""
                    value={prescriptionData.complain}
                    onChange={(val) => handleChange("complain", val)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* EXAM FINDINGS */}
              <AccordionItem value="examFindings">
                <AccordionTrigger>Examination Findings</AccordionTrigger>
                <AccordionContent>
                  <RichTextSection
                    placeholder="Write Examination Findings"
                    label=""
                    value={prescriptionData.examinationFindings}
                    onChange={(val) => handleChange("examinationFindings", val)}
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
                    placeholder="Write Notes Here..."
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
                    placeholder="Write Advice Here..."
                    value={prescriptionData.advice}
                    onChange={(e) => handleChange("advice", e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* NEXT VISIT — with DATE PICKER */}
              <AccordionItem value="nextVisit">
                <AccordionTrigger>Next Visit</AccordionTrigger>
                <AccordionContent>
                  <DatePicker
                    value={
                      prescriptionData.nextVisit
                        ? parseDate(prescriptionData.nextVisit) // ✔ Show updated saved date
                        : getDefaultNextVisit() // ✔ Show 7-days-ahead initially
                    }
                    onChange={(dateValue) => {
                      if (!dateValue) {
                        handleChange("nextVisit", "");
                      } else {
                        const iso = dateValue.toString(); // CalendarDate → 'YYYY-MM-DD'
                        handleChange("nextVisit", iso); // ✔ Save updated date
                      }
                    }}
                    className="*:not-first:mt-2"
                  >
                    <div className="flex">
                      <Group className="w-full">
                        <DateInput className="pe-9" />
                      </Group>

                      <Button className="z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 hover:text-foreground">
                        <CalendarIcon size={16} />
                      </Button>
                    </div>

                    <Popover
                      className="z-50 rounded-lg border bg-background shadow-lg p-2"
                      offset={4}
                    >
                      <Dialog className="max-h-[inherit] overflow-auto p-2">
                        <Calendar />
                      </Dialog>
                    </Popover>
                  </DatePicker>
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
