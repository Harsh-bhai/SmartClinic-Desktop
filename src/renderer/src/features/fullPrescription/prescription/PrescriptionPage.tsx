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
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedPrescription, loading } = useAppSelector(
    (state) => state.prescription
  );

  useEffect(() => {
    const initPrescription = async () => {
      if (prescriptionId) {
        dispatch(fetchPrescriptionById(prescriptionId));
      } else {
        const result = await dispatch(
          createPrescription({
            reason: "Routine Checkup",
            examinationFindings: "",
            advice: "",
          })
        );
        if (createPrescription.fulfilled.match(result)) {
          navigate(`/prescription/${result.payload.id}`);
        }
      }
    };

    initPrescription();

    return () => {
      dispatch(setSelectedPrescription(null));
    };
  }, [prescriptionId, dispatch, navigate]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading prescription...
      </div>
    );

  return (
    <PrescriptionForm
      prescriptionId={selectedPrescription?.id!}
      existingPrescription={selectedPrescription}
    />
  );
}
