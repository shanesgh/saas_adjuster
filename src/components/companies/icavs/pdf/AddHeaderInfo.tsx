import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

/**
 * Adds the company header and contact information to the PDF.
 * @param pdf - The jsPDF instance.
 * @param data - The data object containing PDF information.
 */

export const addHeaderDetails = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  pageWidth: number,
  margin: number
) => {
  // Add company header
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    "Independent Claims Adjusting & Valuation Services Limited",
    pageWidth / 2,
    margin,
    { align: "center" }
  );

  // Add company address & contact
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("#139 Eastern Main Road, Barataria.", pageWidth / 2, margin + 15, {
    align: "center",
  });
  pdf.text("Tel# 1 (868) 235-5069", pageWidth / 2, margin + 30, {
    align: "center",
  });
  pdf.setTextColor(70, 130, 180);
  pdf.text("Email: icavslimited@gmail.com", pageWidth / 2, margin + 45, {
    align: "center",
  });
  pdf.setTextColor(0, 0, 0);

  // Draw underline for email
  const emailWidth = pdf.getTextWidth("Email: icavslimited@gmail.com");
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(70, 130, 180);
  pdf.line(
    pageWidth / 2 - emailWidth / 2,
    margin + 48,
    pageWidth / 2 + emailWidth / 2,
    margin + 48
  );

  // Add horizontal line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(margin, margin + 52, pageWidth - margin, margin + 52);
};
