import { useState } from "react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { FormNavigation, ReviewStatus } from "../navigation/FormNavigation";
import { PDFPreview } from "../pdf/PDFPreview";
import { generatePdf } from "../pdf/pdfGenerator";
import { useAuth, useUser } from "@clerk/clerk-react";
import { apiClient } from "@/lib/api";
import { useNotesStore } from "../../../../store/notesStore";

export const ReviewForm = () => {
  const { formData } = useForm();
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const { getToken } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingForReview, setIsSendingForReview] = useState(false);
  const { notes } = useNotesStore();

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generatePdf(formData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
      // Generate a shorter claim number for better performance

      const claimNumber =
        formData.ourRef || `CL-${Date.now().toString().slice(-6)}`;

      const token = await getToken();
      if (token) {
        apiClient.setToken(token);
        const claimData = {
          claimNumber,
          insuredName: formData.insured,
          vehicleData: formData.vehicle || {},
          damageData: formData.damage || {},
          estimateData: formData.estimate || {},
          recommendationData: formData.recommendation || {},
          yourRef: formData.yourRef,
          ourRef: formData.ourRef,
          dateReceived: formData.dateReceived
            ? new Date(formData.dateReceived).toISOString()
            : null,
          dateInspected: formData.dateInspected
            ? new Date(formData.dateInspected).toISOString()
            : null,
          dateOfLoss: formData.dateOfLoss
            ? new Date(formData.dateOfLoss).toISOString()
            : null,
          letterDate: formData.letterDate
            ? new Date(formData.letterDate).toISOString()
            : null,
          placeOfInspection: formData.placeOfInspection,
          claimsTechnician: formData.claimsTechnician,
          witness: formData.witness,
          numberOfPhotographs: formData.numberOfPhotographs,
          status: "pending",
        };

        const response = await apiClient.createClaim(claimData);
        console.log("Saved claim:", response);
        alert("Report saved successfully!");
      }
    } catch (error) {
      console.error("Error saving report", error);

      if (error instanceof Error) {
        alert(`Error saving report ${error.message}: contact developer`);
      } else {
        alert("Error sending saving report: contact developer");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendForReview = async () => {
    setIsSendingForReview(true);
    try {
      // Generate a shorter claim number for better performance
      const claimNumber =
        formData.ourRef || `CL-${Date.now().toString().slice(-6)}`;

      const token = await getToken();
      if (token) {
        apiClient.setToken(token);
        const claimData = {
          claimNumber,
          insuredName: formData.insured,
          vehicleData: formData.vehicle || {},
          damageData: formData.damage || {},
          estimateData: formData.estimate || {},
          recommendationData: formData.recommendation || {},
          yourRef: formData.yourRef,
          ourRef: formData.ourRef,
          dateReceived: formData.dateReceived
            ? new Date(formData.dateReceived).toISOString()
            : null,
          dateInspected: formData.dateInspected
            ? new Date(formData.dateInspected).toISOString()
            : null,
          dateOfLoss: formData.dateOfLoss
            ? new Date(formData.dateOfLoss).toISOString()
            : null,
          letterDate: formData.letterDate
            ? new Date(formData.letterDate).toISOString()
            : null,
          placeOfInspection: formData.placeOfInspection,
          claimsTechnician: formData.claimsTechnician,
          witness: formData.witness,
          numberOfPhotographs: formData.numberOfPhotographs,
          status: "review",
        };

        const response = await apiClient.createClaim(claimData);
        console.log("Sent for review:", response);
        alert("Report sent for review successfully!");
      }
    } catch (error) {
      console.error("Error sending for review:", error);

      if (error instanceof Error) {
        alert(`Error sending for review: ${error.message}`);
      } else {
        alert("Error sending for review: Unknown error");
      }
    } finally {
      setIsSendingForReview(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Review Forms Information</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Company & Header Section */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Company Information
              </h3>
              <p>
                <span className="font-semibold">Recipient:</span>{" "}
                {formData.recipient?.name ||
                  "Maritime General Insurance Company Limited"}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formData.letterDate || new Date().toISOString().split("T")[0]}
              </p>
            </div>

            {/* Assignment Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Assignment Information
              </h3>
              <p>
                <span className="font-semibold">Insured:</span>{" "}
                {formData.insured || "John Smith"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Date Received:</span>{" "}
                  {formData.dateReceived || "2024-03-15"}
                </p>
                <p>
                  <span className="font-semibold">Your Ref:</span>{" "}
                  {formData.yourRef || "REF-2024-001"}
                </p>
                <p>
                  <span className="font-semibold">Date Inspected:</span>{" "}
                  {formData.dateInspected || "2024-03-16"}
                </p>
                <p>
                  <span className="font-semibold">Our Ref:</span>{" "}
                  {formData.ourRef || "ICAVS-2024-001"}
                </p>
                <p>
                  <span className="font-semibold">Date of Loss:</span>{" "}
                  {formData.dateOfLoss || "2024-03-14"}
                </p>
                <p>
                  <span className="font-semibold">Invoice:</span>{" "}
                  {formData.invoice || "INV-2024-001"}
                </p>
              </div>
              <p>
                <span className="font-semibold">Claims Technician:</span>{" "}
                {formData.claimsTechnician || "David Williams"}
              </p>
            </div>

            {/* Vehicle Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Vehicle Information
              </h3>
              <p>
                <span className="font-semibold">Make & Model:</span>{" "}
                {formData.vehicle?.makeAndModel || "Toyota Camry SE"}
              </p>
              <p>
                <span className="font-semibold">Registration:</span>{" "}
                {formData.vehicle?.registration || "PCS 1234"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Year of Manufacture:</span>{" "}
                  {formData.vehicle?.yearOfManufacture || "2022"}
                </p>
                <p>
                  <span className="font-semibold">Color:</span>{" "}
                  {formData.vehicle?.color || "Pearl White"}
                </p>
                <p>
                  <span className="font-semibold">Odometer:</span>{" "}
                  {formData.vehicle?.odometer || "15000"}
                </p>
                <p>
                  <span className="font-semibold">VIN/Chassis:</span>{" "}
                  {formData.vehicle?.identification?.vinChassis ||
                    "JT2BF22K1W0123456"}
                </p>
                <p>
                  <span className="font-semibold">Engine:</span>{" "}
                  {formData.vehicle?.identification?.engine || "2AZ-FE123456"}
                </p>
              </div>
            </div>

            {/* Damage Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Damage Information
              </h3>
              <p>
                <span className="font-semibold">Affected Area:</span>{" "}
                {formData.damage?.affectedArea || "Left broadside"}
              </p>
              <p>
                <span className="font-semibold">Deformation Severity:</span>{" "}
                {formData.damage?.deformationSeverity || "Major"}
              </p>
              <p>
                <span className="font-semibold">Affected Components:</span>{" "}
                {formData.damage?.affectedStructuralComponents ||
                  'Left "B" pillar and left rear wheel arch'}
              </p>
            </div>

            {/* Estimate Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Estimate Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Parts Quoted:</span> $
                  {formData.estimate?.parts.quotedFigure || "5800.00"}
                </p>
                <p>
                  <span className="font-semibold">Parts Adjusted:</span> $
                  {formData.estimate?.parts.adjustedFigure || "5200.00"}
                </p>
                <p>
                  <span className="font-semibold">Labour Quoted:</span> $
                  {formData.estimate?.labour.quotedFigure || "2200.00"}
                </p>
                <p>
                  <span className="font-semibold">Labour Adjusted:</span> $
                  {formData.estimate?.labour.adjustedFigure || "2000.00"}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">Recommendation</h3>
              <p>
                <span className="font-semibold">Settlement Basis:</span>{" "}
                {formData.recommendation?.settlementBasis ||
                  "Repair or Cash In Lieu of Repair Basis"}
              </p>
              <p>
                <span className="font-semibold">Cost of Repairs:</span> $
                {formData.recommendation?.apparentCostOfRepairs || "7200.00"}
              </p>
              <p>
                <span className="font-semibold">Pre-Accident Value:</span> $
                {formData.recommendation?.preAccidentValue || "45000.00"}
              </p>
              <p>
                <span className="font-semibold">Settlement Offer:</span> $
                {formData.recommendation?.settlementOffer || "7200.00"}
              </p>
              <p>
                <span className="font-semibold">Reserve:</span> $
                {formData.recommendation?.reserve || "8000.00"}
              </p>
            </div>

            {/* Notes Section */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">Notes</h3>
              {Object.entries(notes)
                .filter(([_, content]) => content && content.trim() !== "")
                .map(([section, content]) => (
                  <div key={section} className="mb-4">
                    <h4 className="text-sm font-semibold capitalize">
                      {section} Notes:
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line p-2 bg-gray-50 rounded border">
                      {content}
                    </p>
                  </div>
                ))}
              {Object.keys(notes).length === 0 && (
                <p className="text-sm text-gray-500 italic">No notes added</p>
              )}
            </div>

            <FormNavigation
              customButtons={
                <>
                  <button
                    onClick={handleSaveReport}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Saving Draft...</span>
                      </>
                    ) : (
                      <>
                        <span>Save as Draft</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSendForReview}
                    disabled={isSendingForReview}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-150 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSendingForReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send for Review</span>
                      </>
                    )}
                  </button>
                </>
              }
              onGeneratePdf={handleGeneratePdf}
              isSubmitting={isGenerating}
              canSubmit={true}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">PDF Preview</h2>
        </CardHeader>
        <CardContent>
          <PDFPreview />
        </CardContent>
      </Card>
    </div>
  );
};
