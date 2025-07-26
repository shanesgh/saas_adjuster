import React, { useState, useEffect } from "react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { FormNavigation } from "../navigation/FormNavigation";
import { EstimateSourceSection } from "./EstimateSourceSection";
import { PartsSection } from "./PartsSection";
import { LabourSection } from "./LabourSection";
import { NotesTextbox } from "../../../shared/NotesTextbox";

// Types
interface PartsSourceOption {
  value: string;
  label: string;
}

interface ExclusionReasonOption {
  value: string;
  label: string;
}

interface ExcludedItem {
  partName: string;
  reason: string;
  customReason?: string;
}

interface LabourCategoryData {
  originalFigure: string;
  adjustedFigure: string;
  personName: string;
  companyLocation: string;
  agreedFigure: string;
  labourFigure: string;
}

interface EstimateData {
  from: string;
  dated: boolean;
  invoiceFrom: string;
  invoiceDated: string;
  adjustedSource: string;
  excludedItems: string;
  partsRemarks: string;
  partsQuotedFigure: number;
  partsAdjustedFigure: number;
  labourRemarks: string;
  labourQuotedFigure: number;
  labourAdjustedFigure: number;
  completionDays: number;
  estimateDate: string;
}

// Constants
const PARTS_SOURCE_OPTIONS: PartsSourceOption[] = [
  { value: "franchise", label: "Franchise Parts" },
  { value: "used", label: "Used parts" },
  { value: "oem", label: "O.E.M." },
  { value: "aftermarket", label: "Aftermarket parts" },
  { value: "custom-built", label: "Custom Built aftermarket" },
  { value: "reconditioned", label: "Reconditioned parts" },
  { value: "mixed", label: "Mixed (O.E.M. & Used)" },
  { value: "custom", label: "Custom Entry" },
];

const EXCLUSION_REASON_OPTIONS: ExclusionReasonOption[] = [
  { value: "to-repair", label: "To repair" },
  { value: "no-visible-damage", label: "No visible damage" },
  { value: "closer-inspection", label: "For closer inspection" },
  { value: "not-consistent", label: "Not consistent" },
  { value: "reusable", label: "Reusable" },
  { value: "salvageable", label: "Salvageable Value" },
  { value: "age-contribution", label: "Age-Related Contribution" },
  { value: "lower-price", label: "Lower Price Parts Found" },
  { value: "total-loss", label: "Constructive Total Loss" },
  {
    value: "no-contribution",
    label: "No Contribution Applied + Unseen Damage Warning",
  },
  { value: "no-contribution-applied", label: "No Contribution Applied" },
  { value: "custom", label: "Custom Reason" },
];

const LABOUR_CATEGORY_OPTIONS: PartsSourceOption[] = [
  { value: "", label: "Select labour category..." },
  { value: "overstated", label: "Overstated - Adjusted Downward" },
  { value: "negotiated", label: "Negotiated with Repairer" },
  { value: "reasonable", label: "Reasonable - Should be Allowed" },
  { value: "estimated", label: "Estimated Labour Figure" },
  { value: "exceeds", label: "Labour Figure Exceeds Amount" },
];

