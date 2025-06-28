// import jsPDF from "jspdf";
// import { ClaimsFormData } from "../types/form";
// import { addVehicleDetails } from "../components/PDF/AddVehicleInfo";
// import { addHeaderDetails } from "../components/PDF/AddHeaderInfo";
// import { addRecipientInfo } from "../components/PDF/AddRecipientInfo";
// import { addConditionDetails } from "../components/PDF/AddConditionDetails";
// import { addPageFooter } from "./addPageFooter";
// import { addGeneralRemarks } from "../components/PDF/AddGeneralRemarks";
// import { addTyresSection } from "../components/PDF/AddTyresInfo";
// import { addNatureDamage } from "../components/PDF/AddNatureDamageInfo";
// import { addEstimateInformation } from "../components/PDF/AddEstimateInfo";
// import { addSectionAParts } from "../components/PDF/addSectionAParts";
// import { addSectionBLabour } from "../components/PDF/addSectionBLabour";
// import { addRecommendation } from "../components/PDF/AddRecommendation";
// import { addRemarks } from "../components/PDF/addRemarks";
// import { addSignature } from "../components/PDF/AddSignature";
// import { addInvoice } from "../components/PDF/AddInvoice";

// // Constants
// const PDF_CONFIG = {
//   FORMAT: "letter" as const,
//   ORIENTATION: "p" as const,
//   UNITS: "pt" as const,
//   MARGIN: 40,
//   HEADER_OFFSET: 250,
//   SMALL_SPACING: 10,
//   MEDIUM_SPACING: 40,
//   LARGE_SPACING: 45,
// } as const;

// interface PdfGenerationError extends Error {
//   code: string;
//   context?: unknown;
// }

// /**
//  * Generates a PDF preview as a Blob for display purposes
//  */
// export const generatePdfPreview = async (
//   data: Partial<ClaimsFormData>
// ): Promise<Blob> => {
//   try {
//     const pdf = await generatePdfDocument(data);
//     return pdf.output("blob");
//   } catch (error) {
//     throw createPdfError("Failed to generate PDF preview", "PREVIEW_ERROR", error);
//   }
// };

// /**
//  * Generates and saves a PDF document
//  */
// export const generatePdf = async (
//   data: Partial<ClaimsFormData>
// ): Promise<void> => {
//   try {
//     validateFormData(data);
//     const pdf = await generatePdfDocument(data);
//     const fileName = generateFileName(data);
//     pdf.save(fileName);
//   } catch (error) {
//     throw createPdfError("Failed to generate PDF", "GENERATION_ERROR", error);
//   }
// };

// /**
//  * Creates a standardized PDF error
//  */
// const createPdfError = (message: string, code: string, originalError?: unknown): PdfGenerationError => {
//   const error = new Error(message) as PdfGenerationError;
//   error.code = code;
//   error.context = originalError;
//   return error;
// };

// /**
//  * Validates essential form data before PDF generation
//  */
// const validateFormData = (data: Partial<ClaimsFormData>): void => {
//   if (!data) {
//     throw createPdfError("Form data is required", "VALIDATION_ERROR");
//   }

//   // Add specific validation rules as needed
//   if (!data.vehicle?.registration && !data.ourRef) {
//     throw createPdfError("Either vehicle registration or reference number is required", "VALIDATION_ERROR");
//   }
// };

// /**
//  * Generates a standardized filename for the PDF
//  */
// const generateFileName = (data: Partial<ClaimsFormData>): string => {
//   const registration = data.vehicle?.registration || "New";
//   const reference = data.ourRef || "";
//   const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

//   return `ICAVS_Report_${registration}_${reference}_${timestamp}.pdf`;
// };

// /**
//  * Adds a new page and footer, returns reset Y position
//  */
// const addNewPageWithFooter = (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageNumber: number
// ): number => {
//   pdf.addPage();
//   addPageFooter(pdf, data, pageNumber);
//   return PDF_CONFIG.MARGIN;
// };

// /**
//  * Main PDF document generation function
//  */
// const generatePdfDocument = async (
//   data: Partial<ClaimsFormData>
// ): Promise<jsPDF> => {
//   try {
//     const pdf = new jsPDF(
//       PDF_CONFIG.ORIENTATION,
//       PDF_CONFIG.UNITS,
//       PDF_CONFIG.FORMAT
//     );

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const contentWidth = pageWidth - PDF_CONFIG.MARGIN * 2;

//     // Generate each page
//     await generatePage1(pdf, data, pageWidth, pageHeight);
//     await generatePage2(pdf, data, pageWidth, pageHeight);
//     await generatePage3(pdf, data, pageWidth, pageHeight);
//     await generatePage4(pdf, data, pageWidth, pageHeight);
//     await generatePage5(pdf, data, pageWidth, pageHeight, contentWidth);

