import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createPrescription,
  fetchPrescriptionById,
  setSelectedPrescription,
} from "./prescriptionSlice";
import { PrescriptionForm } from "./components/PrescriptionForm";
import { Loader2 } from "lucide-react";

export default function PrescriptionPage() {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedPrescription, loading } = useAppSelector(
    (state) => state.prescription,
  );

  useEffect(() => {
    const initPrescription = async () => {
      if (visitId) {
        // ✅ Fetch existing prescription by ID
        dispatch(fetchPrescriptionById(visitId));
      } else {
        // 🆕 Create a new prescription for a new patient visit
        const result = await dispatch(
          createPrescription({
            reason: "Routine Checkup",
            examinationFindings: "",
            advice: "",
          }),
        );

        if (createPrescription.fulfilled.match(result)) {
          navigate(`/prescription/${result.payload.id}`);
        }
      }
    };

    initPrescription();

    // Cleanup on unmount
    return () => {
      dispatch(setSelectedPrescription(null));
    };
  }, [visitId, dispatch, navigate]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading prescription...
      </div>
    );

  if (!selectedPrescription)
    return <div className="p-6 text-center">No prescription found</div>;

  return (
    <PrescriptionForm
      visitId={selectedPrescription.id!}
      existingPrescription={selectedPrescription}
    />
  );
}
