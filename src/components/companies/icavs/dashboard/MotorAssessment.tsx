import { useState } from "react";
import { FormProvider } from "../../../../context/companies/icavs/FormContext";
import { FormStepper } from "../navigation/FormStepper";
import {
  DocumentsForm,
  HeaderForm,
  InsuredForm,
  VehicleForm,
  FeaturesForm,
  ConditionForm,
  TyresForm,
  DamageForm,
  EstimateForm,
  RecommendationForm,
  ReviewForm,
} from "../forms";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { apiClient } from "@/lib/api";

const FormContent = () => {
  const { currentStep } = useForm();

  switch (currentStep) {
    case "documents":
      return <DocumentsForm />;
    case "header":
      return <HeaderForm />;
    case "insured":
      return <InsuredForm />;
    case "vehicle":
      return <VehicleForm />;
    case "features":
      return <FeaturesForm />;
    case "condition":
      return <ConditionForm />;
    case "tyres":
      return <TyresForm />;
    case "damage":
      return <DamageForm />;
    case "estimate":
      return <EstimateForm />;
    case "recommendation":
      return <RecommendationForm />;
    case "review":
      return <ReviewForm />;
    default:
      return <HeaderForm />;
  }
};

// This component now uses the form context and must be inside FormProvider
const MotorAssessmentContent = () => {
  const [reportStatus, setReportStatus] = useState<
    "pending" | "review" | "cancelled" | "completed"
  >("pending");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // ✅ Now this useForm() is inside FormProvider
  const { formData } = useForm();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as
      | "pending"
      | "review"
      | "cancelled"
      | "completed";
    if (newStatus === "cancelled") {
      setShowCancelDialog(true);
    } else {
      updateReportStatus(newStatus);
    }
  };

  const updateReportStatus = async (
    status: "pending" | "review" | "cancelled" | "completed",
    reason?: string
  ) => {
    if (!formData.id) return;

    setIsUpdatingStatus(true);
    try {
      await apiClient.updateClaimStatus(formData.id.toString(), status, reason);
      setReportStatus(status);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelConfirm = () => {
    if (cancelReason.trim()) {
      updateReportStatus("cancelled", cancelReason);
      setShowCancelDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 lg:bg-transparent">
      <main className="container mx-auto px-2 lg:px-4 pb-8 lg:pb-16">
        <div className="max-w-4xl mx-auto mt-4 lg:mt-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Motor Assessment Form
              </h1>
              <p className="text-sm lg:text-base text-gray-600">
                Complete the digital claims form for motor vehicle assessment
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="reportStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Status:
                </label>
                <select
                  id="reportStatus"
                  value={reportStatus}
                  onChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                    reportStatus === "pending"
                      ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                      : reportStatus === "review"
                        ? "bg-blue-50 text-blue-800 border-blue-300"
                        : reportStatus === "cancelled"
                          ? "bg-red-50 text-red-800 border-red-300"
                          : "bg-green-50 text-green-800 border-green-300"
                  }`}
                >
                  {isUpdatingStatus && <span className="mr-2">⏳</span>}
                  <option value="pending">Pending</option>
                  <option value="review">Under Review</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          <FormStepper />
          <div className="mt-6 transition-all">
            <FormContent />
          </div>
        </div>

        {/* Cancel Reason Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cancellation Reason
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for cancelling this report.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4"
                rows={4}
                placeholder="Enter cancellation reason..."
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main component that wraps everything with FormProvider
export const MotorAssessment = () => {
  return (
    <FormProvider>
      <MotorAssessmentContent />
    </FormProvider>
  );
};
