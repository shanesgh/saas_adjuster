import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

/**
 * Adds the Estimate Information section to the PDF.
 * @param pdf - The jsPDF instance.
 * @param data - The data object containing PDF information.
 */
export const addEstimateInformation = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  // THE ESTIMATE section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("THE ESTIMATE", pageWidth / 2, currentY, { align: "center" });

  const estimateWidth = pdf.getTextWidth("THE ESTIMATE");
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - estimateWidth / 2,
    currentY + 2,
    pageWidth / 2 + estimateWidth / 2,
    currentY + 2
  );

  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Please refer to attached estimate.", margin, currentY);

  currentY += 22;

  // Estimate details
  // ESTIMATE FROM
  pdf.setFont("helvetica", "bold");
  pdf.text("ESTIMATE FROM:", margin, currentY);

  pdf.setFont("helvetica", "normal"); // Normal font for data
  pdf.text(
    data.estimate?.from || "Aristocraft Auto Collision",
    margin + 110,
    currentY
  );

  // DATED
  pdf.setFont("helvetica", "bold");
  pdf.text("DATED:", margin + 300, currentY);

  pdf.setFont("helvetica", "normal"); // Normal font for data
  pdf.text(
    data.estimate?.dated ? "DATED" : "NOT DATED",
    margin + 350,
    currentY
  );

  currentY += 18;
};
