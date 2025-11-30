import {
  Accordion,
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
import { useEffect, useState } from "react";
import { Prescription } from "../prescriptionApi";
import { setDraftPrescription } from "../prescriptionSlice";
import { PrescriptionPreview } from "./PrescriptionPreview";
import { CalendarIcon } from "lucide-react";
import {
  DatePicker,
  Button,
  Group,
  Popover,
  Dialog,
} from "react-aria-components";

import { DateInput } from "@/components/ui/datefield-rac";
import { Calendar } from "@/components/ui/calendar-rac";
import { parseDate } from "@internationalized/date";
import { getDefaultNextVisit } from "@renderer/lib/utils";
import { AccordionSection } from "@renderer/components/AccordionSection";

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

              <AccordionSection value="complain" title="Chief Complaint">
                <RichTextSection
                  placeholder="Write the Chief Complaint"
                  label=""
                  value={prescriptionData.complain}
                  onChange={(val: any) => handleChange("complain", val)}
                />
              </AccordionSection>

              <AccordionSection
                value="examFindings"
                title="Examination Findings"
              >
                <RichTextSection
                  placeholder="Write Examination Findings"
                  label=""
                  value={prescriptionData.examinationFindings}
                  onChange={(val: any) => handleChange("examinationFindings", val)}
                />
              </AccordionSection>

              <AccordionSection value="vitals" title="Vitals">
                <Vitals
                  vitals={prescriptionData.vitals}
                  onChange={(field, val) =>
                    handleChange("vitals", {
                      ...prescriptionData.vitals,
                      [field]: val,
                    })
                  }
                />
              </AccordionSection>

              <AccordionSection value="notes" title="Notes">
                <Textarea
                  placeholder="Write Notes Here..."
                  value={prescriptionData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </AccordionSection>

              <AccordionSection value="advice" title="Advice">
                <Textarea
                  placeholder="Write Advice Here..."
                  value={prescriptionData.advice}
                  onChange={(e) => handleChange("advice", e.target.value)}
                />
              </AccordionSection>

              {/* NEXT VISIT */}
              <AccordionSection value="nextVisit" title="Next Visit">
                <DatePicker
                  value={
                    prescriptionData.nextVisit
                      ? parseDate(prescriptionData.nextVisit)
                      : getDefaultNextVisit()
                  }
                  onChange={(dateValue) => {
                    if (!dateValue) {
                      handleChange("nextVisit", "");
                    } else {
                      handleChange("nextVisit", dateValue.toString());
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
              </AccordionSection>
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
