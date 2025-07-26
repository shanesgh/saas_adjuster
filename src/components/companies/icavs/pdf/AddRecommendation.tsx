import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addRecommendation = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("RECOMMENDATION", pageWidth / 2, currentY, { align: "center" });

  const recommendationWidth = pdf.getTextWidth("RECOMMENDATION");
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - recommendationWidth / 2,
    currentY + 2,
    pageWidth / 2 + recommendationWidth / 2,
    currentY + 2
  );

  currentY += 26;

  // Settlement basis
  pdf.setFontSize(12);
  pdf.text("SETTLEMENT BASIS:", margin, currentY);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(10, 52, 99);
  pdf.text(data.recommendation?.settlementBasis || "", margin + 130, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  currentY += 25;

  // Cost and value
  pdf.setFont("helvetica", "bold");
  pdf.text("APPARENT COST OF REPAIRS:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `$${data.recommendation?.apparentCostOfRepairs || "0.00"} (VAT exc.)`,
    margin + 190,
    currentY
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("PRE-ACCIDENT VALUE:", margin + 330, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `$${data.recommendation?.preAccidentValue || "0.00"}`,
    margin + 475,
    currentY
  );

  currentY += 25;

  pdf.setFont("helvetica", "bold");
  pdf.text("SETTLEMENT OFFER:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `$${data.recommendation?.settlementOffer || "0.00"} (VAT exc.)`,
    margin + 135,
    currentY
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("RESERVE:", margin + 330, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `$${data.recommendation?.reserve || "0.00"}`,
    margin + 400,
    currentY
  );

  return (currentY += 40);
};
