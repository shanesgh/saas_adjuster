import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";
import { addOrdinalSuffix } from "../../../../lib/utils";

export const addRecipientInfo = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  const contentWidth = pageWidth - margin * 2;

  pdf.setFontSize(12);
  pdf.text(
    addOrdinalSuffix(data.letterDate || new Date()),
    margin,
    margin + 75
  );

  // Recipient details
  pdf.setFont("helvetica", "normal");
  pdf.text(data.recipient?.name || "", margin, margin + 95);
  pdf.text(data.recipient?.address || "", margin, margin + 110);

  // Claims department header
  pdf.setFont("helvetica", "bold");
  pdf.text("CLAIMS DEPARTMENT", margin, margin + 140);

  // Salutation
  pdf.setFont("helvetica", "normal");
  pdf.text("Dear Sir/Madam,", margin, margin + 165);

  // Opening paragraph
  const openingText = `We acknowledge receipt of and thank you for your assignment dated ${
    data.letterDate || ""
  } instructing us to survey the damage to ${
    data.vehicle?.registration || ""
  }. We have completed the assignment and submit hereunder our findings.`;
  const splitOpeningText = pdf.splitTextToSize(openingText, contentWidth);
  pdf.text(splitOpeningText, margin, margin + 190);
};
