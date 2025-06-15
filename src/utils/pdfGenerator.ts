//remarks to chang eback to data
//make reponsive height
import jsPDF from "jspdf";
import { ClaimsFormData, invoiceData } from "../types/form";

export const generatePdfPreview = async (
  data: Partial<ClaimsFormData>
): Promise<Blob> => {
  const pdf = await generatePdfDocument(data);
  return pdf.output("blob");
};

export const generatePdf = async (
  data: Partial<ClaimsFormData>
): Promise<void> => {
  const pdf = await generatePdfDocument(data);
  pdf.save(
    `ICAVS_Report_${data.vehicle?.registration || "New"}_${
      data.ourRef || ""
    }.pdf`
  );
};

const addPageFooter = (
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

const generatePdfDocument = async (
  data: Partial<ClaimsFormData>
): Promise<jsPDF> => {
  // Create a new PDF document
  const pdf = new jsPDF("p", "pt", "letter");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  // Reserve space for footer

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
  // Get text width to determine underline length

  const emailWidth = pdf.getTextWidth("Email: icavslimited@gmail.com");

  // Draw underline slightly below the text
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(70, 130, 180); // Black color
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

  // Date
  pdf.setFontSize(12);
  const addOrdinalSuffix = (date: string | number | Date) => {
    const day = new Date(date).getDate();
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || [11, 12, 13].includes(day) ? 0 : day % 10
    ];
    return `${new Date(date).toLocaleDateString("en-US", {
      month: "long",
    })} ${day}${suffix}, ${new Date(date).getFullYear()}`;
  };

  pdf.text(
    addOrdinalSuffix(data.letterDate || new Date()),
    margin,
    margin + 75
  );

  // Recipient
  pdf.text(data.recipient?.name || "", margin, margin + 95);

  pdf.text(data.recipient?.address || "", margin, margin + 110);

  // CLAIMS DEPARTMENT
  pdf.setFont("helvetica", "bold");
  pdf.text("CLAIMS DEPARTMENT", margin, margin + 140);

  // Salutation
  pdf.setFont("helvetica", "normal");
  pdf.text("Dear Sir/Madam,", margin, margin + 165);

  // Opening paragraph
  pdf.setFont("helvetica", "normal");
  const openingText = `We acknowledge receipt of and thank you for your assignment dated ${
    data.letterDate || ""
  } instructing us to survey the damage to ${
    data.vehicle?.registration || ""
  }. We have completed the assignment and submit hereunder our findings.`;
  const splitOpeningText = pdf.splitTextToSize(openingText, contentWidth);
  pdf.text(splitOpeningText, margin, margin + 190);

  // INSURED
  let currentY = margin + 250;
  pdf.setFont("helvetica", "bold");
  pdf.text("INSURED [x]:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.insured || "", margin + 80, currentY);

  currentY += 28;

  // Reference information in a table-like format
  pdf.setFont("helvetica", "bold");
  pdf.text("DATE RECEIVED:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.dateReceived || "", margin + 120, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("YOUR REF#:", margin + 300, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.yourRef || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("DATE INSPECTED:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.dateInspected || "", margin + 120, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("OUR REF#:", margin + 300, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(70, 130, 180);
  pdf.text(data.ourRef || "", margin + 380, currentY);
  pdf.setTextColor(0, 0, 0);
  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("DATE OF LOSS:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.dateOfLoss || "", margin + 120, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("INVOICE#:", margin + 300, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoice || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("NUMBER OF PHOTOGRAPHS:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(`(${data.numberOfPhotographs || "0"})`, margin + 180, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("WITNESS:", margin + 300, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.witness || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("PLACE OF INSPECTION:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.placeOfInspection || "", margin + 150, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("CLAIMS TECHNICIAN:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.claimsTechnician || "", margin + 150, currentY);

  currentY += 25;

  // THE VEHICLE section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("THE VEHICLE", pageWidth / 2, currentY, { align: "center" });

  // Get text width to determine underline length
  const textWidth = pdf.getTextWidth("THE VEHICLE");

  // Draw underline slightly below the text
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - textWidth / 2,
    currentY + 2,
    pageWidth / 2 + textWidth / 2,
    currentY + 2
  );

  currentY += 25;

  // Vehicle details
  pdf.setFontSize(12);
  pdf.text("VEHICLE MAKE & MODEL:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.makeAndModel || "", margin + 160, currentY);

  // Checkboxes for vehicle type
  if (data.vehicle?.isAutomatic) {
    pdf.text("[x]", margin + 270, currentY);
  } else {
    pdf.text("[ ]", margin + 270, currentY);
  }
  pdf.text("AUTOMATIC", margin + 285, currentY);

  if (data.vehicle?.isGasolene) {
    pdf.text("[x]", margin + 365, currentY);
  } else {
    pdf.text("[ ]", margin + 365, currentY);
  }
  pdf.text("GASOLENE", margin + 380, currentY);

  if (data.vehicle?.isHybridElectric) {
    pdf.text("[x]", margin + 453, currentY);
  } else {
    pdf.text("[ ]", margin + 453, currentY);
  }
  pdf.text("HYBRID", margin + 468, currentY);

  currentY += 18;

  // More vehicle details
  pdf.setFont("helvetica", "bold");
  pdf.text("VEHICLE REG#:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.registration || "", margin + 100, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("YEAR OF MANU:", margin + 160, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.yearOfManufacture || "", margin + 260, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("COLOUR:", margin + 295, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.color || "", margin + 355, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("ODOMETER:", margin + 420, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.odometer || "", margin + 498, currentY);

  currentY += 18;

  // Identification
  pdf.setFont("helvetica", "bold");
  pdf.text("IDENTIFICATION:", margin, currentY);
  pdf.text("VIN/CHASSIS#:", margin + 105, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    data.vehicle?.identification?.vinChassis || "",
    margin + 200,
    currentY
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("ENGINE#:", margin + 335, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.identification?.engine || "", margin + 395, currentY);

  currentY += 18;

  // Foreign Used checkbox
  if (data.vehicle?.isForeignUsed) {
    pdf.text("[x]", margin, currentY);
  } else {
    pdf.text("[ ]", margin, currentY);
  }
  pdf.setFont("helvetica", "bold");
  pdf.text("FOREIGN USED", margin + 16, currentY);

  currentY += 30;

  // Features Header
  pdf.setFont("helvetica", "bold");
  pdf.text("FEATURES:", margin, currentY);
  currentY += 20;

  // Feature positioning settings
  const startX = margin + 20;
  const maxWidth = pageWidth - margin - startX;
  let currentX = startX;
  let rowHeight = 15;

  // Loop through features dynamically
  Object.entries(data.features || {}).forEach(([key, value]) => {
    if (value) {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      const checkboxText = "[x] " + label;
      const textWidth = pdf.getTextWidth(checkboxText);

      if (currentX + textWidth > maxWidth) {
        currentX = startX;
        currentY += rowHeight;
      }

      pdf.text(checkboxText, currentX, currentY);
      currentX += textWidth + 10;
    }
  });

  currentY += 30;

  // CONDITION PRIOR TO THE LOSS section
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

  // Add page footer for page 1
  addPageFooter(pdf, data, 1);

  // PAGE 2 - Create new page for next sections
  pdf.addPage();
  currentY = margin;

  // GENERAL REMARKS ON VEHICLE CONDITION
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0); // Ensure black color
  pdf.text("GENERAL REMARKS ON VEHICLE CONDITION", pageWidth / 2, currentY, {
    align: "center",
  });

  const generalRemarksWidth = pdf.getTextWidth(
    "GENERAL REMARKS ON VEHICLE CONDITION"
  );
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - generalRemarksWidth / 2,
    currentY + 2,
    pageWidth / 2 + generalRemarksWidth / 2,
    currentY + 2
  );

  currentY += 25;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");

  const vehicleYear = data.vehicle?.yearOfManufacture || "2016";
  const generalRemarksText = `According to the decoded VIN, the vehicle was manufactured in the year ${vehicleYear} prior to being imported into the country used. It has completed its first year of registration locally and was in good condition prior to the loss.`;

  const splitGeneralRemarks = pdf.splitTextToSize(
    generalRemarksText,
    contentWidth
  );
  pdf.text(splitGeneralRemarks, margin, currentY);
  currentY += splitGeneralRemarks.length * 12 + 15;

  // TYRES section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("TYRES:", margin, currentY);
  currentY += 15;

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

  currentY += 50;

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

  const boxWidth = contentWidth * 0.8;
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

  currentY += 35;

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

  // Add page footer for page 2
  addPageFooter(pdf, data, 2);
  pdf.addPage();
  currentY = margin;

  // SECTION (A): PARTS
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
  const remarksText1 =
    "The estimate included provision for a rear bumper and left 'B' pillar under the heading of";
  pdf.text(remarksText1, margin + 70, currentY);
  currentY += 14;
  const remarksText2 =
    "material items. The damage to these components are reparable, and were as a result";
  pdf.text(remarksText2, margin + 70, currentY);
  currentY += 14;
  const remarksText3 =
    "excluded from the material items by way of adjustments.";
  pdf.text(remarksText3, margin + 70, currentY);
  currentY += 18;

  const remarksText4 =
    "The left taillight and rear seat showed no signs of impact damage and were struck off";
  pdf.text(remarksText4, margin + 70, currentY);
  currentY += 14;
  const remarksText5 =
    "the material section of the estimate by way of adjustments.";
  pdf.text(remarksText5, margin + 70, currentY);
  currentY += 18;

  const remarksText6 =
    "The estimate included provision for the replacement of a rear kick strip and 2 left side";
  pdf.text(remarksText6, margin + 70, currentY);
  currentY += 14;
  const remarksText7 =
    "kick strips under the heading of material items. No damage was visible to these";
  pdf.text(remarksText7, margin + 70, currentY);
  currentY += 14;
  const remarksText8 =
    "components at the time of inspection. These components will require verification by the";
  pdf.text(remarksText8, margin + 70, currentY);
  currentY += 14;
  const remarksText9 =
    "repairer after the job is opened and the findings communicated to your office following";
  pdf.text(remarksText9, margin + 70, currentY);
  currentY += 14;
  const remarksText10 =
    "which the damage can be confirmed by our office. To this end the above-mentioned";
  pdf.text(remarksText10, margin + 70, currentY);
  currentY += 14;
  const remarksText11 =
    "items were excluded from the material items in the interim.";
  pdf.text(remarksText11, margin + 70, currentY);
  currentY += 18;

  const remarksText12 =
    "The material section of the estimate made provision for secondhand components. We";
  pdf.text(remarksText12, margin + 70, currentY);
  currentY += 14;
  const remarksText13 =
    "were able to locate the required items on the market at lower prices, which are shown in";
  pdf.text(remarksText13, margin + 70, currentY);
  currentY += 14;
  const remarksText14 = "red on the estimate.";
  pdf.text(remarksText14, margin + 70, currentY);
  currentY += 30;

  pdf.setFont("helvetica", "bold");
  pdf.text("Parts Figure Quoted:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$23,600.00", margin + 125, currentY);
  pdf.setFont("helvetica", "bold");
  pdf.text("Adjusted Parts Figure:", margin + 250, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$7,500.00", margin + 385, currentY);
  currentY += 50;

  // SECTION (B): LABOUR
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("SECTION (B): LABOUR", margin, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Remarks:", margin, currentY);
  currentY += 16;

  pdf.setFont("helvetica", "normal");
  const labourText1 =
    "The labour and material figure was overstated in the amount of $14,730.00 which was";
  pdf.text(labourText1, margin + 10, currentY);
  currentY += 14;
  const labourText2 =
    "adjusted downward to $7,690.00 which would be more realistic when compared to the";
  pdf.text(labourText2, margin + 10, currentY);
  currentY += 14;
  const labourText3 =
    "actual man hours involved to complete the repair exercise.";
  pdf.text(labourText3, margin + 10, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("Figure Quoted:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$14,730.00", margin + 90, currentY);
  pdf.setFont("helvetica", "bold");
  pdf.text("Adjusted Labour & Material Figure:", margin + 220, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text("$7,690.00", margin + 425, currentY);
  currentY += 22;

  pdf.setFont("helvetica", "bold");
  pdf.text(
    "Repairs ought to be completed in (4) working days.",
    margin,
    currentY
  );
  pdf.setFont("helvetica", "normal");

  currentY += 45;

  // Add page footer for page 3
  addPageFooter(pdf, data, 3);

  // RECOMMENDATION section
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

  currentY += 40;
  pdf.addPage();
  currentY = margin;
  // Remarks
  pdf.setFont("helvetica", "bold");
  pdf.text("REMARKS:", margin, currentY);
  currentY += 20;
  pdf.setFont("helvetica", "normal");
  const remarksText =
    data.recommendation?.remarks ||
    "If you are liable, we suggest that you treat this claim on a repair or cash in lieu of repair basis.";
  const splitRemarks = pdf.splitTextToSize(remarksText, contentWidth);
  pdf.text(splitRemarks, margin, currentY);

  currentY += splitRemarks.length * 15 + 30;

  // Signature

  currentY += 40;

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

  // Add page footer for page 4
  addPageFooter(pdf, data, 4);

  // PAGE5 - TAX INVOICE (Starting from line 877)
  pdf.addPage();

  currentY = margin;
  pdf.setLineWidth(0.3);

  // Colors and font setup
  pdf.setDrawColor(0, 0, 0);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");

  // HEADER SECTION
  // Company Name (Center-aligned)
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  const companyName = invoiceData.company.name;
  const companyNameWidth = pdf.getTextWidth(companyName);
  pdf.text(companyName, (pageWidth - companyNameWidth) / 2, currentY);
  currentY += pageHeight * 0.04; // Proportional spacing

  // Address (Center-aligned)
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const address = invoiceData.company.address;
  const addressWidth = pdf.getTextWidth(address);
  pdf.text(address, (pageWidth - addressWidth) / 2, currentY);
  currentY += pageHeight * 0.01;

  // TAX INVOICE (Right-aligned below address)
  pdf.setFont("helvetica", "bold");

  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  const taxInvoiceText = "TAX INVOICE";
  const taxInvoiceWidth = pdf.getTextWidth(taxInvoiceText);
  pdf.setFont("helvetica", "normal");
  pdf.text(taxInvoiceText, pageWidth - margin - taxInvoiceWidth, currentY);
  currentY += 10;

  // V.A.T. Registration Number Box (Right-aligned)
  const vatBoxHeight = pageHeight * 0.025; // Proportional to page height
  const vatBoxWidth = pageWidth * 0.25; // 25% of page width
  const vatBoxX = pageWidth - margin - vatBoxWidth;
  pdf.rect(vatBoxX, currentY, vatBoxWidth, vatBoxHeight);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `VAT Reg #: ${invoiceData.company.vatRegistration}`,
    vatBoxX + vatBoxWidth / 4,
    currentY + vatBoxHeight * 0.7
  );
  currentY += vatBoxHeight + 10;

  // INVOICE DETAILS SECTION
  // Date and Invoice Number (side by side with proper spacing)
  const detailBoxHeight = pageHeight * 0.03; // Proportional height
  const detailBoxWidth = pageWidth * 0.16; // 20% of page width each

  const dateBoxX = pageWidth - margin - 2 * detailBoxWidth;
  const invoiceBoxX = dateBoxX + detailBoxWidth;

  // Phone number box (left of Date box)
  const phoneBoxX = margin;
  pdf.rect(phoneBoxX, currentY - 20, detailBoxWidth * 0.8, detailBoxHeight); // Label box
  pdf.rect(
    phoneBoxX + detailBoxWidth * 0.8,
    currentY - 20,
    detailBoxWidth,
    detailBoxHeight
  ); // Value box

  pdf.text("Phone #:", phoneBoxX + 3, currentY - 20 + detailBoxHeight * 0.6);
  pdf.text(
    "1 (868) 235-5069",
    phoneBoxX + detailBoxWidth * 0.8 + 3,
    currentY - 20 + detailBoxHeight * 0.6
  );

  // Email box (directly below Phone, NO spacing)
  pdf.rect(
    phoneBoxX,
    currentY - 20 + detailBoxHeight,
    detailBoxWidth * 0.8,
    detailBoxHeight
  ); // Label box
  pdf.rect(
    phoneBoxX + detailBoxWidth * 0.8,
    currentY - 20 + detailBoxHeight,
    detailBoxWidth * 1.5,
    detailBoxHeight
  ); // Value box

  pdf.text("Email:", phoneBoxX + 3, currentY - 20 + detailBoxHeight * 1.6);
  pdf.text(
    "icavslimited.com",
    phoneBoxX + detailBoxWidth * 0.8 + 3,
    currentY - 20 + detailBoxHeight * 1.6
  );

  // Date box (unchanged)
  pdf.rect(dateBoxX, currentY, detailBoxWidth, detailBoxHeight);
  pdf.rect(
    dateBoxX,
    currentY + detailBoxHeight,
    detailBoxWidth,
    detailBoxHeight
  );

  pdf.setFont("helvetica", "bold");
  pdf.text(
    "Date:",
    dateBoxX + detailBoxWidth / 3.5,
    currentY + detailBoxHeight * 0.6
  );
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `${invoiceData.invoice.date}`,
    dateBoxX + detailBoxWidth / 3.5,
    currentY + detailBoxHeight * 1.6
  );

  // Invoice number box (unchanged)
  pdf.rect(invoiceBoxX, currentY, detailBoxWidth, detailBoxHeight);
  pdf.rect(
    invoiceBoxX,
    currentY + detailBoxHeight,
    detailBoxWidth,
    detailBoxHeight
  );

  pdf.text(
    "Invoice #:",
    invoiceBoxX + detailBoxWidth / 3.5,
    currentY + detailBoxHeight * 0.6
  );
  pdf.text(
    `${invoiceData.invoice.number}`,
    invoiceBoxX + detailBoxWidth / 3.5,
    currentY + detailBoxHeight * 1.6
  );

  currentY += detailBoxHeight + 35; // Maintain spacing // Maintain spacing
  // 20% spacing equivalent

  // BILLING INFORMATION SECTION
  const billingHeaderHeight = pageHeight * 0.03;
  const thirdWidth = (pageWidth - 2 * margin) / 3;

  // Bill To, Insured Details, Third Party Name headers
  pdf.setFont("helvetica", "normal");
  pdf.rect(margin, currentY, thirdWidth, billingHeaderHeight);
  pdf.text("BILL TO:", margin + 2, currentY + 2 + billingHeaderHeight * 0.6);

  pdf.rect(margin + thirdWidth, currentY, thirdWidth, billingHeaderHeight);
  pdf.text(
    "INSURED DETAILS:",
    margin + thirdWidth + 3,
    currentY + 2 + billingHeaderHeight * 0.6
  );

  pdf.rect(margin + 2 * thirdWidth, currentY, thirdWidth, billingHeaderHeight);
  pdf.text(
    "THIRD PARTY NAME:",
    margin + 2 * thirdWidth + 3,
    currentY + 2 + billingHeaderHeight * 0.6
  );

  currentY += billingHeaderHeight;

  // Bill To Address (larger height for readability)
  const addressBoxHeight = pageHeight * 0.12; // Sufficient height for multi-line address
  pdf.setFont("helvetica", "normal");
  pdf.rect(margin, currentY, thirdWidth, addressBoxHeight);
  pdf.text(invoiceData.billTo.name, margin + 3, currentY + 12);
  const addressLines = invoiceData.billTo.address.split("\n");
  addressLines.forEach((line, index) => {
    pdf.text(line, margin + 3, currentY + 22 + index * 10);
  });

  // Insured Details box
  pdf.rect(margin + thirdWidth, currentY, thirdWidth, addressBoxHeight);
  pdf.text(invoiceData.insured.name, margin + thirdWidth + 3, currentY + 12);
  pdf.text(
    invoiceData.insured.vehicleType,
    margin + thirdWidth + 3,
    currentY + 25
  );

  // Third Party boxes (three separate boxes with readable height)
  const smallBoxHeight = pageHeight * 0.04;
  pdf.rect(margin + 2 * thirdWidth, currentY, thirdWidth, smallBoxHeight);
  pdf.text(
    invoiceData.thirdParty.name,
    margin + 2 * thirdWidth + 3,
    currentY + smallBoxHeight * 0.6
  );

  pdf.rect(
    margin + 2 * thirdWidth,
    currentY + smallBoxHeight,
    thirdWidth,
    smallBoxHeight
  );
  pdf.text(
    "THIRD PARTY VEHICLE",
    margin + 2 * thirdWidth + 3,
    currentY + 1.2 * smallBoxHeight + smallBoxHeight * 0.4
  );

  pdf.rect(
    margin + 2 * thirdWidth,
    currentY + 2 * smallBoxHeight,
    thirdWidth,
    smallBoxHeight
  );

  pdf.text(
    invoiceData.thirdParty.vehicle,
    margin + 2 * thirdWidth + 3,
    currentY + 2.2 * smallBoxHeight + smallBoxHeight * 0.4
  );

  currentY += addressBoxHeight + 10; // 20% spacing equivalent

  // REFERENCE SECTION
  const refBoxHeight = pageHeight * 0.03;
  const refTotalWidth = pageWidth * 0.6; // Total width of the three main reference boxes
  const ourRefWidth = refTotalWidth * 0.44;
  const yourRefWidth = refTotalWidth * 0.31;
  const claimsTechWidth = refTotalWidth * 0.25;
  const adjusterWidth = pageWidth * 0.1;
  const dateLossWidth = adjusterWidth; // Same as adjuster width

  // Starting position for left-side reference boxes
  let refX = margin;

  // Our Reference
  pdf.rect(refX, currentY, ourRefWidth, refBoxHeight);
  pdf.text("Our Reference:", refX + 3, currentY + refBoxHeight * 0.6);
  pdf.rect(refX, currentY + refBoxHeight, ourRefWidth, refBoxHeight);
  pdf.text(invoiceData.reference.our, refX + 3, currentY + refBoxHeight * 1.6);

  refX += ourRefWidth;

  // Your Reference
  pdf.rect(refX, currentY, yourRefWidth, refBoxHeight);
  pdf.text("Your Reference:", refX + 3, currentY + refBoxHeight * 0.6);
  pdf.rect(refX, currentY + refBoxHeight, yourRefWidth, refBoxHeight);
  pdf.text(invoiceData.reference.your, refX + 3, currentY + refBoxHeight * 1.6);

  refX += yourRefWidth;

  // Claim Technician
  pdf.rect(refX, currentY, claimsTechWidth, refBoxHeight);
  pdf.text("Claim Technician:", refX + 3, currentY + refBoxHeight * 0.6);
  pdf.rect(refX, currentY + refBoxHeight, claimsTechWidth, refBoxHeight);
  pdf.text(
    invoiceData.reference.claimsTechnician,
    refX + 3,
    currentY + refBoxHeight * 1.6
  );

  // Move Date of Loss & Adjuster to the Right
  const rightX = pageWidth - margin - 2 * dateLossWidth; // Shift closer to right side

  // Date of Loss
  pdf.rect(rightX - 30, currentY, dateLossWidth, refBoxHeight);
  pdf.text("Date of Loss:", rightX - 27, currentY + refBoxHeight * 0.6);
  pdf.rect(rightX - 30, currentY + refBoxHeight, dateLossWidth, refBoxHeight);
  pdf.text(
    invoiceData.reference.dateOfLoss,
    rightX - 27,
    currentY + refBoxHeight * 1.6
  );

  // Adjuster (Far Right)
  const adjusterX = pageWidth - margin - adjusterWidth;
  pdf.rect(adjusterX, currentY, adjusterWidth, refBoxHeight);
  pdf.text("Adjuster:", adjusterX + 3, currentY + refBoxHeight * 0.6);
  pdf.rect(adjusterX, currentY + refBoxHeight, adjusterWidth, refBoxHeight);
  pdf.text(
    invoiceData.reference.adjuster,
    adjusterX + 3,
    currentY + refBoxHeight * 1.6
  );

  currentY += 2 * refBoxHeight + pageHeight * 0.01; // 10% spacing equivalent

  // ITEMIZED CHARGES TABLE
  const tableHeaderHeight = pageHeight * 0.03;
  const tableContentHeight = pageHeight * 0.135; // Sufficient height for content

  // Column widths based on specifications
  const itemColWidth = pageWidth * 0.18; // Item column
  const qtyRateAmountWidth = pageWidth * 0.25; // Combined Qty, Rate, Amount
  const qtyWidth = qtyRateAmountWidth * 0.2; // Smallest portion
  const rateWidth = qtyRateAmountWidth * 0.4; // Equal split of remaining
  const amountWidth = qtyRateAmountWidth * 0.4; // Equal split of remaining
  const descWidth = contentWidth - itemColWidth - qtyRateAmountWidth; // Remaining width

  // Table headers
  pdf.setFont("helvetica", "normal");

  let tableX = margin;
  pdf.rect(tableX, currentY, itemColWidth, tableHeaderHeight);
  pdf.text("Item", tableX + 3, currentY + tableHeaderHeight * 0.6);

  tableX += itemColWidth;
  pdf.rect(tableX, currentY, descWidth, tableHeaderHeight);
  pdf.text("Description", tableX + 3, currentY + tableHeaderHeight * 0.6);

  tableX += descWidth;
  pdf.rect(tableX, currentY, qtyWidth, tableHeaderHeight);
  pdf.text("Qty", tableX + 3, currentY + tableHeaderHeight * 0.6);

  tableX += qtyWidth;
  pdf.rect(tableX, currentY, rateWidth, tableHeaderHeight);
  pdf.text("Rate", tableX + 3, currentY + tableHeaderHeight * 0.6);

  tableX += rateWidth;
  pdf.rect(tableX, currentY, amountWidth, tableHeaderHeight);
  pdf.text("Amount", tableX + 3, currentY + tableHeaderHeight * 0.6);

  currentY += tableHeaderHeight;

  // Table content area
  tableX = margin;
  pdf.rect(tableX, currentY, itemColWidth, tableContentHeight);
  pdf.rect(tableX + itemColWidth, currentY, descWidth, tableContentHeight);
  pdf.rect(
    tableX + itemColWidth + descWidth,
    currentY,
    qtyWidth,
    tableContentHeight
  );
  pdf.rect(
    tableX + itemColWidth + descWidth + qtyWidth,
    currentY,
    rateWidth,
    tableContentHeight
  );
  pdf.rect(
    tableX + itemColWidth + descWidth + qtyWidth + rateWidth,
    currentY,
    amountWidth,
    tableContentHeight
  );

  // Fill in item data
  if (invoiceData.items && invoiceData.items.length > 0) {
    const item = invoiceData.items[0];
    pdf.setFont("helvetica", "normal");

    tableX = margin;
    pdf.text(item.code, tableX + 3, currentY + 15);

    tableX += itemColWidth;
    pdf.text(item.description, tableX + 3, currentY + 15, {
      maxWidth: descWidth - 6,
    });

    tableX += descWidth;
    pdf.text(item.qty.toString(), tableX + 3, currentY + 15);

    tableX += qtyWidth;
    pdf.text(`$${item.rate.toFixed(2)}`, tableX + 3, currentY + 15);

    tableX += rateWidth;
    pdf.text(`$${item.amount.toFixed(2)}`, tableX + 3, currentY + 15);
  }

  currentY += tableContentHeight;

  // FINANCIAL SUMMARY (Right half of page)
  const financialBoxHeight = pageHeight * 0.035;
  const financialBoxWidth = contentWidth * 0.45; // 45% of content width
  const financialX = pageWidth - margin - financialBoxWidth;

  const labelWidth = financialBoxWidth * 0.6;
  const valueWidth = financialBoxWidth * 0.4;

  pdf.setFont("helvetica", "normal");

  // Subtotal
  pdf.rect(financialX, currentY, financialBoxWidth, financialBoxHeight);
  pdf.text("Subtotal:", financialX + 3, currentY + financialBoxHeight * 0.6);
  pdf.text(
    `$${invoiceData.financial.subtotal.toFixed(2)}`,
    financialX + labelWidth,
    currentY + financialBoxHeight * 0.6
  );

  // VAT
  pdf.rect(
    financialX,
    currentY + financialBoxHeight,
    financialBoxWidth,
    financialBoxHeight
  );
  pdf.text(
    `VAT (${invoiceData.financial.vatRate}%):`,
    financialX + 3,
    currentY + financialBoxHeight + financialBoxHeight * 0.6
  );
  pdf.text(
    `$${invoiceData.financial.vatAmount.toFixed(2)}`,
    financialX + labelWidth,
    currentY + financialBoxHeight + financialBoxHeight * 0.6
  );

  // Total
  pdf.rect(
    financialX,
    currentY + 2 * financialBoxHeight,
    financialBoxWidth,
    financialBoxHeight
  );
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Total:",
    financialX + 3,
    currentY + 2 * financialBoxHeight + financialBoxHeight * 0.6
  );
  pdf.text(
    `$${invoiceData.financial.total.toFixed(2)}`,
    financialX + labelWidth,
    currentY + 2 * financialBoxHeight + financialBoxHeight * 0.6
  );

  // Payments/Credits
  pdf.setFont("helvetica", "normal");
  pdf.rect(
    financialX,
    currentY + 3 * financialBoxHeight,
    financialBoxWidth,
    financialBoxHeight
  );
  pdf.text(
    "Payments/Credits:",
    financialX + 3,
    currentY + 3 * financialBoxHeight + financialBoxHeight * 0.6
  );
  pdf.text(
    `$${invoiceData.financial.paymentsCredits.toFixed(2)}`,
    financialX + labelWidth,
    currentY + 3 * financialBoxHeight + financialBoxHeight * 0.6
  );

  // Balance Due
  pdf.rect(
    financialX,
    currentY + 4 * financialBoxHeight,
    financialBoxWidth,
    financialBoxHeight
  );
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Balance Due:",
    financialX + 3,
    currentY + 4 * financialBoxHeight + financialBoxHeight * 0.6
  );
  pdf.text(
    `$${invoiceData.financial.balanceDue.toFixed(2)}`,
    financialX + labelWidth,
    currentY + 4 * financialBoxHeight + financialBoxHeight * 0.6
  );

  currentY += 5 * financialBoxHeight + pageHeight * 0.02; // 20% spacing equivalent

  // PAYMENT INSTRUCTIONS
  const paymentInstructionHeight = pageHeight * 0.04; // Sufficient height for text
  const paymentInstructionWidth = contentWidth * 0.55; // 50% of content width

  pdf.rect(margin, currentY, paymentInstructionWidth, paymentInstructionHeight);
  pdf.setFont("helvetica", "normal");
  const paymentText = "Please make all cheques payable to ICAVS Limited";
  pdf.text(paymentText, margin + 3, currentY + 19, {
    maxWidth: paymentInstructionWidth - 6,
  });

  // Add page footer if the function exists
  if (typeof addPageFooter === "function") {
    addPageFooter(pdf, data, 5);
  }

  return pdf;
};
