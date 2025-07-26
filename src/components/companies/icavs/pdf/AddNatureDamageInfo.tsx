import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

/**
 * Adds the Nature of Damage section to the PDF.
 * @param pdf - The jsPDF instance.
 * @param data - The data object containing PDF information.
 */
export const addNatureDamage = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  // NATURE OF DAMAGE section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("NATURE OF DAMAGE", pageWidth / 2, currentY, { align: "center" });

  const natureDamageWidth = pdf.getTextWidth("NATURE OF DAMAGE");
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - natureDamageWidth / 2,
    currentY + 2,
    pageWidth / 2 + natureDamageWidth / 2,
    currentY + 2
  );

  currentY += 30;

  // Nature of damage section - taking up 20% of page height
  const diagramSectionHeight = pageHeight * 0.35;
  const diagramStartY = currentY;

  // Empty box for diagram placeholder
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);

  const boxWidth = pageWidth * 0.8;
  const boxHeight = diagramSectionHeight * 0.7;
  const boxX = (pageWidth - boxWidth) / 2;

  pdf.rect(boxX, diagramStartY, boxWidth, boxHeight);

  // Add placeholder text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(
    "Vehicle Damage Diagram",
    pageWidth / 2,
    diagramStartY + boxHeight / 2,
    { align: "center" }
  );

  currentY = diagramStartY + diagramSectionHeight - 50;

  // Damage details
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("AFFECTED AREA:", margin, currentY);

  pdf.setFont("helvetica", "normal"); // Switch to normal font for data
  pdf.text(
    data.damage?.affectedArea || "Left broadside",
    margin + 110,
    currentY
  );

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("DEFORMATION SEVERITY:", margin, currentY);

  pdf.setFont("helvetica", "normal"); // Switch to normal font for data
  pdf.text(data.damage?.deformationSeverity || "Major", margin + 170, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("AFFECTED STRUCTURAL COMPONENTS:", margin, currentY);

  pdf.setFont("helvetica", "normal"); // Switch to normal font for data
  pdf.text(
    data.damage?.affectedStructuralComponents ||
      'Left "B" pillar and left rear wheel arch',
    margin + 250,
    currentY
  );

  return (currentY += 35);
};
