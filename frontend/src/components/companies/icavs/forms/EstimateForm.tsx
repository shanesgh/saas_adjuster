import { useState, useEffect } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { EstimateSourceSection } from './EstimateSourceSection';
import { PartsSection } from './PartsSection';
import { LabourSection } from './LabourSection';
import { NotesTextbox } from '../../../shared/NotesTextbox';

// Parts source options
const partsSourceOptions = [
  { value: 'franchise', label: 'Franchise Parts' },
  { value: 'used', label: 'Used parts' },
  { value: 'oem', label: 'O.E.M.' },
  { value: 'aftermarket', label: 'Aftermarket parts' },
  { value: 'custom-built', label: 'Custom Built aftermarket' },
  { value: 'reconditioned', label: 'Reconditioned parts' },
  { value: 'mixed', label: 'Mixed (O.E.M. & Used)' },
  { value: 'custom', label: 'Custom Entry' },
];

// Exclusion reason options
const exclusionReasonOptions = [
  { value: 'to-repair', label: 'To repair' },
  { value: 'no-visible-damage', label: 'No visible damage' },
  { value: 'closer-inspection', label: 'For closer inspection' },
  { value: 'not-consistent', label: 'Not consistent' },
  { value: 'reusable', label: 'Reusable' },
  { value: 'salvageable', label: 'Salvageable Value' },
  { value: 'age-contribution', label: 'Age-Related Contribution' },
  { value: 'lower-price', label: 'Lower Price Parts Found' },
  { value: 'total-loss', label: 'Constructive Total Loss' },
  { value: 'no-contribution', label: 'No Contribution Applied + Unseen Damage Warning' },
  { value: 'no-contribution-applied', label: 'No Contribution Applied' },
  { value: 'custom', label: 'Custom Reason' },
];

