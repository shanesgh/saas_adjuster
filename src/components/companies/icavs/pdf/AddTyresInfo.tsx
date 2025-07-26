import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

/**
 * Adds the Tyres section to the PDF.
 * @param pdf - The jsPDF instance.
 * @param data - The data object containing PDF information.
 */
export const addTyresSection = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  // TYRES section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("TYRES:", margin, currentY);
  currentY += 20;

  // Tyres table - centered on page
  const totalTableWidth = 380;
  const tableStartX = (pageWidth - totalTableWidth) / 2;
  const tableStartY = currentY;
  const colWidths = [80, 120, 100, 80];
  const rowHeightTyre = 20;

  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0);

  // Table headers
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);

  // Header row
  pdf.rect(tableStartX, tableStartY, colWidths[0], rowHeightTyre);
  pdf.rect(
    tableStartX + colWidths[0],
    tableStartY,
    colWidths[1],
    rowHeightTyre
  );
  pdf.rect(
    tableStartX + colWidths[0] + colWidths[1],
    tableStartY,
    colWidths[2],
    rowHeightTyre
  );
  pdf.rect(
    tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
    tableStartY,
    colWidths[3],
    rowHeightTyre
  );

  // Header text - properly spaced to avoid overlap
  pdf.text("Tyre", tableStartX + 5, tableStartY + 12);
  pdf.text("Make & Size", tableStartX + colWidths[0] + 5, tableStartY + 12);
  pdf.text(
    "Min Tread Depth",
    tableStartX + colWidths[0] + colWidths[1] + 5,
    tableStartY + 12
  );
  pdf.text(
    "Condition",
    tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5,
    tableStartY + 12
  );

  // Table data rows
  const tyreData = [
    [
      "Right Front",
      `${data.tyres?.rightFront.make || "Roadstone"} ${
        data.tyres?.rightFront.size || "185/65R15"
      }`,
      data.tyres?.rightFront.treadDepth || "7mm",
      data.tyres?.rightFront.condition || "Good",
    ],
    [
      "Left Front",
      `${data.tyres?.leftFront.make || "Roadstone"} ${
        data.tyres?.leftFront.size || "185/65R15"
      }`,
      data.tyres?.leftFront.treadDepth || "7mm",
      data.tyres?.leftFront.condition || "Good",
    ],
    [
      "Right Rear",
      `${data.tyres?.rightRear.make || "Dunlop"} ${
        data.tyres?.rightRear.size || "175/65R15"
      }`,
      data.tyres?.rightRear.treadDepth || "5mm",
      data.tyres?.rightRear.condition || "Good",
    ],
    [
      "Left Rear",
      `${data.tyres?.leftRear.make || "Dunlop"} ${
        data.tyres?.leftRear.size || "175/65R15"
      }`,
      data.tyres?.leftRear.treadDepth || "5mm",
      data.tyres?.leftRear.condition || "Good",
    ],
  ];

  pdf.setFont("helvetica", "normal");
  tyreData.forEach((row, index) => {
    const y = tableStartY + rowHeightTyre + index * rowHeightTyre;

    // Draw row rectangles
    pdf.rect(tableStartX, y, colWidths[0], rowHeightTyre);
    pdf.rect(tableStartX + colWidths[0], y, colWidths[1], rowHeightTyre);
    pdf.rect(
      tableStartX + colWidths[0] + colWidths[1],
      y,
      colWidths[2],
      rowHeightTyre
    );
    pdf.rect(
      tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
      y,
      colWidths[3],
      rowHeightTyre
    );

    // Add text
    pdf.text(row[0], tableStartX + 5, y + 12);
    pdf.text(row[1], tableStartX + colWidths[0] + 5, y + 12);
    pdf.text(row[2], tableStartX + colWidths[0] + colWidths[1] + 5, y + 12);
    pdf.text(
      row[3],
      tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5,
      y + 12
    );
  });

  currentY = tableStartY + rowHeightTyre + tyreData.length * rowHeightTyre + 20;

  // Legend boxes
  pdf.setFont("helvetica", "bold");
  pdf.setFillColor(173, 216, 230); // Light blue
  pdf.rect(margin, currentY, 15, 15, "F");
  pdf.setTextColor(0, 0, 0);
  pdf.text("PREVIOUS DAMAGE", margin + 20, currentY + 10);

  pdf.setFillColor(255, 182, 193); // Light red
  pdf.rect(margin, currentY + 20, 15, 15, "F");
  pdf.text("INITIAL DAMAGE", margin + 20, currentY + 30);
  return currentY;
};