//     return pdf;
//   } catch (error) {
//     throw createPdfError("Failed to create PDF document", "DOCUMENT_ERROR", error);
//   }
// };

// /**
//  * Generates Page 1: Header, Recipient, Vehicle, and Condition information
//  */
// const generatePage1 = async (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageWidth: number,
//   pageHeight: number
// ): Promise<void> => {
//   let currentY = PDF_CONFIG.MARGIN + PDF_CONFIG.HEADER_OFFSET;

//   // Add sections in order
//   addHeaderDetails(pdf, data, pageWidth, PDF_CONFIG.MARGIN);
//   addRecipientInfo(pdf, data, pageWidth, pageHeight, PDF_CONFIG.MARGIN);

//   currentY = addVehicleDetails(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );

//   addConditionDetails(pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN);
//   addPageFooter(pdf, data, 1);
// };

// /**
//  * Generates Page 2: General remarks, Tyres, Nature of damage, and Estimate
//  */
// const generatePage2 = async (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageWidth: number,
//   pageHeight: number
// ): Promise<void> => {
//   let currentY = addNewPageWithFooter(pdf, data, 2);

//   currentY = addGeneralRemarks(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );
//   currentY += PDF_CONFIG.SMALL_SPACING;

//   currentY = addTyresSection(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );
//   currentY += PDF_CONFIG.MEDIUM_SPACING;

//   currentY = addNatureDamage(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );
//   currentY += PDF_CONFIG.SMALL_SPACING;

//   addEstimateInformation(pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN);
// };

// /**
//  * Generates Page 3: Parts, Labour, and Recommendations
//  */
// const generatePage3 = async (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageWidth: number,
//   pageHeight: number
// ): Promise<void> => {
//   let currentY = addNewPageWithFooter(pdf, data, 3);

//   currentY = addSectionAParts(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );

//   currentY = addSectionBLabour(
//     pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN
//   );
//   currentY += PDF_CONFIG.LARGE_SPACING;

//   addRecommendation(pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN);
// };

// /**
//  * Generates Page 4: Remarks and Signature
//  */
// const generatePage4 = async (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageWidth: number,
//   pageHeight: number
// ): Promise<void> => {
//   let currentY = addNewPageWithFooter(pdf, data, 4);

//   currentY = addRemarks(pdf, data, currentY, pageWidth, pageHeight, PDF_CONFIG.MARGIN);
//   currentY += PDF_CONFIG.MEDIUM_SPACING;

//   addSignature(pdf, data, currentY, pageHeight, PDF_CONFIG.MARGIN);
// };

// /**
//  * Generates Page 5: Invoice
//  */
// const generatePage5 = async (
//   pdf: jsPDF,
//   data: Partial<ClaimsFormData>,
//   pageWidth: number,
//   pageHeight: number,
//   contentWidth: number
// ): Promise<void> => {
//   const currentY = addNewPageWithFooter(pdf, data, 5);

//   addInvoice(
//     pdf, data, currentY, contentWidth, pageHeight, pageWidth, PDF_CONFIG.MARGIN
//   );
// };

//remarks to chang eback to data
//make reponsive height
import jsPDF from "jspdf";
import { ClaimsFormData } from "../types/form";
import { addVehicleDetails } from "../components/PDF/AddVehicleInfo";
import { addHeaderDetails } from "../components/PDF/AddHeaderInfo";
import { addRecipientInfo } from "../components/PDF/AddRecipientInfo";
import { addConditionDetails } from "../components/PDF/AddConditionDetails";
import { addPageFooter } from "./addPageFooter";
import { addGeneralRemarks } from "../components/PDF/AddGeneralRemarks";
import { addTyresSection } from "../components/PDF/AddTyresInfo";
import { addNatureDamage } from "../components/PDF/AddNatureDamageInfo";
import { addEstimateInformation } from "../components/PDF/AddEstimateInfo";
import { addSectionAParts } from "../components/PDF/addSectionAParts";
import { addSectionBLabour } from "../components/PDF/addSectionBLabour";
import { addRecommendation } from "../components/PDF/AddRecommendation";
import { addRemarks } from "../components/PDF/addRemarks";
import { addSignature } from "../components/PDF/AddSignature";
import { addInvoice } from "../components/PDF/AddInvoice";

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

  addInvoice(pdf, data, currentY, contentWidth, pageHeight, pageWidth, margin);

  addPageFooter(pdf, data, 5);

  return pdf;
};
