import jsPDF from "jspdf";
import { ClaimsFormData } from "@/types/companies/icavs/form";

export const addVehicleDetails = (
  pdf: jsPDF,
  data: Partial<ClaimsFormData>,
  currentY: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
) => {
  // INSURED
  pdf.setFont("helvetica", "bold");
  pdf.text("INSURED [x]:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.insured || "", margin + 80, currentY);

  // Reference information
  currentY += 28;
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

  // Fuel Type and Transmission
  pdf.setFont("helvetica", "bold");
  pdf.text("FUEL TYPE:", margin + 270, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.fuelType || "", margin + 340, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("TRANSMISSION:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.transmissionType || "", margin + 100, currentY);

  // More vehicle details
  pdf.setFont("helvetica", "bold");
  pdf.text("VEHICLE REG#:", margin + 270, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.registration || "", margin + 370, currentY);

  currentY += 18;

  pdf.setFont("helvetica", "bold");
  pdf.text("YEAR OF MANU:", margin, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.yearOfManufacture || "", margin + 120, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("COLOUR:", margin + 200, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.vehicle?.color || "", margin + 260, currentY);

  pdf.setFont("helvetica", "bold");
  pdf.text("ODOMETER:", margin + 350, currentY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    data.vehicle?.odometer ? `${data.vehicle.odometer} km` : "",
    margin + 420,
    currentY
  );

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
  return currentY;
};
