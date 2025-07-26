import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addSectionAParts = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("SECTION (A): PARTS", margin, currentY);
  currentY += 25;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Adjusted source & type of parts:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("Automix - 751-2782 Used parts", margin + 200, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("Excluded Items & Reason disallowed:", margin, currentY);
  currentY += 18;

  pdf.setFont("helvetica", "normal");
  pdf.text(
    "• Rear bumper and left 'B' pillar- To repair",
    margin + 10,
    currentY
  );
  currentY += 14;
  pdf.text(
    "• Left taillight and rear seat - No visible damage",
    margin + 10,
    currentY
  );
  currentY += 14;
  pdf.text(
    "• Left kick strips and rear kick strip - For closer inspection",
    margin + 10,
    currentY
  );
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("Remarks:", margin, currentY);
  currentY += 16;

  pdf.setFont("helvetica", "normal");

  const leftMargin = margin + 50;
  const rightMargin = margin;
  const maxWidth = pageWidth - leftMargin - rightMargin;

  const paragraphs = [
    "The estimate included provision for a rear bumper and left 'B' pillar under the heading of material items. The damage to these components are reparable, and were as a result excluded from the material items by way of adjustments.",
    "The left taillight and rear seat showed no signs of impact damage and were struck off the material section of the estimate by way of adjustments.",
    "The estimate included provision for the replacement of a rear kick strip and 2 left side kick strips under the heading of material items. No damage was visible to these components at the time of inspection. These components will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned items were excluded from the material items in the interim.",
    "The material section of the estimate made provision for secondhand components. We were able to locate the required items on the market at lower prices, which are shown in red on the estimate.",
  ];

  paragraphs.forEach((paragraph) => {
    pdf.text(paragraph, leftMargin, currentY, { maxWidth });
    const lineCount = pdf.splitTextToSize(paragraph, maxWidth).length;
    currentY += lineCount * 14 + 6;
  });
  pdf.setFont("helvetica", "bold");
  pdf.text("Parts Figure Quoted:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$23,600.00", margin + 125, currentY);
  pdf.setFont("helvetica", "bold");
  pdf.text("Adjusted Parts Figure:", margin + 250, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$7,500.00", margin + 385, currentY);
  currentY += 50;

  return currentY;
};
