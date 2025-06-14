//remarks to chang eback to data
//make reponsive height
import jsPDF from "jspdf";
import { ClaimsFormData, invoiceData } from "../types/form";

export const generatePdfPreview = async (
  data: Partial<ClaimsFormData>
): Promise<Blob> => {
  const pdf = await generatePdfDocument(data);
  return pdf.output('blob');
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

const addPageFooter = (pdf: jsPDF, data: Partial<ClaimsFormData>, pageNumber: number) => {
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
  pdf.setFont("times", "normal");
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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const maxContentY = pageHeight - 60; // Reserve space for footer

  // Add company header
  pdf.setFontSize(16);
  pdf.setFont("times", "bold");
  pdf.text(
    "Independent Claims Adjusting & Valuation Services Limited",
    pageWidth / 2,
    margin,
    { align: "center" }
  );

  // Add company address & contact
  pdf.setFontSize(11);
  pdf.setFont("times", "normal");
  pdf.text("#139 Eastern Main Road, Barataria.", pageWidth / 2, margin + 20, {
    align: "center",
  });
  pdf.text("Tel# 1 (868) 235-5069", pageWidth / 2, margin + 35, {
    align: "center",
  });
  pdf.text("Email: icavslimited@gmail.com", pageWidth / 2, margin + 50, {
    align: "center",
  });

  // Get text width to determine underline length
  const emailWidth = pdf.getTextWidth("Email: icavslimited@gmail.com");

  // Draw underline slightly below the text
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - emailWidth / 2,
    margin + 52,
    pageWidth / 2 + emailWidth / 2,
    margin + 52
  );

  // Add horizontal line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(margin, margin + 55, pageWidth - margin, margin + 55);

  const formattedDate = new Date(data.letterDate || new Date())
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Date
  pdf.setFontSize(12);
  const addOrdinalSuffix = (date) => {
    const day = new Date(date).getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || [11, 12, 13].includes(day)) ? 0 : day % 10];
    return `${new Date(date).toLocaleDateString("en-US", { month: "long" })} ${day}${suffix}, ${new Date(date).getFullYear()}`;
  };

  pdf.text(addOrdinalSuffix(data.letterDate || new Date()), margin, margin + 75);

  // Recipient
  pdf.text(data.recipient?.name || "", margin, margin + 105);

  
  pdf.text(data.recipient?.address || "", margin, margin + 120);

  // CLAIMS DEPARTMENT
  pdf.setFont("times", "bold");
  pdf.text("CLAIMS DEPARTMENT", margin, margin + 165);

  // Salutation
  pdf.setFont("times", "normal");
  pdf.text("Dear Sir/Madam,", margin, margin + 195);

  // Opening paragraph
  pdf.setFont("times", "normal");
  const openingText = `We acknowledge receipt of and thank you for your assignment dated ${
    data.letterDate || ""
  } instructing us to survey the damage to ${
    data.vehicle?.registration || ""
  }. We have completed the assignment and submit hereunder our findings.`;
  const splitOpeningText = pdf.splitTextToSize(openingText, contentWidth);
  pdf.text(splitOpeningText, margin, margin + 220);

  // INSURED
  let currentY = margin + 260;
  pdf.setFont("times", "bold");
  pdf.text("INSURED [x]:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.insured || "", margin + 80, currentY);

  currentY += 18;

  // Reference information in a table-like format
  pdf.setFont("times", "bold");
  pdf.text("DATE RECEIVED:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.dateReceived || "", margin + 120, currentY);

  pdf.setFont("times", "bold");
  pdf.text("YOUR REF#:", margin + 300, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.yourRef || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("DATE INSPECTED:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.dateInspected || "", margin + 120, currentY);

  pdf.setFont("times", "bold");
  pdf.text("OUR REF#:", margin + 300, currentY);
  pdf.setFont("times", "normal");
  pdf.setTextColor(70, 130, 180);
  pdf.text(data.ourRef || "", margin + 380, currentY);
  pdf.setTextColor(0, 0, 0);
  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("DATE OF LOSS:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.dateOfLoss || "", margin + 120, currentY);

  pdf.setFont("times", "bold");
  pdf.text("INVOICE#:", margin + 300, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.invoice || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("NUMBER OF PHOTOGRAPHS:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(`(${data.numberOfPhotographs || "0"})`, margin + 180, currentY);

  pdf.setFont("times", "bold");
  pdf.text("WITNESS:", margin + 300, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.witness || "", margin + 380, currentY);

  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("PLACE OF INSPECTION:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.placeOfInspection || "", margin + 150, currentY);

  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("CLAIMS TECHNICIAN:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.claimsTechnician || "", margin + 150, currentY);

  currentY += 30;

  // THE VEHICLE section
  pdf.setFont("times", "bold");
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

  currentY += 30;

  // Vehicle details
  pdf.setFontSize(12);
  pdf.text("VEHICLE MAKE & MODEL:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.makeAndModel || "", margin + 165, currentY);

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
  pdf.setFont("times", "bold");
  pdf.text("VEHICLE REG#:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.registration || "", margin + 100, currentY);

  pdf.setFont("times", "bold");
  pdf.text("YEAR OF MANU:", margin + 160, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.yearOfManufacture || "", margin + 260, currentY);

  pdf.setFont("times", "bold");
  pdf.text("COLOUR:", margin + 295, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.color || "", margin + 355, currentY);

  pdf.setFont("times", "bold");
  pdf.text("ODOMETER:", margin + 420, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.odometer || "", margin + 498, currentY);

  currentY += 18;

  // Identification
  pdf.setFont("times", "bold");
  pdf.text("IDENTIFICATION:", margin, currentY);
  pdf.text("VIN/CHASSIS#:", margin + 110, currentY);
  pdf.setFont("times", "normal");
  pdf.text(
    data.vehicle?.identification?.vinChassis || "",
    margin + 200,
    currentY
  );

  pdf.setFont("times", "bold");
  pdf.text("ENGINE#:", margin + 325, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.vehicle?.identification?.engine || "", margin + 385, currentY);

  currentY += 18;

  // Foreign Used checkbox
  if (data.vehicle?.isForeignUsed) {
    pdf.text("[x]", margin, currentY);
  } else {
    pdf.text("[ ]", margin, currentY);
  }
  pdf.setFont("times", "bold");
  pdf.text("FOREIGN USED", margin + 16, currentY);

  currentY += 30;

  // Features Header
  pdf.setFont("times", "bold");
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
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
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
  pdf.setFont("times", "bold");
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
  currentY += 30;

  // Body condition
  pdf.setFontSize(12);
  pdf.text("BODY CONDITION:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.condition?.body || "", margin + 115, currentY);

  currentY += 18;

  // Paint condition
  pdf.setFont("times", "bold");
  pdf.text("PAINT CONDITION:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.condition?.paint || "", margin + 120, currentY);

  pdf.setFont("times", "bold");
  pdf.text("SPECIALIZED PAINT:", margin + 230, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.condition?.specializedPaint || "", margin + 360, currentY);

  currentY += 18;

  // Trim condition
  pdf.setFont("times", "bold");
  pdf.text("TRIM: DOOR/UPHOLSTERY:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.condition?.doorUpholstery || "", margin + 170, currentY);

  pdf.setFont("times", "bold");
  pdf.text("SEAT TRIM (FRONT & REAR):", margin + 230, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.condition?.seatTrim || "", margin + 410, currentY);

  currentY += 18;

  pdf.setFont("times", "bold");
  pdf.text("PREVIOUS DAMAGE:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.previousDamage || "None Visible", margin + 150, currentY);

  pdf.setFont("times", "bold");
  pdf.text("PREVIOUS REPAIR:", margin + 230, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.previousRepairs || "None Visible", margin + 380, currentY);

  // Add page footer for page 1
  addPageFooter(pdf, data, 1);

  // PAGE 2 - Create new page for next sections
  pdf.addPage();
  currentY = margin + 20;

  // GENERAL REMARKS ON VEHICLE CONDITION
  pdf.setFont('times', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0); // Ensure black color
  pdf.text('GENERAL REMARKS ON VEHICLE CONDITION', pageWidth / 2, currentY, { align: "center" });
  
  const generalRemarksWidth = pdf.getTextWidth('GENERAL REMARKS ON VEHICLE CONDITION');
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
  pdf.setFont('times', 'normal');
  
  const vehicleYear = data.vehicle?.yearOfManufacture || '2016';
  const generalRemarksText = `According to the decoded VIN, the vehicle was manufactured in the year ${vehicleYear} prior to being imported into the country used. It has completed its first year of registration locally and was in good condition prior to the loss.`;
  
  const splitGeneralRemarks = pdf.splitTextToSize(generalRemarksText, contentWidth);
  pdf.text(splitGeneralRemarks, margin, currentY);
  currentY += splitGeneralRemarks.length * 12 + 20;

  // TYRES section
  pdf.setFont('times', 'bold');
  pdf.setFontSize(14);
  pdf.text('TYRES:', margin, currentY);
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
  pdf.setFont('times', 'bold');
  pdf.setFontSize(10);
  
  // Header row
  pdf.rect(tableStartX, tableStartY, colWidths[0], rowHeightTyre);
  pdf.rect(tableStartX + colWidths[0], tableStartY, colWidths[1], rowHeightTyre);
  pdf.rect(tableStartX + colWidths[0] + colWidths[1], tableStartY, colWidths[2], rowHeightTyre);
  pdf.rect(tableStartX + colWidths[0] + colWidths[1] + colWidths[2], tableStartY, colWidths[3], rowHeightTyre);

  // Header text - properly spaced to avoid overlap
  pdf.text('Tyre', tableStartX + 5, tableStartY + 12);
  pdf.text('Make & Size', tableStartX + colWidths[0] + 5, tableStartY + 12);
  pdf.text('Min Tread Depth', tableStartX + colWidths[0] + colWidths[1] + 5, tableStartY + 12);
  pdf.text('Condition', tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableStartY + 12);

  // Table data rows
  const tyreData = [
    ['Right Front', `${data.tyres?.rightFront.make || 'Roadstone'} ${data.tyres?.rightFront.size || '185/65R15'}`, data.tyres?.rightFront.treadDepth || '7mm', data.tyres?.rightFront.condition || 'Good'],
    ['Left Front', `${data.tyres?.leftFront.make || 'Roadstone'} ${data.tyres?.leftFront.size || '185/65R15'}`, data.tyres?.leftFront.treadDepth || '7mm', data.tyres?.leftFront.condition || 'Good'],
    ['Right Rear', `${data.tyres?.rightRear.make || 'Dunlop'} ${data.tyres?.rightRear.size || '175/65R15'}`, data.tyres?.rightRear.treadDepth || '5mm', data.tyres?.rightRear.condition || 'Good'],
    ['Left Rear', `${data.tyres?.leftRear.make || 'Dunlop'} ${data.tyres?.leftRear.size || '175/65R15'}`, data.tyres?.leftRear.treadDepth || '5mm', data.tyres?.leftRear.condition || 'Good']
  ];

  pdf.setFont('times', 'normal');
  tyreData.forEach((row, index) => {
    const y = tableStartY + rowHeightTyre + (index * rowHeightTyre);
    
    // Draw row rectangles
    pdf.rect(tableStartX, y, colWidths[0], rowHeightTyre);
    pdf.rect(tableStartX + colWidths[0], y, colWidths[1], rowHeightTyre);
    pdf.rect(tableStartX + colWidths[0] + colWidths[1], y, colWidths[2], rowHeightTyre);
    pdf.rect(tableStartX + colWidths[0] + colWidths[1] + colWidths[2], y, colWidths[3], rowHeightTyre);

    // Add text
    pdf.text(row[0], tableStartX + 5, y + 12);
    pdf.text(row[1], tableStartX + colWidths[0] + 5, y + 12);
    pdf.text(row[2], tableStartX + colWidths[0] + colWidths[1] + 5, y + 12);
    pdf.text(row[3], tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5, y + 12);
  });

  currentY = tableStartY + rowHeightTyre + (tyreData.length * rowHeightTyre) + 30;

  // Legend boxes
  pdf.setFont('times', 'bold');
  pdf.setFillColor(173, 216, 230); // Light blue
  pdf.rect(margin, currentY, 15, 15, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.text('PREVIOUS DAMAGE', margin + 20, currentY + 10);

  pdf.setFillColor(255, 182, 193); // Light red
  pdf.rect(margin, currentY + 20, 15, 15, 'F');
  pdf.text('INITIAL DAMAGE', margin + 20, currentY + 30);

  currentY += 50;

  // NATURE OF DAMAGE section
  pdf.setFont('times', 'bold');
  pdf.setFontSize(14);
  pdf.text('NATURE OF DAMAGE', pageWidth / 2, currentY, { align: "center" });
  
  const natureDamageWidth = pdf.getTextWidth('NATURE OF DAMAGE');
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
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  pdf.text('Vehicle Damage Diagram', pageWidth / 2, diagramStartY + boxHeight / 2, { align: "center" });

  currentY = diagramStartY + diagramSectionHeight - 50;

  // Damage details
  pdf.setFont("times", "bold");
pdf.setFontSize(12);
pdf.text("AFFECTED AREA:", margin, currentY);

pdf.setFont("times", "normal"); // Switch to normal font for data
pdf.text(data.damage?.affectedArea || "Left broadside", margin + 110, currentY);

currentY += 18;

pdf.setFont("times", "bold");
pdf.text("DEFORMATION SEVERITY:", margin, currentY);

pdf.setFont("times", "normal"); // Switch to normal font for data
pdf.text(data.damage?.deformationSeverity || "Major", margin + 170, currentY);

currentY += 18;

pdf.setFont("times", "bold");
pdf.text("AFFECTED STRUCTURAL COMPONENTS:", margin, currentY);

pdf.setFont("times", "normal"); // Switch to normal font for data
pdf.text(data.damage?.affectedStructuralComponents || 'Left "B" pillar and left rear wheel arch', margin + 250, currentY);

currentY += 35;

  // THE ESTIMATE section
  pdf.setFont('times', 'bold');
  pdf.setFontSize(14);
  pdf.text('THE ESTIMATE', pageWidth / 2, currentY, { align: "center" });
  
  const estimateWidth = pdf.getTextWidth('THE ESTIMATE');
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0, 0, 0); // Black color
  pdf.line(
    pageWidth / 2 - estimateWidth / 2,
    currentY + 2,
    pageWidth / 2 + estimateWidth / 2,
    currentY + 2
  );

  currentY += 22;

  pdf.setFont('times', 'bold');
  pdf.setFontSize(12);
  pdf.text('Please refer to attached estimate.', margin, currentY);

  currentY += 22;

  // Estimate details
  // ESTIMATE FROM
pdf.setFont("times", "bold");
pdf.text("ESTIMATE FROM:", margin, currentY);

pdf.setFont("times", "normal"); // Normal font for data
pdf.text(data.estimate?.from || "Aristocraft Auto Collision", margin + 110, currentY);

// DATED
pdf.setFont("times", "bold");
pdf.text("DATED:", margin + 300, currentY);

pdf.setFont("times", "normal"); // Normal font for data
pdf.text(data.estimate?.dated ? "DATED" : "NOT DATED", margin + 350, currentY);

currentY += 18;



  // Add page footer for page 2
  addPageFooter(pdf, data, 2);
  pdf.addPage();
  currentY = margin + 20;

// SECTION (A): PARTS
pdf.setFont('times', 'bold');
pdf.setFontSize(14);
pdf.text('SECTION (A): PARTS', margin, currentY);
currentY += 25;

pdf.setFont("times", "bold");
pdf.setFontSize(12);
pdf.text("Adjusted source & type of parts:", margin, currentY);
pdf.setFont("times", "normal");
pdf.text("Automix - 751-2782 Used parts", margin + 200, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.text("Excluded Items & Reason disallowed:", margin, currentY);
currentY += 18;

pdf.setFont("times", "normal");
pdf.text("• Rear bumper and left 'B' pillar- To repair", margin + 10, currentY);
currentY += 14;
pdf.text("• Left taillight and rear seat - No visible damage", margin + 10, currentY);
currentY += 14;
pdf.text("• Left kick strips and rear kick strip - For closer inspection", margin + 10, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.text("Remarks:", margin, currentY);
currentY += 16;

pdf.setFont("times", "normal");
const remarksText1 = "The estimate included provision for a rear bumper and left 'B' pillar under the heading of";
pdf.text(remarksText1, margin + 70, currentY);
currentY += 14;
const remarksText2 = "material items. The damage to these components are reparable, and were as a result";
pdf.text(remarksText2, margin + 70, currentY);
currentY += 14;
const remarksText3 = "excluded from the material items by way of adjustments.";
pdf.text(remarksText3, margin + 70, currentY);
currentY += 18;

const remarksText4 = "The left taillight and rear seat showed no signs of impact damage and were struck off";
pdf.text(remarksText4, margin + 70, currentY);
currentY += 14;
const remarksText5 = "the material section of the estimate by way of adjustments.";
pdf.text(remarksText5, margin + 70, currentY);
currentY += 18;

const remarksText6 = "The estimate included provision for the replacement of a rear kick strip and 2 left side";
pdf.text(remarksText6, margin + 70, currentY);
currentY += 14;
const remarksText7 = "kick strips under the heading of material items. No damage was visible to these";
pdf.text(remarksText7, margin + 70, currentY);
currentY += 14;
const remarksText8 = "components at the time of inspection. These components will require verification by the";
pdf.text(remarksText8, margin + 70, currentY);
currentY += 14;
const remarksText9 = "repairer after the job is opened and the findings communicated to your office following";
pdf.text(remarksText9, margin + 70, currentY);
currentY += 14;
const remarksText10 = "which the damage can be confirmed by our office. To this end the above-mentioned";
pdf.text(remarksText10, margin + 70, currentY);
currentY += 14;
const remarksText11 = "items were excluded from the material items in the interim.";
pdf.text(remarksText11, margin + 70, currentY);
currentY += 18;

const remarksText12 = "The material section of the estimate made provision for secondhand components. We";
pdf.text(remarksText12, margin + 70, currentY);
currentY += 14;
const remarksText13 = "were able to locate the required items on the market at lower prices, which are shown in";
pdf.text(remarksText13, margin + 70, currentY);
currentY += 14;
const remarksText14 = "red on the estimate.";
pdf.text(remarksText14, margin + 70, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.text("Parts Figure Quoted:", margin, currentY);
pdf.setFont("times", "normal");
pdf.text("$23,600.00", margin + 130, currentY);
pdf.setFont("times", "bold");
pdf.text("Adjusted Parts Figure:", margin + 250, currentY);
pdf.setFont("times", "normal");
pdf.text("$7,500.00", margin + 380, currentY);
currentY += 30;

// SECTION (B): LABOUR
pdf.setFont('times', 'bold');
pdf.setFontSize(14);
pdf.text('SECTION (B): LABOUR', margin, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.setFontSize(12);
pdf.text("Remarks:", margin, currentY);
currentY += 16;

pdf.setFont("times", "normal");
const labourText1 = "The labour and material figure was overstated in the amount of $14,730.00 which was";
pdf.text(labourText1, margin + 10, currentY);
currentY += 14;
const labourText2 = "adjusted downward to $7,690.00 which would be more realistic when compared to the";
pdf.text(labourText2, margin + 10, currentY);
currentY += 14;
const labourText3 = "actual man hours involved to complete the repair exercise.";
pdf.text(labourText3, margin + 10, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.text("Figure Quoted:", margin, currentY);
pdf.setFont("times", "normal");
pdf.text("$14,730.00", margin + 110, currentY);
pdf.setFont("times", "bold");
pdf.text("Adjusted Labour & Material Figure:", margin + 220, currentY);
pdf.setFont("times", "normal");
pdf.text("$7,690.00", margin + 420, currentY);
currentY += 22;

pdf.setFont("times", "normal");
pdf.text("Repairs ought to be completed in (4) working days.", margin, currentY);
currentY += 30;





// Add page footer for page 3
addPageFooter(pdf, data, 3);











  
 

  // RECOMMENDATION section
  pdf.setFont("times", "bold");
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

  currentY += 30;

  // Settlement basis
  pdf.setFontSize(12);
  pdf.text("SETTLEMENT BASIS:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(data.recommendation?.settlementBasis || "", margin + 150, currentY);

  currentY += 25;

  // Cost and value
  pdf.setFont("times", "bold");
  pdf.text("APPARENT COST OF REPAIRS:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(
    `$${data.recommendation?.apparentCostOfRepairs || "0.00"} (VAT exc.)`,
    margin + 200,
    currentY
  );

  pdf.setFont("times", "bold");
  pdf.text("PRE-ACCIDENT VALUE:", margin + 330, currentY);
  pdf.setFont("times", "normal");
  pdf.text(
    `$${data.recommendation?.preAccidentValue || "0.00"}`,
    margin + 480,
    currentY
  );

  currentY += 20;

  pdf.setFont("times", "bold");
  pdf.text("SETTLEMENT OFFER:", margin, currentY);
  pdf.setFont("times", "normal");
  pdf.text(
    `$${data.recommendation?.settlementOffer || "0.00"} (VAT exc.)`,
    margin + 150,
    currentY
  );

  pdf.setFont("times", "bold");
  pdf.text("RESERVE:", margin + 330, currentY);
  pdf.setFont("times", "normal");
  pdf.text(
    `$${data.recommendation?.reserve || "0.00"}`,
    margin + 400,
    currentY
  );

  currentY += 40;
 pdf.addPage();
  currentY = margin + 30;
  // Remarks
  pdf.setFont("times", "bold");
  pdf.text("REMARKS:", margin, currentY);
  currentY += 20;
  pdf.setFont("times", "normal");
  const remarksText =
    data.recommendation?.remarks ||
    "If you are liable, we suggest that you treat this claim on a repair or cash in lieu of repair basis.";
  const splitRemarks = pdf.splitTextToSize(remarksText, contentWidth);
  pdf.text(splitRemarks, margin, currentY);

  currentY += splitRemarks.length * 15 + 30;

  // Signature

  currentY += 40;

  pdf.setFont("times", "normal");
pdf.text("Regards,", margin, currentY);
currentY += 22;

pdf.setFont("times", "bold");
pdf.text("MR. GERAB", margin, currentY);
pdf.setFont("times", "normal");
pdf.text("Managing Director", margin + 80, currentY);
currentY += 14;
pdf.text("Diploma Investigation & Adjusting (MICIA)", margin, currentY);
currentY += 14;
pdf.text("FOR: Independent Investigation & Valuation Services Limited", margin, currentY);

  // Add page footer for page 4
  addPageFooter(pdf, data, 4);

  // PAGE5 - TAX INVOICE (Starting from line 877)
  pdf.addPage();

  const contentHeight = pageHeight * 0.8;
  
  // Colors and styles
  pdf.setDrawColor(0, 0, 0); // Black lines
  pdf.setTextColor(0, 0, 0); // Black text
  
  currentY = margin;
  const unitHeight = 10;
  
  // Header - Company Name (Centered)
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  const companyNameWidth = pdf.getTextWidth(invoiceData.company.name);
  pdf.text(invoiceData.company.name, (pageWidth - companyNameWidth) / 2, currentY + 5);
  
  // Header - Address (Centered below company name)
  currentY += unitHeight;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  const addressWidth = pdf.getTextWidth(invoiceData.company.address);
  pdf.text(invoiceData.company.address, (pageWidth - addressWidth) / 2, currentY + 5);
  
  // Tax Invoice (Right aligned below address)
  currentY += unitHeight;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  const taxInvoiceText = "TAX INVOICE";
  const taxInvoiceWidth = pdf.getTextWidth(taxInvoiceText);
  pdf.text(taxInvoiceText, pageWidth - margin - taxInvoiceWidth, currentY + 5);
  
  currentY += unitHeight + 5;
  
  // Left side layout
  let leftY = currentY;
  const leftX = margin;
  const leftWidth = pageWidth * 0.6;
  
  // Phone Number
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.rect(leftX, leftY, leftWidth, unitHeight);
  pdf.text(`Phone: ${invoiceData.company.phone}`, leftX + 2, leftY + 6);
  leftY += unitHeight;
  
  // Email
  pdf.rect(leftX, leftY, leftWidth, unitHeight);
  pdf.text(`Email: ${invoiceData.company.email}`, leftX + 2, leftY + 6);
  leftY += unitHeight;
  
  // Empty Space
  doc.rect(leftX, leftY, leftWidth, unitHeight);
  leftY += unitHeight;
  
  // Bill To
  pdf.rect(leftX, leftY, leftWidth, unitHeight);
  pdf.setFont(undefined, 'bold');
  pdf.text("BILL TO:", leftX + 2, leftY + 6);
  leftY += unitHeight;
  
  // Address (Height increased for readability - 30 units = 3 * unitHeight)
  const addressHeight = unitHeight * 3;
  pdf.rect(leftX, leftY, leftWidth, addressHeight);
  pdf.setFont(undefined, 'normal');
  pdf.text(invoiceData.billTo.name, leftX + 2, leftY + 8);
  const addressLines = invoiceData.billTo.address.split('\n');
  addressLines.forEach((line, index) => {
    pdf.text(line, leftX + 2, leftY + 18 + (index * 7));
  });
  leftY += addressHeight;
  
  // Empty Space (5 units = 0.5 * unitHeight)
  const smallSpaceHeight = unitHeight * 0.5;
  pdf.rect(leftX, leftY, leftWidth, smallSpaceHeight);
  leftY += smallSpaceHeight;
  
  // Reference & Claim Details Section
  const refSectionHeight = unitHeight * 2;
  pdf.rect(leftX, leftY, leftWidth, refSectionHeight);
  
  // Reference details with proper width distribution
  const ourRefWidth = leftWidth * 0.18;
  const yourRefWidth = leftWidth * 0.18;
  const claimTechWidth = leftWidth * 0.18;
  const spaceWidth = leftWidth * 0.05;
  const dateOfLossWidth = leftWidth * 0.15;
  const adjusterWidth = leftWidth * 0.15;
  
  let refX = leftX + 2;
  pdf.setFontSize(8);
  pdf.text("Our Ref:", refX, leftY + 6);
  pdf.text(invoiceData.reference.our, refX, leftY + 12);
  
  refX += ourRefWidth;
  pdf.text("Your Reference:", refX, leftY + 6);
  pdf.text(invoiceData.reference.your, refX, leftY + 12);
  
  refX += yourRefWidth;
  pdf.text("Claim Technician:", refX, leftY + 6);
  pdf.text(invoiceData.reference.claimsTechnician, refX, leftY + 12);
  
  refX += claimTechWidth + spaceWidth;
  pdf.text("Date of Loss:", refX, leftY + 6);
  pdf.text(invoiceData.reference.dateOfLoss, refX, leftY + 12);
  
  refX += dateOfLossWidth;
  pdf.text("Adjuster:", refX, leftY + 6);
  pdf.text(invoiceData.reference.adjuster, refX, leftY + 12);
  
  leftY += refSectionHeight;
  
  // Billing & Parties Section
  const partiesSectionHeight = unitHeight * 1.5;
  pdf.rect(leftX, leftY, leftWidth, partiesSectionHeight);
  
  const partyWidth = leftWidth / 3;
  pdf.setFontSize(8);
  
  // Bill To / Insured / Third Party (33% width each)
  pdf.text("Bill To:", leftX + 2, leftY + 6);
  pdf.text(invoiceData.billTo.name, leftX + 2, leftY + 12);
  
  pdf.text("Insured:", leftX + partyWidth, leftY + 6);
  pdf.text(invoiceData.insured.name, leftX + partyWidth, leftY + 12);
  
  pdf.text("Third Party:", leftX + (partyWidth * 2), leftY + 6);
  pdf.text(invoiceData.thirdParty.name, leftX + (partyWidth * 2), leftY + 12);
  
  leftY += partiesSectionHeight;
  
  // Vehicle details
  pdf.rect(leftX, leftY, leftWidth, unitHeight);
  pdf.text("Vehicle:", leftX + 2, leftY + 6);
  pdf.text(invoiceData.insured.vehicleType, leftX + partyWidth, leftY + 6);
  pdf.text(invoiceData.thirdParty.vehicle, leftX + (partyWidth * 2), leftY + 6);
  leftY += unitHeight;
  
  // Itemized Table
  const tableY = leftY + 5;
  const tableHeight = unitHeight * 3;
  pdf.rect(leftX, tableY, leftWidth, tableHeight);
  
  // Table headers with specified column distribution
  const itemColWidth = leftWidth * 0.2;
  const descColWidth = leftWidth * 0.4;
  const qtyColWidth = leftWidth * 0.1;
  const rateColWidth = leftWidth * 0.15;
  const amountColWidth = leftWidth * 0.15;
  
  let tableX = leftX;
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(9);
  
  // Table header
  pdf.text("Item", tableX + 2, tableY + 8);
  tableX += itemColWidth;
  pdf.text("Description", tableX + 2, tableY + 8);
  tableX += descColWidth;
  pdf.text("Qty", tableX + 2, tableY + 8);
  tableX += qtyColWidth;
  pdf.text("Rate", tableX + 2, tableY + 8);
  tableX += rateColWidth;
  pdf.text("Amount", tableX + 2, tableY + 8);
  
  // Table content
  pdf.setFont(undefined, 'normal');
  tableX = leftX;
  const item = invoiceData.items[0];
  pdf.text(item.code, tableX + 2, tableY + 18);
  tableX += itemColWidth;
  pdf.text(item.description, tableX + 2, tableY + 18);
  tableX += descColWidth;
  pdf.text(item.qty.toString(), tableX + 2, tableY + 18);
  tableX += qtyColWidth;
  pdf.text(`$${item.rate.toFixed(2)}`, tableX + 2, tableY + 18);
  tableX += rateColWidth;
  pdf.text(`$${item.amount.toFixed(2)}`, tableX + 2, tableY + 18);
  
  leftY = tableY + tableHeight;
  
  // Empty Space for Stamp (5 units = 0.5 * unitHeight)
  leftY += smallSpaceHeight;
  pdf.rect(leftX, leftY, leftWidth, unitHeight * 2);
  pdf.text("Space for Stamp/Signature", leftX + 2, leftY + 10);
  leftY += unitHeight * 2;
  
  // Final Phrase (aligned at 50% of page width)
  const finalPhraseY = leftY + 10;
  const finalPhraseText = "Please make all cheques payable to Independent Claims Adjusting & Valuation Services Limited";
  const finalPhraseX = pageWidth * 0.25; // Start at 25% to center the text block
  pdf.setFontSize(8);
  pdf.text(finalPhraseText, finalPhraseX, finalPhraseY, { maxWidth: pageWidth * 0.5 });
  
  // Right Side Layout - Financial Summary (50% width each, next to signature section)
  const rightX = leftX + leftWidth + 10;
  const rightWidth = pageWidth - rightX - margin;
  const financialY = tableY + tableHeight - unitHeight * 2;
  
  const labelWidth = rightWidth * 0.5;
  const valueWidth = rightWidth * 0.5;
  
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(10);
  
  // Sub Total
  pdf.rect(rightX, financialY, rightWidth, unitHeight);
  pdf.text("Sub Total:", rightX + 2, financialY + 6);
  pdf.text(`$${invoiceData.financial.subtotal.toFixed(2)}`, rightX + labelWidth + 2, financialY + 6);
  
  // VAT
  pdf.rect(rightX, financialY + unitHeight, rightWidth, unitHeight);
  pdf.text(`VAT (${invoiceData.financial.vatRate}%):`, rightX + 2, financialY + unitHeight + 6);
  pdf.text(`$${invoiceData.financial.vatAmount.toFixed(2)}`, rightX + labelWidth + 2, financialY + unitHeight + 6);
  
  // Total
  pdf.rect(rightX, financialY + (unitHeight * 2), rightWidth, unitHeight);
  pdf.text("Total:", rightX + 2, financialY + (unitHeight * 2) + 6);
  pdf.text(`$${invoiceData.financial.total.toFixed(2)}`, rightX + labelWidth + 2, financialY + (unitHeight * 2) + 6);
  
  // Payments
  pdf.rect(rightX, financialY + (unitHeight * 3), rightWidth, unitHeight);
  pdf.text("Payments/Credits:", rightX + 2, financialY + (unitHeight * 3) + 6);
  pdf.text(`$${invoiceData.financial.paymentsCredits.toFixed(2)}`, rightX + labelWidth + 2, financialY + (unitHeight * 3) + 6);
  
  // Balance Due
  pdf.rect(rightX, financialY + (unitHeight * 4), rightWidth, unitHeight);
  pdf.setFont(undefined, 'bold');
  pdf.text("Balance Due:", rightX + 2, financialY + (unitHeight * 4) + 6);
  pdf.text(`$${invoiceData.financial.balanceDue.toFixed(2)}`, rightX + labelWidth + 2, financialY + (unitHeight * 4) + 6);
  
  // Invoice details in top right
  const invoiceDetailsY = currentY;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Invoice #: ${invoiceData.invoice.number}`, rightX, invoiceDetailsY);
  pdf.text(`Date: ${invoiceData.invoice.date}`, rightX, invoiceDetailsY + 10);
  pdf.text(`VAT Reg #: ${invoiceData.company.vatRegistration}`, rightX, invoiceDetailsY + 20);
  






  
  
  // Add page footer for page 5
  addPageFooter(pdf, data, 5);

  return pdf;
};