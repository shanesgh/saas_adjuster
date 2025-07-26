import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addRemarks = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.text("REMARKS:", margin, currentY);
  currentY += 20;
  pdf.setFont("helvetica", "normal");
  const remarksText =
    data.recommendation?.remarks ||
    "If you are liable, we suggest that you treat this claim on a repair or cash in lieu of repair basis.";
  const splitRemarks = pdf.splitTextToSize(remarksText, pageWidth);
  pdf.text(splitRemarks, margin, currentY);

  return (currentY += splitRemarks.length * 15 + 30);
};