export const EstimateForm = () => {
  const { formData, updateFormData, goToNextStep } = useForm();
  const [estimateData, setEstimateData] = useState({
    from: formData.estimate?.from || '',
    dated: formData.estimate?.dated || false,
    invoiceFrom: formData.estimate?.invoiceFrom || '',
    invoiceDated: formData.estimate?.invoiceDated || '',

    adjustedSource: formData.estimate?.parts.adjustedSource || '',
    excludedItems: formData.estimate?.parts.excludedItems?.join('\n') || '',
    partsRemarks: '',
    partsQuotedFigure: formData.estimate?.parts.quotedFigure || 0,
    partsAdjustedFigure: formData.estimate?.parts.adjustedFigure || 0,

    labourRemarks: formData.estimate?.labour.remarks || '',
    labourQuotedFigure: formData.estimate?.labour.quotedFigure || 0,
    labourAdjustedFigure: formData.estimate?.labour.adjustedFigure || 0,

    completionDays: formData.estimate?.completionDays || 0,
    estimateDate: '',
  });

  // New state for dropdown functionality
  const [reportedSource, setReportedSource] = useState('');
  const [reportedSourceSupplier, setReportedSourceSupplier] = useState('');
  const [reportedSourceCustom, setReportedSourceCustom] = useState('');
  const [adjusterSource, setAdjusterSource] = useState('');
  const [adjusterSourceSupplier, setAdjusterSourceSupplier] = useState('');
  const [adjusterSourceCustom, setAdjusterSourceCustom] = useState('');
  const [excludedItemsList, setExcludedItemsList] = useState([]);

  // State for trade discount and contribution
  const [tradeDiscountList, setTradeDiscountList] = useState([]);
  const [contributionList, setContributionList] = useState([]);
  const [tradeDiscountPercentage, setTradeDiscountPercentage] = useState('');
  const [contributionPercentage, setContributionPercentage] = useState('');

  // State for labour categories
  const [selectedLabourCategory, setSelectedLabourCategory] = useState('');
  const [labourCategoryData, setLabourCategoryData] = useState({
    originalFigure: '',
    adjustedFigure: '',
    personName: '',
    companyLocation: '',
    agreedFigure: '',
    labourFigure: ''
  });

  const labourCategoryOptions = [
    { value: '', label: 'Select labour category...' },
    { value: 'overstated', label: 'Overstated - Adjusted Downward' },
    { value: 'negotiated', label: 'Negotiated with Repairer' },
    { value: 'reasonable', label: 'Reasonable - Should be Allowed' },
    { value: 'estimated', label: 'Estimated Labour Figure' },
    { value: 'exceeds', label: 'Labour Figure Exceeds Amount' },
  ];

  // Helper function to generate parts source text
  const generatePartsSourceText = (sourceType, supplier, custom) => {
    if (sourceType === 'custom') return custom;
    if (!supplier) return partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';

    switch (sourceType) {
      case 'franchise':
        return `Franchise Parts – ${supplier}`;
      case 'used':
        return `${supplier} – Used parts`;
      case 'aftermarket':
        return `Aftermarket parts – ${supplier}`;
      case 'custom-built':
        return `Custom Built aftermarket – ${supplier}`;
      case 'reconditioned':
        return `${supplier} – Reconditioned parts`;
      case 'oem':
        return `O.E.M. – ${supplier}`;
      case 'mixed':
        return `Mixed (O.E.M. & Used) – ${supplier}`;
      default:
        const baseLabel = partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';
        return supplier ? `${baseLabel} – ${supplier}` : baseLabel;
    }
  };

  // Helper function to generate excluded items text
  const generateExcludedItemsText = () => {
    return excludedItemsList
      .filter(item => item.partName.trim() !== '')
      .map(item => {
        const reasonText = item.reason === 'custom' ? item.customReason : 
          exclusionReasonOptions.find(opt => opt.value === item.reason)?.label || '';
        return `${item.partName} - ${reasonText}`;
      }).join('\n');
  };

  // Generate remarks preview based on excluded items
  const generateRemarksPreview = () => {
    let preview = '';

    // Group excluded items by reason for better paragraph generation
    const groupedItems = {};
    excludedItemsList.forEach(item => {
      const reasonKey = item.reason;
      if (!groupedItems[reasonKey]) {
        groupedItems[reasonKey] = [];
      }
      groupedItems[reasonKey].push(item.partName);
    });

    // Generate remarks paragraphs for each reason category
    Object.entries(groupedItems).forEach(([reason, parts]) => {
      if (!reason || parts.length === 0) return;

      const partsText = parts.length === 1 ? parts[0] : 
        parts.length === 2 ? parts.join(' and ') :
        parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];

      switch (reason) {
        case 'to-repair':
          if (parts.length === 1) {
            preview += `The estimate included provision for a ${partsText} under the heading of material items. The damage to this component is reparable and was as a result excluded from the material items by way of an adjustment.\n\n`;
          } else {
            preview += `The estimate included provision for ${partsText} under the heading of material items. The damage to these components are reparable and were as a result excluded from the material items by way of adjustments.\n\n`;
          }
          break;
        case 'no-visible-damage':
          if (parts.length === 1) {
            preview += `The ${partsText} showed no signs of impact damage and was struck off the material section of the estimate by way of adjustments.\n\n`;
          } else {
            preview += `The ${partsText} showed no signs of impact damage and were struck off the material section of the estimate by way of adjustments.\n\n`;
          }
          break;
        case 'closer-inspection':
          if (parts.length === 1) {
            preview += `The estimate included provision for the replacement of a ${partsText} under the heading of material items. No damage was visible to this component at the time of inspection. This component will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned item was excluded from the material items in the interim.\n\n`;
          } else {
            preview += `The estimate included provision for the replacement of ${partsText} under the heading of material items. No damage was visible to these components at the time of inspection. These components will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned items were excluded from the material items in the interim.\n\n`;
          }
          break;
        case 'not-consistent':
          if (parts.length === 1) {
            preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
          } else {
            preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
          }
          break;
        case 'reusable':
          if (parts.length === 1) {
            preview += `The material section of the estimate included a ${partsText}. This component is re-usable and was excluded from the material section by way of adjustments.\n\n`;
          } else {
            preview += `The material section of the estimate included ${partsText}. These components are re-usable and were excluded from the material section by way of adjustments.\n\n`;
          }
          break;
        case 'salvageable':
          parts.forEach(part => {
            const item = excludedItemsList.find(i => i.partName === part);
            const amount = item?.customReason || '0.00';
            preview += `The unaffected ${part} has salvageable worth which we estimate to be in the order of $${amount}. You may wish to have this item turned into your Office as a result.\n\n`;
          });
          break;
        case 'lower-price':
          preview += `The material section of the estimate made provision for secondhand components. We were able to locate the required items on the market at lower prices, which are shown in red on the estimate.\n\n`;
          break;
        case 'total-loss':
          const item = excludedItemsList.find(i => i.reason === 'total-loss');
          const company = item?.customReason || '[company name]';
          preview += `We were presented with a letter from ${company} which recommended that this loss be treated as a 'Constructive Total Loss.' The parts figure will be in excess of $[amount] which no doubt far exceeds an economical undertaking.\n\n`;
          break;
        case 'no-contribution':
          preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items. There is a possibility that unseen damage may come to light after the job is opened. In the event that there is unseen damage, this ought to be the subject of a supplementary estimate by a further inspection.\n\n`;
          break;
        case 'no-contribution-applied':
          preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
          break;
        default:
          if (reason === 'custom') {
            const customReason = excludedItemsList.find(i => i.partName === parts[0])?.customReason;
            if (customReason) {
              preview += `${partsText} - ${customReason}\n\n`;
            }
          }
      }
    });

    // Add trade discount and contribution logic
    const hasTradeDiscount = tradeDiscountPercentage && tradeDiscountPercentage.trim() !== '';
    const hasContribution = contributionPercentage && contributionPercentage.trim() !== '';

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
  const generateLabourRemarksPreview = () => {
    if (!selectedLabourCategory) return '';

    const { originalFigure, adjustedFigure, personName, companyLocation, agreedFigure, labourFigure } = labourCategoryData;

    switch (selectedLabourCategory) {
      case 'overstated':
        return `The labour and material figure was overstated in the amount of $${originalFigure || '[original figure]'} which was adjusted downward to $${adjustedFigure || '[adjusted figure]'} which would be more realistic when compared to the actual man hours involved to complete the repair exercise.`;

      case 'negotiated':
        return `In keeping with your instructions we have negotiated a labour figure with ${personName || '[person name]'} of ${companyLocation || '[company/location]'} and after a deliberation on the issue, a labour and material figure of $${agreedFigure || '[agreed figure]'} was mutually agreed.`;

      case 'reasonable':
        return `The labour and material figure quoted is reasonable when one considers the nature of repairs and time involved to restore the vehicle to its pre-accident condition. This figure therefore should be allowed.`;

      case 'estimated':
        return `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in the region of $${labourFigure || '[labour figure]'}.`;

      case 'exceeds':
        return `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in excess of $${labourFigure || '[labour figure]'}.`;

      default:
        return '';
    }
  };

  useEffect(() => {
    setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() }));
  }, [excludedItemsList]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

    let parsedValue: string | number | boolean = value;

    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    } else if (type === 'checkbox') {
      parsedValue = checked;
    }

    setEstimateData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = () => {
    const excludedItemsArray = estimateData.excludedItems
      .split('\n')
      .filter(item => item.trim() !== '');

    const finalAdjustedSource = generatePartsSourceText(adjusterSource, adjusterSourceSupplier, adjusterSourceCustom);
    const finalExcludedItems = generateExcludedItemsText();

    updateFormData({
      estimate: {
        from: estimateData.from,
        dated: estimateData.dated,
        invoiceFrom: estimateData.invoiceFrom,
        invoiceDated: estimateData.invoiceDated,

        parts: {
          adjustedSource: finalAdjustedSource || estimateData.adjustedSource,
          excludedItems: finalExcludedItems ? finalExcludedItems.split('\n') : excludedItemsArray,
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
            partsSourceOptions={partsSourceOptions}
            exclusionReasonOptions={exclusionReasonOptions}
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
            labourCategoryOptions={labourCategoryOptions}
            generateLabourRemarksPreview={generateLabourRemarksPreview}
          />

          <NotesTextbox section="estimate" placeholder="Add notes about estimate details..." />

          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};