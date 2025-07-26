//remarks to change back to data
//make reponsive height
import jsPDF from "jspdf";
import { ClaimsFormData } from "../../../../types/companies/icavs/form";
import { addHeaderDetails } from "./AddHeaderInfo";
import { addRecipientInfo } from "./AddRecipientInfo";
import { addVehicleDetails } from "./AddVehicleInfo";
import { addConditionDetails } from "./AddConditionDetails";
import { addPageFooter } from "./AddPageFooter";
import { addGeneralRemarks } from "./AddGeneralRemarks";
import { addTyresSection } from "./AddTyresInfo";
import { addNatureDamage } from "./AddNatureDamageInfo";
import { addEstimateInformation } from "./AddEstimateInfo";
import { addSectionAParts } from "./AddSectionAParts";
import { addSectionBLabour } from "./AddSectionBLabour";
import { addRecommendation } from "./AddRecommendation";
import { addRemarks } from "./AddRemarks";
import { addSignature } from "./AddSignature";
import { addInvoice } from "./AddInvoice";

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

const generatePdfDocument = async (
  data: Partial<ClaimsFormData>
): Promise<jsPDF> => {
  // Create a new PDF document
  const pdf = new jsPDF("p", "pt", "letter");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin + 250;

  ///////// PAGE 1 ///////////

  // Company Header section
  addHeaderDetails(pdf, data, pageWidth, margin);

  // Recipient Information section
  addRecipientInfo(pdf, data, pageWidth, pageHeight, margin);

  //Vehicle information Sections
  currentY = addVehicleDetails(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );

  // //Condition prior to loss section
  addConditionDetails(pdf, data, currentY, pageWidth, pageHeight, margin);

  addPageFooter(pdf, data, 1);

  ///////// PAGE 2 ///////////
  pdf.addPage();
  currentY = margin;

  //General remarks section
  currentY = addGeneralRemarks(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );
  currentY += 10;

  // Tyres section
  currentY = addTyresSection(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );

  currentY += 40;

  currentY = addNatureDamage(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );

  currentY += 10;

  addEstimateInformation(pdf, data, currentY, pageWidth, pageHeight, margin);

  // Add page footer for page 2
  addPageFooter(pdf, data, 2);

  ///////// PAGE 3 ///////////
  pdf.addPage();
  currentY = margin;

  // SECTION (A): PARTS
  currentY = addSectionAParts(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );

  // SECTION (B): LABOUR
  currentY = addSectionBLabour(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );

  currentY += 45;

  // RECOMMENDATION section
  currentY = addRecommendation(
    pdf,
    data,
    currentY,
    pageWidth,
    pageHeight,
    margin
  );
  // Add page footer for page 3
  addPageFooter(pdf, data, 3);

  ///////// PAGE 4 ///////////

  pdf.addPage();
  currentY = margin;
  // Remarks
  currentY = addRemarks(pdf, data, currentY, pageWidth, pageHeight, margin);

  // Signature

  currentY += 40;

  addSignature(pdf, data, currentY, pageHeight, margin);

  // Add page footer for page 4
  addPageFooter(pdf, data, 4);

  ///////// PAGE 5 ///////////
  pdf.addPage();

  currentY = margin;

  addInvoice(pdf, currentY, contentWidth, pageHeight, pageWidth, margin);

  addPageFooter(pdf, data, 5);

  return pdf;
};
