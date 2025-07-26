import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addConditionDetails = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("CONDITION PRIOR TO THE LOSS", pageWidth / 2, currentY, {
    align: "center",
  });

  const conditionLossWidth = pdf.getTextWidth("CONDITION PRIOR TO THE LOSS");
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - conditionLossWidth / 2,
    currentY + 2,
    pageWidth / 2 + conditionLossWidth / 2,
    currentY + 2
  );
  currentY += 25;

  // Body condition
  pdf.setFontSize(12);
  pdf.text("BODY CONDITION:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.condition?.body || "", margin + 115, currentY);

  currentY += 18;

  // Paint condition
  pdf.setFont("helvetica", "bold");
  pdf.text("PAINT CONDITION:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.condition?.paint || "", margin + 120, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("SPECIALIZED PAINT:", margin + 230, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.condition?.specializedPaint || "", margin + 360, currentY);

  currentY += 18;

  // Trim condition
  pdf.setFont("helvetica", "bold");
  pdf.text("TRIM: DOOR/UPHOLSTERY:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.condition?.doorUpholstery || "", margin + 170, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("SEAT TRIM (FRONT & REAR):", margin + 230, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.condition?.seatTrim || "", margin + 410, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("PREVIOUS DAMAGE:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.previousDamage || "None Visible", margin + 130, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("PREVIOUS REPAIR:", margin + 220, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.previousRepairs || "None Visible", margin + 340, currentY);
};
