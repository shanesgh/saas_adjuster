import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { FormNavigation } from '../FormNavigation';

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
    
    updateFormData({
      estimate: {
        from: estimateData.from,
        dated: estimateData.dated,
        invoiceFrom: estimateData.invoiceFrom,
        invoiceDated: estimateData.invoiceDated,
        
        parts: {
          adjustedSource: estimateData.adjustedSource,
          excludedItems: excludedItemsArray,
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
            
            <Input
              label="Adjusted source & type of parts"
              name="adjustedSource"
              value={estimateData.adjustedSource}
              onChange={handleChange}
              placeholder="e.g. Automix - 751-2782 Used parts"
            />
            
            <div className="space-y-1">
              <label
                htmlFor="excludedItems"
                className="block text-sm font-medium text-secondary-700"
              >
                Excluded Items & Reason disallowed (one per line)
              </label>
              <textarea
                id="excludedItems"
                name="excludedItems"
                value={estimateData.excludedItems}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Rear bumper and left 'B' pillar- To repair"
              />
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