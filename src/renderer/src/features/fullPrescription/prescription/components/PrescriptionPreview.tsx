import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/provider/ThemeProvider";
import { useAppSelector } from "@renderer/app/hooks";
import { Prescription } from "../prescriptionApi";

//FIXME - persist prescription data, save it in database, create medicines section, create: floating bar in the box containg buttons(dropdown) like previous prescription, preious page(^), next page(v), pages (1/20), in the next visit section, add a date picker for next visit
// check and calculate and serach sms cost
// check eka.care website for inspiration of prescription page
//TODO - hindi text
// default date 7 days from today is added in nextvisit but check for sunday and holiday
// remove draft of appointment id from localstorage when last submit happens

interface PrescriptionPreviewProps {
  prescriptionId: string;
  prescriptionData: Prescription;
  visibleSection?: "doctor" | "prescription" | "medicines";
}

export function PrescriptionPreview({
  prescriptionId,
  prescriptionData,
  visibleSection = "prescription",
}: PrescriptionPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(0.9);
  const [autoScale, setAutoScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [doctorSettings, setDoctorSettings] = useState<any>({});
  const selectedAppointment = useAppSelector(
    (state) => state.appointments.selectedAppointment,
  );

  // Load doctor settings
  useEffect(() => {
    const saved = localStorage.getItem("doctor_settings");
    if (saved) setDoctorSettings(JSON.parse(saved));
  }, []);

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

  // Mouse drag navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, startPos, offset]);

  const resetView = () => {
    setZoom(0.9);
    setOffset({ x: 0, y: 0 });
  };

  // Download full PDF
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

  // Auto-resize when sidebar toggles
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const A4_WIDTH_PX = 794; // 210mm ~ 794px
      const scale = containerWidth / A4_WIDTH_PX;
      setAutoScale(Math.min(scale, 1));
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const effectiveScale = zoom * autoScale;

  return (
    <div
      className={`flex flex-col items-center p-4 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-neutral-900" : "bg-gray-100"
      }`}
      style={{ flex: "1 1 50%" }}
    >
      {/* Controls */}
      <div className="flex justify-between w-full mb-3 items-center">
        <h2
          className={`font-semibold text-lg ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Live Prescription Preview
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleDownload}>
            Download PDF
          </Button>
          <Button variant="outline" onClick={resetView}>
            Reset View
          </Button>
        </div>
      </div>

      {/* Container */}
      <div
        ref={containerRef}
        className={`relative flex justify-center items-center flex-1 overflow-hidden rounded-lg cursor-${
          isDragging ? "grabbing" : "grab"
        } ${isDark ? "bg-neutral-800" : "bg-gray-200"}`}
        style={{ userSelect: "none" }}
      >
        {/* Scaled & draggable content */}
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${effectiveScale})`,
            transformOrigin: "top center",
            transition: isDragging
              ? "none"
              : "transform 0.25s ease, scale 0.25s ease",
            width: "210mm",
            height: "297mm",
            border: isDark ? "1px solid #444" : "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
          ref={pageRef}
        >
          {/* ✅ Visible content (your HTML) */}
          <div
            style={{
              position: "relative",
              padding: "20mm",
              width: "100%",
              height: "100%",
              backgroundImage: "url('/prescription_template.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              color: isDark ? "#f0f0f0" : "#000",
              textAlign: "left",
            }}
          >
            {/* Beautified Doctor Info */}
            <div
              style={{
                height: "15%",
                borderBottom: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingBottom: "4mm",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left Side */}
                <div>
                  <h1
                    style={{
                      fontSize: "16pt",
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {doctorSettings.doctorName || "Dr. John Doe"}
                  </h1>
                  <p>{doctorSettings.qualification || "BDS, MDS (Dentist)"}</p>
                  <p style={{ color: "grey" }}>
                    Reg. No: <strong>{doctorSettings.registrationNo}</strong>
                  </p>
                  <p>Timings: {doctorSettings.timings || "Mon–Sat 10AM–7PM"}</p>
                </div>

                {/* Center: Logo */}
                {doctorSettings.logo ? (
                  <img
                    src={doctorSettings.logo}
                    alt="Clinic Logo"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "#ddd",
                      borderRadius: "8px",
                      alignSelf: "center",
                    }}
                  ></div>
                )}

                {/* Right Side */}
                <div style={{ textAlign: "right" }}>
                  <h2
                    style={{
                      fontSize: "16pt",
                      fontWeight: "bold",
                      color: "Red",
                      wordBreak: "break-word",
                    }}
                  >
                    {doctorSettings.hospitalName || "Smile Dental Clinic"}
                  </h2>
                  <p style={{ color: "grey" }}>
                    License: {doctorSettings.licenseNo}
                  </p>
                  <p>
                    Phone: {doctorSettings.contactNumber || "+91 9876543210"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "4px",
                  fontSize: "12pt",
                  color: isDark ? "#aaa" : "#333",
                }}
              >
                {doctorSettings.address ||
                  "123 Main Street, Raipur, Chhattisgarh"}
              </div>
            </div>

            {/* Patient Info */}
            <div style={{ marginTop: "6mm", fontSize: "12pt" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{new Date().toLocaleDateString()}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  justifyContent: "space-between",
                  fontSize: "12pt",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "grey",
                    fontStyle: "italic",
                  }}
                >
                  <span>PID:</span> {selectedAppointment?.patientId}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "slategray",
                    fontStyle: "italic",
                  }}
                >
                  <span style={{ fontSize: "0.75rem" }}>AID:</span>{" "}
                  {selectedAppointment?.id}
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <strong>{selectedAppointment?.name},</strong>
                <span>{selectedAppointment?.gender}</span>,
                <span>{selectedAppointment?.age} years</span>,
                <span>{selectedAppointment?.phone}</span>
              </div>{" "}
              <br />
            </div>
            <hr />

            {/* Prescription Details */}
            <div style={{ marginTop: "8mm", fontSize: "12pt" }}>
              <div>
                <strong>Cheif Complain:</strong>
                <div
                  className="prescription-content mt-1 prose prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: prescriptionData.complain || "<p>—</p>",
                  }}
                />
              </div>

              <div className="mt-2">
                <strong>Symptoms:</strong>
                <div
                  className="prescription-content mt-1 prose prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: prescriptionData.symptoms || "<p>—</p>",
                  }}
                />
              </div>

              <div className="mt-2">
                <strong>Examination Findings:</strong>
                <div
                  className="prescription-content mt-1 prose prose-sm dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: prescriptionData.examinationFindings || "<p>—</p>",
                  }}
                />
              </div>

              <div className="mt-2">
                <strong>Advice:</strong>
                <p>{prescriptionData.advice || "—"}</p>
              </div>

              <div className="mt-2">
                <strong>Next Visit:</strong>
                <p>{prescriptionData.nextVisit || "—"}</p>
              </div>
            </div>
            {/* Prescription ID */}
            <p
              style={{
                position: "absolute",
                bottom: "5mm",
                left: "5mm",
                fontSize: "0.85rem",
                color: "grey",
                fontStyle: "italic",
              }}
            >
              {prescriptionId}
            </p>
          </div>
        </div>
      </div>

      <p
        className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        Hold <kbd>Ctrl</kbd> + scroll to zoom, drag to move,{" "}
        <strong>Reset</strong> to default.
      </p>
    </div>
  );
}
