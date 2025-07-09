import { useState } from "react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { FormNavigation } from "../navigation/FormNavigation";
import { PDFPreview } from "../pdf/PDFPreview";
import { generatePdf } from "../pdf/pdfGenerator";

export const ReviewForm = () => {
  const { formData } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Review Form Information</h2>
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
                {formData.recipient?.name}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formData.letterDate}
              </p>
            </div>

            {/* Assignment Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Assignment Information
              </h3>
              <p>
                <span className="font-semibold">Insured:</span>{" "}
                {formData.insured}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Date Received:</span>{" "}
                  {formData.dateReceived}
                </p>
                <p>
                  <span className="font-semibold">Your Ref:</span>{" "}
                  {formData.yourRef}
                </p>
                <p>
                  <span className="font-semibold">Date Inspected:</span>{" "}
                  {formData.dateInspected}
                </p>
                <p>
                  <span className="font-semibold">Our Ref:</span>{" "}
                  {formData.ourRef}
                </p>
                <p>
                  <span className="font-semibold">Date of Loss:</span>{" "}
                  {formData.dateOfLoss}
                </p>
                <p>
                  <span className="font-semibold">Invoice:</span>{" "}
                  {formData.invoice}
                </p>
              </div>
              <p>
                <span className="font-semibold">Claims Technician:</span>{" "}
                {formData.claimsTechnician}
              </p>
            </div>

            {/* Vehicle Information */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">
                Vehicle Information
              </h3>
              <p>
                <span className="font-semibold">Make & Model:</span>{" "}
                {formData.vehicle?.makeAndModel}
              </p>
              <p>
                <span className="font-semibold">Registration:</span>{" "}
                {formData.vehicle?.registration}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>
                  <span className="font-semibold">Year of Manufacture:</span>{" "}
                  {formData.vehicle?.yearOfManufacture}
                </p>
                <p>
                  <span className="font-semibold">Color:</span>{" "}
                  {formData.vehicle?.color}
                </p>
                <p>
                  <span className="font-semibold">Odometer:</span>{" "}
                  {formData.vehicle?.odometer}
                </p>
                <p>
                  <span className="font-semibold">VIN/Chassis:</span>{" "}
                  {formData.vehicle?.identification?.vinChassis}
                </p>
                <p>
                  <span className="font-semibold">Engine:</span>{" "}
                  {formData.vehicle?.identification?.engine}
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
                {formData.damage?.affectedArea}
              </p>
              <p>
                <span className="font-semibold">Deformation Severity:</span>{" "}
                {formData.damage?.deformationSeverity}
              </p>
              <p>
                <span className="font-semibold">Affected Components:</span>{" "}
                {formData.damage?.affectedStructuralComponents}
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
                  {formData.estimate?.parts.quotedFigure}
                </p>
                <p>
                  <span className="font-semibold">Parts Adjusted:</span> $
                  {formData.estimate?.parts.adjustedFigure}
                </p>
                <p>
                  <span className="font-semibold">Labour Quoted:</span> $
                  {formData.estimate?.labour.quotedFigure}
                </p>
                <p>
                  <span className="font-semibold">Labour Adjusted:</span> $
                  {formData.estimate?.labour.adjustedFigure}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 rounded-md border border-secondary-200 space-y-2">
              <h3 className="font-medium text-primary-600">Recommendation</h3>
              <p>
                <span className="font-semibold">Settlement Basis:</span>{" "}
                {formData.recommendation?.settlementBasis}
              </p>
              <p>
                <span className="font-semibold">Cost of Repairs:</span> $
                {formData.recommendation?.apparentCostOfRepairs}
              </p>
              <p>
                <span className="font-semibold">Pre-Accident Value:</span> $
                {formData.recommendation?.preAccidentValue}
              </p>
              <p>
                <span className="font-semibold">Settlement Offer:</span> $
                {formData.recommendation?.settlementOffer}
              </p>
              <p>
                <span className="font-semibold">Reserve:</span> $
                {formData.recommendation?.reserve}
              </p>
            </div>

            <FormNavigation
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
