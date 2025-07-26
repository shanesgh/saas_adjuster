import jsPDF from "jspdf";
import { invoiceData } from "@/types/companies/icavs/form";

export const addInvoice = (
  pdf: jsPDF,
  currentY: number,
  contentWidth: number,
  pageHeight: number,
  pageWidth: number,
  margin: number
) => {
  // GLOBAL SCALE VARIABLE - Change this to scale everything
  const SCALE = 1.0; // Set to 0.9 for 90%, 0.8 for 80%, etc.

  pdf.setLineWidth(0.3);

  // Colors and font setup
  pdf.setDrawColor(0, 0, 0);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");

  // HEADER SECTION
  // Company Name (Center-aligned)
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  const companyName = invoiceData.company.name;
  const companyNameWidth = pdf.getTextWidth(companyName);
  pdf.text(companyName, (pageWidth - companyNameWidth) / 2, currentY);
  currentY += pageHeight * 0.04 * SCALE;

  // Address (Center-aligned)
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  const address = invoiceData.company.address;
  const addressWidth = pdf.getTextWidth(address);
  pdf.text(address, (pageWidth - addressWidth) / 2, currentY);
  currentY += pageHeight * 0.01 * SCALE;

  // TAX INVOICE (Right-aligned below address)
  pdf.setFont("helvetica", "bold");

  pdf.setFontSize(18 * SCALE);
  pdf.setFont("helvetica", "bold");
  const taxInvoiceText = "TAX INVOICE";
  const taxInvoiceWidth = pdf.getTextWidth(taxInvoiceText);
  pdf.setFont("helvetica", "normal");
  pdf.text(taxInvoiceText, pageWidth - margin - taxInvoiceWidth, currentY);
  currentY += 10 * SCALE;

  // V.A.T. Registration Number Box (Right-aligned)
  const vatBoxHeight = pageHeight * 0.025 * SCALE;
  const vatBoxWidth = pageWidth * 0.25 * SCALE;
  const vatBoxX = pageWidth - margin - vatBoxWidth;
  pdf.rect(vatBoxX, currentY, vatBoxWidth, vatBoxHeight);
  pdf.setFontSize(9 * SCALE);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `VAT Reg #: ${invoiceData.company.vatRegistration}`,
    vatBoxX + vatBoxWidth / 4,
    currentY + vatBoxHeight * 0.7
  );
  currentY += vatBoxHeight + 10 * SCALE;

  // INVOICE DETAILS SECTION
  // Date and Invoice Number (side by side with proper spacing)
  const detailBoxHeight = pageHeight * 0.03 * SCALE;
  const detailBoxWidth = pageWidth * 0.16 * SCALE;

  const dateBoxX = pageWidth - margin - 2 * detailBoxWidth;
  const invoiceBoxX = dateBoxX + detailBoxWidth;

  // Phone number box (left of Date box)
  const phoneBoxX = margin;
  pdf.rect(
    phoneBoxX,
    currentY - 20 * SCALE,
    detailBoxWidth * 0.8,
    detailBoxHeight
  );
  pdf.rect(
    phoneBoxX + detailBoxWidth * 0.8,
    currentY - 20 * SCALE,
    detailBoxWidth,
    detailBoxHeight
  );

  pdf.text(
    "Phone #:",
    phoneBoxX + 3,
    currentY - 20 * SCALE + detailBoxHeight * 0.6
  );
  pdf.text(
    "1 (868) 235-5069",
    phoneBoxX + detailBoxWidth * 0.8 + 3,
    currentY - 20 * SCALE + detailBoxHeight * 0.6
  );

  // Email box (directly below Phone, NO spacing)
  pdf.rect(
    phoneBoxX,
    currentY - 20 * SCALE + detailBoxHeight,
    detailBoxWidth * 0.8,
    detailBoxHeight
  );
  pdf.rect(
    phoneBoxX + detailBoxWidth * 0.8,
    currentY - 20 * SCALE + detailBoxHeight,
    detailBoxWidth * 1.5,
    detailBoxHeight
  );

  pdf.text(
    "Email:",
    phoneBoxX + 3,
    currentY - 20 * SCALE + detailBoxHeight * 1.6
  );
  pdf.text(
    "icavslimited.com",
    phoneBoxX + detailBoxWidth * 0.8 + 3,
    currentY - 20 * SCALE + detailBoxHeight * 1.6
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

  currentY += detailBoxHeight + 35 * SCALE;

  // BILLING INFORMATION SECTION
  const billingHeaderHeight = pageHeight * 0.03 * SCALE;
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
  const addressBoxHeight = pageHeight * 0.12 * SCALE;
  pdf.setFont("helvetica", "normal");
  pdf.rect(margin, currentY, thirdWidth, addressBoxHeight);
  pdf.text(invoiceData.billTo.name, margin + 3, currentY + 12 * SCALE);
  const addressLines = invoiceData.billTo.address.split("\n");
  addressLines.forEach((line, index) => {
    pdf.text(line, margin + 3, currentY + 22 * SCALE + index * 10 * SCALE);
  });

  // Insured Details box
  pdf.rect(margin + thirdWidth, currentY, thirdWidth, addressBoxHeight);
  pdf.text(
    invoiceData.insured.name,
    margin + thirdWidth + 3,
    currentY + 12 * SCALE
  );
  pdf.text(
    invoiceData.insured.vehicleType,
    margin + thirdWidth + 3,
    currentY + 25 * SCALE
  );

  // Third Party boxes (three separate boxes with readable height)
  const smallBoxHeight = pageHeight * 0.04 * SCALE;
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

  currentY += addressBoxHeight + 10 * SCALE;

  // REFERENCE SECTION
  const refBoxHeight = pageHeight * 0.03 * SCALE;
  const refTotalWidth = pageWidth * 0.6 * SCALE;
  const ourRefWidth = refTotalWidth * 0.44;
  const yourRefWidth = refTotalWidth * 0.31;
  const claimsTechWidth = refTotalWidth * 0.25;
  const adjusterWidth = pageWidth * 0.1 * SCALE;
  const dateLossWidth = adjusterWidth;

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
  const rightX = pageWidth - margin - 2 * dateLossWidth;

  // Date of Loss
  pdf.rect(rightX - 30 * SCALE, currentY, dateLossWidth, refBoxHeight);
  pdf.text("Date of Loss:", rightX - 27 * SCALE, currentY + refBoxHeight * 0.6);
  pdf.rect(
    rightX - 30 * SCALE,
    currentY + refBoxHeight,
    dateLossWidth,
    refBoxHeight
  );
  pdf.text(
    invoiceData.reference.dateOfLoss,
    rightX - 27 * SCALE,
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

  currentY += 2 * refBoxHeight + pageHeight * 0.01 * SCALE;

  // ITEMIZED CHARGES TABLE
  const tableHeaderHeight = pageHeight * 0.03 * SCALE;
  const tableContentHeight = pageHeight * 0.135 * SCALE;

  // Column widths based on specifications
  const itemColWidth = pageWidth * 0.18 * SCALE;
  const qtyRateAmountWidth = pageWidth * 0.25 * SCALE;
  const qtyWidth = qtyRateAmountWidth * 0.2;
  const rateWidth = qtyRateAmountWidth * 0.4;
  const amountWidth = qtyRateAmountWidth * 0.4;
  const descWidth = contentWidth - itemColWidth - qtyRateAmountWidth;

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
    pdf.text(item.code, tableX + 3, currentY + 15 * SCALE);

    tableX += itemColWidth;
    pdf.text(item.description, tableX + 3, currentY + 15 * SCALE, {
      maxWidth: descWidth - 6,
    });

    tableX += descWidth;
    pdf.text(item.qty.toString(), tableX + 3, currentY + 15 * SCALE);

    tableX += qtyWidth;
    pdf.text(`$${item.rate.toFixed(2)}`, tableX + 3, currentY + 15 * SCALE);

    tableX += rateWidth;
    pdf.text(`$${item.amount.toFixed(2)}`, tableX + 3, currentY + 15 * SCALE);
  }

  currentY += tableContentHeight;

  // FINANCIAL SUMMARY (Right half of page)
  const financialBoxHeight = pageHeight * 0.035 * SCALE;
  const financialBoxWidth = contentWidth * 0.45 * SCALE;
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

  currentY += 5 * financialBoxHeight + pageHeight * 0.02 * SCALE;

  // PAYMENT INSTRUCTIONS
  const paymentInstructionHeight = pageHeight * 0.04 * SCALE;
  const paymentInstructionWidth = contentWidth * 0.55 * SCALE;

  pdf.rect(margin, currentY, paymentInstructionWidth, paymentInstructionHeight);
  pdf.setFont("helvetica", "normal");
  const paymentText = "Please make all cheques payable to ICAVS Limited";
  pdf.text(paymentText, margin + 3, currentY + 19, {
    maxWidth: paymentInstructionWidth - 6,
  });
};
