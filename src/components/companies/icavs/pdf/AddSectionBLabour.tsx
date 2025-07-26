import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addSectionBLabour = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("SECTION (B): LABOUR", margin, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Remarks:", margin, currentY);
  currentY += 16;

  pdf.setFont("helvetica", "normal");
  const labourText1 =
    "The labour and material figure was overstated in the amount of $14,730.00 which was";
  pdf.text(labourText1, margin + 10, currentY);
  currentY += 14;
  const labourText2 =
    "adjusted downward to $7,690.00 which would be more realistic when compared to the";
  pdf.text(labourText2, margin + 10, currentY);
  currentY += 14;
  const labourText3 =
    "actual man hours involved to complete the repair exercise.";
  pdf.text(labourText3, margin + 10, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("Figure Quoted:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$14,730.00", margin + 90, currentY);
  pdf.setFont("helvetica", "bold");
  pdf.text("Adjusted Labour & Material Figure:", margin + 220, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$7,690.00", margin + 425, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text(
    "Repairs ought to be completed in (4) working days.",
    margin,
    currentY
  );
  pdf.setFont("helvetica", "normal");
  return currentY;
};
