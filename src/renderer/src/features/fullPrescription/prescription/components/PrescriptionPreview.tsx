import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/provider/ThemeProvider";
import { useAppSelector } from "@renderer/app/hooks";

interface PrescriptionPreviewProps {
  prescriptionId: string;
  prescriptionData: {
    reason: string;
    examinationFindings: string;
  };
}

export function PrescriptionPreview({
  prescriptionId,
  prescriptionData,
}: PrescriptionPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const selectedAppointment = useAppSelector((state) => state.appointments.selectedAppointment);

  // Ctrl + scroll zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((z) =>
          Math.min(Math.max(z + (e.deltaY > 0 ? -0.1 : 0.1), 0.5), 2),
        );
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const handleDownload = () => {
    if (!pageRef.current) return;

    const opt = {
      margin: 0,
      filename: `Prescription_${prescriptionId}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(pageRef.current).save();
  };

  return (
    <div
      className={`w-1/2 flex flex-col items-center p-4 overflow-hidden transition-colors ${
        isDark ? "bg-neutral-900" : "bg-gray-100"
      }`}
    >
      <div className="flex justify-between w-full mb-3 items-center">
        <h2
          className={`font-semibold text-lg ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Live Prescription Preview
        </h2>
        <Button variant="secondary" onClick={handleDownload}>
          Download PDF
        </Button>
      </div>

      <div
        className={`flex justify-center items-center flex-1 w-full overflow-auto rounded-lg ${
          isDark ? "bg-neutral-800" : "bg-gray-200"
        }`}
      >
        <div
          ref={pageRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
            width: "210mm",
            height: "297mm",
            padding: "20mm",
            border: isDark ? "1px solid #444" : "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            backgroundImage: "url('/prescription_template.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            color: isDark ? "#f0f0f0" : "#000",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10mm" }}>
            <h1 style={{ fontSize: "18pt", fontWeight: "bold" }}>
              Dr. Smile Dental Clinic
            </h1>
            <p>123 Main Street, Raipur</p>
            <p>Phone: +91 9876543210</p>
            <p>Prescription ID: {prescriptionId}</p>
          </div>

          <div style={{ marginBottom: "10mm", fontSize: "12pt" }}>
            <strong>Patient ID:</strong> {selectedAppointment?.patientId || "—"}{" "}
            <br />
            <strong>Name:</strong> {selectedAppointment?.name || "—"} <br />
            <strong>Age:</strong> {selectedAppointment?.age || "—"} &nbsp;
            <strong>Gender:</strong> {selectedAppointment?.gender || "—"} <br />
            <strong>Appointment ID:</strong>{" "}
            {selectedAppointment?.id || "—"}
          </div>

          <div style={{ fontSize: "12pt" }}>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold" }}>
              Prescription Details
            </h2>
            <p>
              <strong>Reason:</strong> {prescriptionData.reason || "—"}
            </p>
            <p>
              <strong>Examination Findings:</strong>{" "}
              {prescriptionData.examinationFindings || "—"}
            </p>
          </div>
        </div>
      </div>

      <p
        className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        Hold <kbd>Ctrl</kbd> + scroll to zoom
      </p>
    </div>
  );
}
