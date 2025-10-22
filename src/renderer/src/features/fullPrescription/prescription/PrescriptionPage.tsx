import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PrescriptionForm } from "./components/PrescriptionForm";
import { createPrescriptionApi, getPrescriptionByIdApi } from "./prescriptionApi";
import { useAppDispatch } from "@/app/hooks";

export default function PrescriptionPage() {
  const { visitId } = useParams(); // ✅ case 1: reading an existing prescription
  const [resolvedVisitId, setResolvedVisitId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initVisit = async () => {
      try {
        if (visitId) {
          // existing visit, verify it
          const existingVisit = await getPrescriptionByIdApi(visitId);
          if (existingVisit) setResolvedVisitId(visitId);
          else navigate("/error"); // or show toast
        } else {
          // new visit → create one in DB
          const newVisit = await createPrescriptionApi({
            // visitId: "TEMP_PATIENT_ID", // ⚠️ replace with actual patient selection
            reason: "New Checkup",
            examinationFindings: "",
            advice: "",
          });
          setResolvedVisitId(newVisit.id);
        }
      } catch (error) {
        console.error("Error initializing visit:", error);
      }
    };

    initVisit();
  }, [visitId]);

  if (!resolvedVisitId)
    return <div className="p-6 text-center">Loading visit...</div>;

  return <PrescriptionForm visitId={resolvedVisitId} />;
}
