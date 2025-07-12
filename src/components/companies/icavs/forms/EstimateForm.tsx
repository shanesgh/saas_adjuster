import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

// Parts source options
const partsSourceOptions = [
  { value: 'new-oem', label: 'New O.E.M. parts' },
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
  { value: 'custom', label: 'Custom Reason' },
];

export const EstimateForm = () => {
  const { formData, updateFormData } = useForm();
  const [estimateData, setEstimateData] = useState({
    from: formData.estimate?.from || '',
    dated: formData.estimate?.dated || false,
    invoiceFrom: formData.estimate?.invoiceFrom || '',
    invoiceDated: formData.estimate?.invoiceDated || '',
    
    adjustedSource: formData.estimate?.parts.adjustedSource || '',
    excludedItems: formData.estimate?.parts.excludedItems?.join('\n') || '',
    partsRemarks: formData.estimate?.parts.remarks || '',
    partsQuotedFigure: formData.estimate?.parts.quotedFigure || 0,
    partsAdjustedFigure: formData.estimate?.parts.adjustedFigure || 0,
    
    labourRemarks: formData.estimate?.labour.remarks || '',
    labourQuotedFigure: formData.estimate?.labour.quotedFigure || 0,
    labourAdjustedFigure: formData.estimate?.labour.adjustedFigure || 0,
    
    completionDays: formData.estimate?.completionDays || 0,
  });

  // New state for dropdown functionality
  const [reportedSource, setReportedSource] = useState('');
  const [reportedSourceSupplier, setReportedSourceSupplier] = useState('');
  const [reportedSourceCustom, setReportedSourceCustom] = useState('');
  const [adjusterSource, setAdjusterSource] = useState('');
  const [adjusterSourceSupplier, setAdjusterSourceSupplier] = useState('');
  const [adjusterSourceCustom, setAdjusterSourceCustom] = useState('');
  const [excludedItemsList, setExcludedItemsList] = useState([]);

  // Helper function to generate parts source text
  const generatePartsSourceText = (sourceType, supplier, custom) => {
    if (sourceType === 'custom') return custom;
    if (!supplier) return partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';
    
    switch (sourceType) {
      case 'new-oem':
        return `New O.E.M. parts – ${supplier}`;
      case 'used':
        return `${supplier} – Used parts`;
      case 'aftermarket':
        return `Aftermarket parts – ${supplier}`;
      case 'custom-built':
        return `Custom Built aftermarket – ${supplier}`;
      case 'reconditioned':
        return `${supplier} – Reconditioned parts`;
      default:
        return partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';
    }
  };

  // Helper function to add excluded item
  const addExcludedItem = () => {
    setExcludedItemsList([...excludedItemsList, { partName: '', reason: '', customReason: '' }]);
  };

  // Helper function to update excluded item
  const updateExcludedItem = (index, field, value) => {
    const updated = [...excludedItemsList];
    updated[index] = { ...updated[index], [field]: value };
    setExcludedItemsList(updated);
  };

  // Helper function to remove excluded item
  const removeExcludedItem = (index) => {
    setExcludedItemsList(excludedItemsList.filter((_, i) => i !== index));
  };

  // Helper function to generate excluded items text
  const generateExcludedItemsText = () => {
    return excludedItemsList.map(item => {
      const reasonText = item.reason === 'custom' ? item.customReason : 
        exclusionReasonOptions.find(opt => opt.value === item.reason)?.label || '';
      return `${item.partName} - ${reasonText}`;
    }).join('\n');
  };

  // Helper functions for trade discount
  const addTradeDiscount = () => {
    setTradeDiscountList([...tradeDiscountList, { percentage: '', description: '' }]);
  };

  const updateTradeDiscount = (index, field, value) => {
    const updated = [...tradeDiscountList];
    updated[index] = { ...updated[index], [field]: value };
    setTradeDiscountList(updated);
  };

  const removeTradeDiscount = (index) => {
    setTradeDiscountList(tradeDiscountList.filter((_, i) => i !== index));
  };

  // Helper functions for contribution
  const addContribution = () => {
    setContributionList([...contributionList, { percentage: '', description: '' }]);
  };

  const updateContribution = (index, field, value) => {
    const updated = [...contributionList];
    updated[index] = { ...updated[index], [field]: value };
    setContributionList(updated);
  };

  const removeContribution = (index) => {
    setContributionList(contributionList.filter((_, i) => i !== index));
  };

  // Generate full preview with paragraphs
  const generateFullPreview = () => {
    let preview = '';
    
    // Group excluded items by reason for better paragraph generation
    const groupedItems = {};
    excludedItemsList.forEach(item => {
      const reasonKey = item.reason === 'custom' ? item.customReason : item.reason;
      if (!groupedItems[reasonKey]) {
        groupedItems[reasonKey] = [];
      }
      groupedItems[reasonKey].push(item.partName);
    });

    // Generate excluded items list
    Object.entries(groupedItems).forEach(([reason, parts]) => {
      const reasonText = exclusionReasonOptions.find(opt => opt.value === reason)?.label || reason;
      const partsText = parts.join(', ');
      preview += `${partsText} – ${reasonText}\n`;
    });

    // Add trade discount
    if (tradeDiscountList.length > 0) {
      const discounts = tradeDiscountList.map(d => `${d.percentage}%`).join(', ');
      preview += `Trade Discount: ${discounts}\n`;
    }

    // Add contribution
    if (contributionList.length > 0) {
      const contributions = contributionList.map(c => `${c.percentage}%`).join(', ');
      preview += `Contribution: ${contributions}\n`;
    }

    // Add salvageable items (from excluded items with salvageable reason)
    const salvageableItems = excludedItemsList.filter(item => item.reason === 'salvageable');
    if (salvageableItems.length > 0) {
      const salvageText = salvageableItems.map(item => `${item.partName} ($${item.customReason || '0.00'})`).join(', ');
      preview += `Salvageable items & Estimated value: ${salvageText}\n`;
    }

    preview += '\nRemarks:\n';

    // Generate detailed remarks paragraphs
    Object.entries(groupedItems).forEach(([reason, parts]) => {
      const partsText = parts.join(', ');
      
      switch (reason) {
        case 'to-repair':
          preview += `The estimate included provision for ${partsText} under the heading of material items. The damage to ${parts.length > 1 ? 'these components are' : 'this component is'} reparable and ${parts.length > 1 ? 'were' : 'was'} as a result excluded from the material items by way of ${parts.length > 1 ? 'adjustments' : 'an adjustment'}.\n\n`;
          break;
        case 'no-visible-damage':
          preview += `The ${partsText} showed no signs of impact damage and were struck off the material section of the estimate by way of adjustments.\n\n`;
          break;
        case 'closer-inspection':
          preview += `The estimate included provision for the replacement of ${partsText} under the heading of material items. No damage was visible to ${parts.length > 1 ? 'these components' : 'this component'} at the time of inspection. ${parts.length > 1 ? 'These components' : 'This component'} will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned items were excluded from the material items in the interim.\n\n`;
          break;
        case 'not-consistent':
          preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
          break;
        case 'reusable':
          preview += `The material section of the estimate included ${partsText}. These components are re-usable and were excluded from the material section by way of adjustments.\n\n`;
          break;
        case 'salvageable':
          parts.forEach(part => {
            const item = excludedItemsList.find(i => i.partName === part);
            const amount = item?.customReason || '0.00';
            preview += `The unaffected ${part} has salvageable worth which we estimate to be in the order of $${amount}. You may wish to have this item turned into your Office as a result.\n\n`;
          });
          break;
        default:
          if (reason) {
            preview += `${partsText} - ${reason}\n\n`;
          }
      }
    });

    // Add contribution remarks
    if (contributionList.length > 0) {
      contributionList.forEach(contribution => {
        preview += `On account of the age of the vehicle we applied ${contribution.percentage}% contribution towards the O.E.M. parts which has been reflected in our handwritten workings on the attached estimate.\n\n`;
      });
    }

    // Add custom remarks
    if (estimateData.partsRemarks) {
      preview += `${estimateData.partsRemarks}\n`;
    }

    return preview.trim();
  };
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
    
    // Update adjusted source with generated text
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
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Estimate Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Estimate Source</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estimate From"
                name="from"
                value={estimateData.from}
                onChange={handleChange}
                placeholder="e.g. Aristocraft Auto Collision"
              />
              
              <div className="flex items-center mt-8">
                <Checkbox
                  id="dated"
                  name="dated"
                  label="Dated"
                  checked={estimateData.dated}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice From"
                name="invoiceFrom"
                value={estimateData.invoiceFrom}
                onChange={handleChange}
                placeholder="e.g. White Boy Auto"
              />
              
              <Input
                label="Invoice Dated"
                type="date"
                name="invoiceDated"
                value={estimateData.invoiceDated}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-4 space-y-4">
            <h3 className="text-lg font-medium">Parts (Section A)</h3>
            
            {/* Reported Source Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Reported Source & Type of Parts
              </label>
              <Select
                value={reportedSource}
                onChange={(e) => setReportedSource(e.target.value)}
                options={partsSourceOptions}
              />
            </div>

            {/* Adjuster Source Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Adjusted Source & Type of Parts
              </label>
              <Select
                value={adjusterSource}
                onChange={(e) => setAdjusterSource(e.target.value)}
                options={partsSourceOptions}
              />
              {adjusterSource && adjusterSource !== 'oem' && adjusterSource !== 'mixed' && adjusterSource !== 'custom' && (
                <Input
                  label="Supplier Name (with phone if applicable)"
                  value={adjusterSourceSupplier}
                  onChange={(e) => setAdjusterSourceSupplier(e.target.value)}
                  placeholder="e.g. Seenath's (360-7033) or Automix - 751-2782"
                />
              )}
              {adjusterSource === 'custom' && (
                <Input
                  label="Custom Entry"
                  value={adjusterSourceCustom}
                  onChange={(e) => setAdjusterSourceCustom(e.target.value)}
                  placeholder="Enter custom parts source"
                />
              )}
              {adjusterSource && (
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  <strong>Preview:</strong> {generatePartsSourceText(adjusterSource, adjusterSourceSupplier, adjusterSourceCustom)}
                </div>
              )}
            </div>

            {/* Excluded Items Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-secondary-700">
                  Excluded Items & Reason Disallowed
                </label>
                <button
                  type="button"
                  onClick={addExcludedItem}
                  className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                >
                  Add Item
                </button>
              </div>
              
              {excludedItemsList.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExcludedItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    label="Part Name"
                    value={item.partName}
                    onChange={(e) => updateExcludedItem(index, 'partName', e.target.value)}
                    placeholder="e.g. Rear bumper"
                  />
                  <Select
                    label="Reason"
                    value={item.reason}
                    onChange={(e) => updateExcludedItem(index, 'reason', e.target.value)}
                    options={exclusionReasonOptions}
                  />
                  {item.reason === 'custom' && (
                    <Input
                      label="Custom Reason"
                      value={item.customReason}
                      onChange={(e) => updateExcludedItem(index, 'customReason', e.target.value)}
                      placeholder="Enter custom reason"
                    />
                  )}
                </div>
              ))}
              
              {excludedItemsList.length > 0 && (
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  <strong>Preview:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{generateExcludedItemsText()}</pre>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label
                htmlFor="partsRemarks"
                className="block text-sm font-medium text-secondary-700"
              >
                Remarks
              </label>
              <textarea
                id="partsRemarks"
                name="partsRemarks"
                value={estimateData.partsRemarks}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter remarks about parts..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Parts Figure Quoted ($)"
                type="number"
                step="0.01"
                name="partsQuotedFigure"
                value={estimateData.partsQuotedFigure}
                onChange={handleChange}
              />
              
              <Input
                label="Adjusted Parts Figure ($)"
                type="number"
                step="0.01"
                name="partsAdjustedFigure"
                value={estimateData.partsAdjustedFigure}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-4 space-y-4">
            <h3 className="text-lg font-medium">Labour (Section B)</h3>
            
            <div className="space-y-1">
              <label
                htmlFor="labourRemarks"
                className="block text-sm font-medium text-secondary-700"
              >
                Remarks
              </label>
              <textarea
                id="labourRemarks"
                name="labourRemarks"
                value={estimateData.labourRemarks}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter remarks about labour..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Figure Quoted ($)"
                type="number"
                step="0.01"
                name="labourQuotedFigure"
                value={estimateData.labourQuotedFigure}
                onChange={handleChange}
              />
              
              <Input
                label="Adjusted Labour & Material Figure ($)"
                type="number"
                step="0.01"
                name="labourAdjustedFigure"
                value={estimateData.labourAdjustedFigure}
                onChange={handleChange}
              />
            </div>
            
            <Input
              label="Repairs ought to be completed in (days)"
              type="number"
              name="completionDays"
              value={estimateData.completionDays}
              onChange={handleChange}
            />
          </div>
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};