export const EstimateForm: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useForm();

  // Initialize estimate data
  const [estimateData, setEstimateData] = useState<EstimateData>({
    from: formData.estimate?.from || "",
    dated: formData.estimate?.dated || false,
    invoiceFrom: formData.estimate?.invoiceFrom || "",
    invoiceDated: formData.estimate?.invoiceDated || "",
    adjustedSource: formData.estimate?.parts?.adjustedSource || "",
    excludedItems: formData.estimate?.parts?.excludedItems?.join("\n") || "",
    partsRemarks: formData.estimate?.parts?.remarks || "",
    partsQuotedFigure: formData.estimate?.parts?.quotedFigure || 0,
    partsAdjustedFigure: formData.estimate?.parts?.adjustedFigure || 0,
    labourRemarks: formData.estimate?.labour?.remarks || "",
    labourQuotedFigure: formData.estimate?.labour?.quotedFigure || 0,
    labourAdjustedFigure: formData.estimate?.labour?.adjustedFigure || 0,
    completionDays: formData.estimate?.completionDays || 0,
    estimateDate: formData.estimate?.estimateDate || "",
  });

  // Parts source state
  const [reportedSource, setReportedSource] = useState<string>("");
  const [adjusterSource, setAdjusterSource] = useState<string>("");
  const [adjusterSourceSupplier, setAdjusterSourceSupplier] =
    useState<string>("");
  const [adjusterSourceCustom, setAdjusterSourceCustom] = useState<string>("");

  // Excluded items state
  const [excludedItemsList, setExcludedItemsList] = useState<ExcludedItem[]>(
    []
  );

  // Trade discount and contribution state

  const [tradeDiscountPercentage, setTradeDiscountPercentage] =
    useState<string>("");
  const [contributionPercentage, setContributionPercentage] =
    useState<string>("");

  // Labour category state
  const [selectedLabourCategory, setSelectedLabourCategory] =
    useState<string>("");
  const [labourCategoryData, setLabourCategoryData] =
    useState<LabourCategoryData>({
      originalFigure: "",
      adjustedFigure: "",
      personName: "",
      companyLocation: "",
      agreedFigure: "",
      labourFigure: "",
    });

  // Helper function to generate parts source text
  const generatePartsSourceText = (
    sourceType: string,
    supplier: string,
    custom: string
  ): string => {
    if (sourceType === "custom") return custom;
    if (!supplier) {
      return (
        PARTS_SOURCE_OPTIONS.find((opt) => opt.value === sourceType)?.label ||
        ""
      );
    }

    const sourceMap: Record<string, (supplier: string) => string> = {
      franchise: (s) => `Franchise Parts – ${s}`,
      used: (s) => `${s} – Used parts`,
      aftermarket: (s) => `Aftermarket parts – ${s}`,
      "custom-built": (s) => `Custom Built aftermarket – ${s}`,
      reconditioned: (s) => `${s} – Reconditioned parts`,
      oem: (s) => `O.E.M. – ${s}`,
      mixed: (s) => `Mixed (O.E.M. & Used) – ${s}`,
    };

    if (sourceMap[sourceType]) {
      return sourceMap[sourceType](supplier);
    }

    const baseLabel =
      PARTS_SOURCE_OPTIONS.find((opt) => opt.value === sourceType)?.label || "";
    return supplier ? `${baseLabel} – ${supplier}` : baseLabel;
  };

  // Helper function to generate excluded items text
  const generateExcludedItemsText = (): string => {
    return excludedItemsList
      .filter((item) => item.partName.trim() !== "")
      .map((item) => {
        const reasonText =
          item.reason === "custom"
            ? item.customReason
            : EXCLUSION_REASON_OPTIONS.find((opt) => opt.value === item.reason)
                ?.label || "";
        return `${item.partName} - ${reasonText}`;
      })
      .join("\n");
  };

  // Generate remarks preview based on excluded items
  const generateRemarksPreview = (): string => {
    let preview = "";

    // Group excluded items by reason for better paragraph generation
    const groupedItems: Record<string, string[]> = {};
    excludedItemsList.forEach((item) => {
      const reasonKey = item.reason;
      if (!groupedItems[reasonKey]) {
        groupedItems[reasonKey] = [];
      }
      groupedItems[reasonKey].push(item.partName);
    });

    // Generate remarks paragraphs for each reason category
    Object.entries(groupedItems).forEach(([reason, parts]) => {
      if (!reason || parts.length === 0) return;

      const partsText =
        parts.length === 1
          ? parts[0]
          : parts.length === 2
            ? parts.join(" and ")
            : parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];

      const remarkTemplates: Record<
        string,
        (parts: string, isPlural: boolean) => string
      > = {
        "to-repair": (p, plural) =>
          `The estimate included provision for ${plural ? "" : "a "}${p} under the heading of material items. The damage to ${plural ? "these components are" : "this component is"} reparable and ${plural ? "were" : "was"} as a result excluded from the material items by way of ${plural ? "adjustments" : "an adjustment"}.\n\n`,

        "no-visible-damage": (p, plural) =>
          `The ${p} showed no signs of impact damage and ${plural ? "were" : "was"} struck off the material section of the estimate by way of adjustments.\n\n`,

        "closer-inspection": (p, plural) =>
          `The estimate included provision for the replacement of ${plural ? "" : "a "}${p} under the heading of material items. No damage was visible to ${plural ? "these components" : "this component"} at the time of inspection. ${plural ? "These components" : "This component"} will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned ${plural ? "items were" : "item was"} excluded from the material items in the interim.\n\n`,

        "not-consistent": (p) =>
          `The damage to the ${p} is not consistent with this claim and was therefore not allowed.\n\n`,

        reusable: (p, plural) =>
          `The material section of the estimate included ${plural ? "" : "a "}${p}. ${plural ? "These components are" : "This component is"} re-usable and ${plural ? "were" : "was"} excluded from the material section by way of adjustments.\n\n`,

        "lower-price": () =>
          `The material section of the estimate made provision for secondhand components. We were able to locate the required items on the market at lower prices, which are shown in red on the estimate.\n\n`,

        "total-loss": () => {
          const item = excludedItemsList.find((i) => i.reason === "total-loss");
          const company = item?.customReason || "[company name]";
          return `We were presented with a letter from ${company} which recommended that this loss be treated as a 'Constructive Total Loss.' The parts figure will be in excess of $[amount] which no doubt far exceeds an economical undertaking.\n\n`;
        },

        "no-contribution": () =>
          `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items. There is a possibility that unseen damage may come to light after the job is opened. In the event that there is unseen damage, this ought to be the subject of a supplementary estimate by a further inspection.\n\n`,

        "no-contribution-applied": () =>
          `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`,
      };

      if (reason === "salvageable") {
        parts.forEach((part) => {
          const item = excludedItemsList.find((i) => i.partName === part);
          const amount = item?.customReason || "0.00";
          preview += `The unaffected ${part} has salvageable worth which we estimate to be in the order of $${amount}. You may wish to have this item turned into your Office as a result.\n\n`;
        });
      } else if (remarkTemplates[reason]) {
        const isPlural = parts.length > 1;
        preview += remarkTemplates[reason](partsText, isPlural);
      } else if (reason === "custom") {
        const customReason = excludedItemsList.find(
          (i) => i.partName === parts[0]
        )?.customReason;
        if (customReason) {
          preview += `${partsText} - ${customReason}\n\n`;
        }
      }
    });

    // Add trade discount and contribution logic
    const hasTradeDiscount = tradeDiscountPercentage?.trim() !== "";
    const hasContribution = contributionPercentage?.trim() !== "";

    if (hasTradeDiscount && !hasContribution) {
      preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
    } else if (hasContribution) {
      preview += `On account of the age of the vehicle we applied ${contributionPercentage}% contribution towards the O.E.M. parts which has been reflected in our handwritten workings on the attached estimate.\n\n`;
    }

    if (estimateData.partsRemarks) {
      preview += `${estimateData.partsRemarks}\n\n`;
    }

    return preview.trim();
  };

  // Generate labour remarks preview
  const generateLabourRemarksPreview = (): string => {
    if (!selectedLabourCategory) return "";

    const {
      originalFigure,
      adjustedFigure,
      personName,
      companyLocation,
      agreedFigure,
      labourFigure,
    } = labourCategoryData;

    const labourTemplates: Record<string, () => string> = {
      overstated: () =>
        `The labour and material figure was overstated in the amount of $${originalFigure || "[original figure]"} which was adjusted downward to $${adjustedFigure || "[adjusted figure]"} which would be more realistic when compared to the actual man hours involved to complete the repair exercise.`,

      negotiated: () =>
        `In keeping with your instructions we have negotiated a labour figure with ${personName || "[person name]"} of ${companyLocation || "[company/location]"} and after a deliberation on the issue, a labour and material figure of $${agreedFigure || "[agreed figure]"} was mutually agreed.`,

      reasonable: () =>
        `The labour and material figure quoted is reasonable when one considers the nature of repairs and time involved to restore the vehicle to its pre-accident condition. This figure therefore should be allowed.`,

      estimated: () =>
        `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in the region of $${labourFigure || "[labour figure]"}.`,

      exceeds: () =>
        `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in excess of $${labourFigure || "[labour figure]"}.`,
    };

    return labourTemplates[selectedLabourCategory]?.() || "";
  };

  // Force update when excluded items change
  useEffect(() => {
    setEstimateData((prev) => ({
      ...prev,
      excludedItems: generateExcludedItemsText(),
    }));
  }, [excludedItemsList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    let parsedValue: string | number | boolean = value;

    if (type === "number") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else if (type === "checkbox") {
      parsedValue = checked;
    }

    setEstimateData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (): void => {
    const excludedItemsArray = estimateData.excludedItems
      .split("\n")
      .filter((item) => item.trim() !== "");

    const finalAdjustedSource = generatePartsSourceText(
      adjusterSource,
      adjusterSourceSupplier,
      adjusterSourceCustom
    );
    const finalExcludedItems = generateExcludedItemsText();

    updateFormData({
      estimate: {
        from: estimateData.from,
        dated: estimateData.dated,
        invoiceFrom: estimateData.invoiceFrom,
        invoiceDated: estimateData.invoiceDated,
        parts: {
          adjustedSource: finalAdjustedSource || estimateData.adjustedSource,
          excludedItems: finalExcludedItems
            ? finalExcludedItems.split("\n")
            : excludedItemsArray,
          remarks: estimateData.partsRemarks,
          quotedFigure: Number(estimateData.partsQuotedFigure),
          adjustedFigure: Number(estimateData.partsAdjustedFigure),
        },
        labour: {
          remarks: estimateData.labourRemarks,
          quotedFigure: Number(estimateData.labourQuotedFigure),
          adjustedFigure: Number(estimateData.labourAdjustedFigure),
        },
        completionDays: Number(estimateData.completionDays),
        estimateDate: estimateData.estimateDate,
      },
    });

    setTimeout(() => {
      goToNextStep();
    }, 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Estimate Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EstimateSourceSection
            estimateData={estimateData}
            handleChange={handleChange}
          />

          <PartsSection
            reportedSource={reportedSource}
            setReportedSource={setReportedSource}
            adjusterSource={adjusterSource}
            setAdjusterSource={setAdjusterSource}
            adjusterSourceSupplier={adjusterSourceSupplier}
            setAdjusterSourceSupplier={setAdjusterSourceSupplier}
            excludedItemsList={excludedItemsList}
            setExcludedItemsList={setExcludedItemsList}
            tradeDiscountPercentage={tradeDiscountPercentage}
            setTradeDiscountPercentage={setTradeDiscountPercentage}
            contributionPercentage={contributionPercentage}
            setContributionPercentage={setContributionPercentage}
            estimateData={estimateData}
            handleChange={handleChange}
            partsSourceOptions={PARTS_SOURCE_OPTIONS}
            exclusionReasonOptions={EXCLUSION_REASON_OPTIONS}
            generatePartsSourceText={generatePartsSourceText}
            generateExcludedItemsText={generateExcludedItemsText}
            generateRemarksPreview={generateRemarksPreview}
          />

          <LabourSection
            estimateData={estimateData}
            handleChange={handleChange}
            selectedLabourCategory={selectedLabourCategory}
            setSelectedLabourCategory={setSelectedLabourCategory}
            labourCategoryData={labourCategoryData}
            setLabourCategoryData={setLabourCategoryData}
            labourCategoryOptions={LABOUR_CATEGORY_OPTIONS}
            generateLabourRemarksPreview={generateLabourRemarksPreview}
          />

          <NotesTextbox
            section="estimate"
            placeholder="Add notes about estimate details..."
          />

          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};
