import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addSignature = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "normal");
  pdf.text("Regards,", margin, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("MR. GERARD JOSEPH - Adjuster/Managing Director", margin, currentY);
  currentY += 14;
  pdf.setFont("helvetica", "normal");

  pdf.text(
    "Diploma - Motor Insurance Claims, Investigation & Adjusting (MICIA)",
    margin,
    currentY
  );
  currentY += 14;
  pdf.text(
    "FOR: Independent Claims Adjusting & Valuation Services Limited",
    margin,
    currentY
  );
  pdf.text("GJ/kwj", margin, (currentY += 14));
  pdf.text("Encs.", margin, (currentY += 20));
  return currentY;
};
