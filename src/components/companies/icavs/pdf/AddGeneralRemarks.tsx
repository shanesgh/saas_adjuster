import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addGeneralRemarks = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0); // Ensure black color
  pdf.text("GENERAL REMARKS ON VEHICLE CONDITION", pageWidth / 2, currentY, {
    align: "center",
  });

  const generalRemarksWidth = pdf.getTextWidth(
    "GENERAL REMARKS ON VEHICLE CONDITION"
  );
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - generalRemarksWidth / 2,
    currentY + 2,
    pageWidth / 2 + generalRemarksWidth / 2,
    currentY + 2
  );

  currentY += 25;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");

  const vehicleYear = data.vehicle?.yearOfManufacture || "2016";
  const generalRemarksText = `According to the decoded VIN, the vehicle was manufactured in the year ${vehicleYear} prior to being imported into the country used. It has completed its first year of registration locally and was in good condition prior to the loss.`;

  // Fix: Use available width (pageWidth minus both margins)
  const availableWidth = pageWidth - 2 * margin;
  const splitGeneralRemarks = pdf.splitTextToSize(
    generalRemarksText,
    availableWidth
  );

  pdf.text(splitGeneralRemarks, margin, currentY);
  currentY += splitGeneralRemarks.length * 12 + 15;
  return currentY;
};
