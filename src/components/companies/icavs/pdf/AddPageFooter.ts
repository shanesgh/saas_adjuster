// utils/pdfUtils.ts

import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

/**
 * Adds a footer to the PDF with reference, vehicle, and page number.
 * @param pdf - The jsPDF instance.
 * @param data - The data object containing PDF information.
 * @param pageNumber - The current page number.
 */
export const addPageFooter = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  pageNumber: number
) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const footerY = pageHeight - 30;

  // Blue line at bottom
  pdf.setDrawColor(173, 216, 230);
  pdf.setLineWidth(5.0);
  pdf.line(margin, footerY - 15, pageWidth - margin, footerY - 15);

  // Footer text in grey
  pdf.setTextColor(128, 128, 128);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const refText = `${data.ourRef || "20210103_PDX-7167"}`;
  const vehicleText = `${data.vehicle?.registration || "PDX-7167"}`;
  const pageText = `Page ${pageNumber}`;

  const spacing = 8; // Adjust spacing between REF and Vehicle text

  // Position REF on the left
  pdf.text(refText, margin, footerY);

  // Position Vehicle text next to REF with spacing
  pdf.text(vehicleText, margin + pdf.getTextWidth(refText) + spacing, footerY);

  // Position Page number on the right
  pdf.text(pageText, pageWidth - margin, footerY, { align: "right" });

  // Reset text color to black
  pdf.setTextColor(0, 0, 0);
};
