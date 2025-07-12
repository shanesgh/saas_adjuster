import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Plus, X } from 'lucide-react';
import { FormNavigation } from '../navigation/FormNavigation';

interface ExcludedItem {
  id: string;
  partName: string;
  reason: string;
}

interface LabourCategory {
  category: string;
  originalFigure?: string;
  adjustedFigure?: string;
  personName?: string;
  companyLocation?: string;
  agreedFigure?: string;
  labourFigure?: string;
}

export const EstimateForm: React.FC = () => {
  const { estimateData, updateEstimateData } = useFormContext();
  const [excludedItems, setExcludedItems] = useState<ExcludedItem[]>([]);
  const [labourCategory, setLabourCategory] = useState<LabourCategory>({ category: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateEstimateData({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateEstimateData({ [name]: value });
  };

  const addExcludedItem = () => {
    const newItem: ExcludedItem = {
      id: Date.now().toString(),
      partName: '',
      reason: ''
    };
    setExcludedItems([...excludedItems, newItem]);
  };

  const updateExcludedItem = (id: string, field: string, value: string) => {
    setExcludedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    // Force re-render for preview
    setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
  };

  const removeExcludedItem = (id: string) => {
    setExcludedItems(items => items.filter(item => item.id !== id));
    setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
  };

  const handleLabourCategoryChange = (field: string, value: string) => {
    setLabourCategory(prev => ({ ...prev, [field]: value }));
    setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
  };

  const generatePartsRemarks = () => {
    let remarks = '';

    // Excluded items remarks
    excludedItems.forEach(item => {
      if (item.partName && item.reason) {
        switch (item.reason) {
          case 'repair':
            remarks += `The estimate included provision for a ${item.partName} under the heading of material items. The damage to this component is reparable and therefore the cost of replacement should be excluded from the estimate.\n\n`;
            break;
          case 'betterment':
            remarks += `The estimate included provision for a ${item.partName} under the heading of material items. This component was not damaged in the accident and therefore the cost of replacement should be excluded from the estimate.\n\n`;
            break;
          case 'pre-existing':
            remarks += `The estimate included provision for a ${item.partName} under the heading of material items. The damage to this component was pre-existing and therefore the cost of replacement should be excluded from the estimate.\n\n`;
            break;
          case 'no-contribution':
            remarks += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
            break;
        }
      }
    });

    // Trade discount and contribution remarks
    const tradeDiscount = parseFloat(estimateData.tradeDiscount || '0');
    const contribution = parseFloat(estimateData.contribution || '0');

    if (tradeDiscount > 0 && contribution === 0) {
      remarks += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
    } else if (tradeDiscount > 0 && contribution > 0) {
      remarks += `Age-Related Contribution: A ${contribution}% contribution has been applied to account for the age and condition of the vehicle.\n\n`;
    }

    return remarks.trim();
  };

  const generateLabourRemarks = () => {
    let remarks = '';

    switch (labourCategory.category) {
      case 'overstated':
        const original = labourCategory.originalFigure || '[original figure]';
        const adjusted = labourCategory.adjustedFigure || '[adjusted figure]';
        remarks += `The labour and material figure was overstated in the amount of $${original} which was adjusted downward to $${adjusted} which would be more realistic when compared to the actual man hours involved to complete the repair exercise.\n\n`;
        break;
      case 'negotiated':
        const person = labourCategory.personName || '[person name]';
        const company = labourCategory.companyLocation || '[company/location]';
        const agreed = labourCategory.agreedFigure || '[agreed figure]';
        remarks += `In keeping with your instructions we have negotiated a labour figure with ${person} of ${company} and after a deliberation on the issue, a labour and material figure of $${agreed} was mutually agreed.\n\n`;
        break;
      case 'reasonable':
        remarks += `The labour and material figure quoted is reasonable when one considers the nature of repairs and time involved to restore the vehicle to its pre-accident condition. This figure therefore should be allowed.\n\n`;
        break;
      case 'estimated':
        const estimated = labourCategory.labourFigure || '[labour figure]';
        remarks += `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in the region of $${estimated}.\n\n`;
        break;
      case 'exceeds':
        const exceeds = labourCategory.labourFigure || '[labour figure]';
        remarks += `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in excess of $${exceeds}.\n\n`;
        break;
    }

    return remarks.trim();
  };

  const handleSubmit = () => {
    // Auto-navigate to next tab after save
    setTimeout(() => {
      const event = new CustomEvent('navigateToNextTab');
      window.dispatchEvent(event);
    }, 100);
  };

  const reasonOptions = [
    { value: 'repair', label: 'To repair' },
    { value: 'betterment', label: 'Betterment' },
    { value: 'pre-existing', label: 'Pre-existing damage' },
    { value: 'no-contribution', label: 'No Contribution Applied' }
  ];

  const labourCategoryOptions = [
    { value: 'overstated', label: 'Overstated - Adjusted Downward' },
    { value: 'negotiated', label: 'Negotiated with Repairer' },
    { value: 'reasonable', label: 'Reasonable - Should be Allowed' },
    { value: 'estimated', label: 'Estimated Labour Figure' },
    { value: 'exceeds', label: 'Labour Figure Exceeds Amount' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Estimate Information</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Estimate From and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="estimateFrom">Estimate From</Label>
            <Input
              id="estimateFrom"
              name="estimateFrom"
              value={estimateData.estimateFrom || ''}
              onChange={handleChange}
              placeholder="Enter estimate source"
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="estimateDate">Estimate Date</Label>
            <Input
              id="estimateDate"
              name="estimateDate"
              type="date"
              value={estimateData.estimateDate || ''}
              onChange={handleChange}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Section A - Parts */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-secondary-900">Section A - Parts</h3>
          
          {/* Excluded Items */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-800">Excluded Items & Reason Disallowed</h4>
            
            {excludedItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-secondary-200 rounded-lg">
                <div className="space-y-1">
                  <Label>Part Name</Label>
                  <Input
                    value={item.partName}
                    onChange={(e) => updateExcludedItem(item.id, 'partName', e.target.value)}
                    placeholder="Enter part name"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Reason</Label>
                  <Select value={item.reason} onValueChange={(value) => updateExcludedItem(item.id, 'reason', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeExcludedItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={addExcludedItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto block"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Excluded Item
              </Button>
            </div>
          </div>

          {/* Adjusted Source & Type of Parts */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-800">Adjusted Source & Type of Parts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="adjusterSource">Source</Label>
                <Select value={estimateData.adjusterSource || ''} onValueChange={(value) => handleSelectChange('adjusterSource', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franchise">Franchise Parts</SelectItem>
                    <SelectItem value="aftermarket">Aftermarket parts</SelectItem>
                    <SelectItem value="used">Used parts</SelectItem>
                    <SelectItem value="custom">Custom Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="supplierName">
                  {estimateData.adjusterSource === 'custom' ? 'Custom Entry' : 'Supplier Name (with phone if applicable)'}
                </Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  value={estimateData.supplierName || ''}
                  onChange={handleChange}
                  placeholder={estimateData.adjusterSource === 'custom' ? 'Enter custom entry' : 'Enter supplier name and phone'}
                  className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Trade Discount & Contribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="tradeDiscount">Trade Discount (%)</Label>
              <Input
                id="tradeDiscount"
                name="tradeDiscount"
                type="number"
                step="0.01"
                value={estimateData.tradeDiscount || ''}
                onChange={handleChange}
                placeholder="Enter trade discount percentage"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contribution">Contribution (%)</Label>
              <Input
                id="contribution"
                name="contribution"
                type="number"
                step="0.01"
                value={estimateData.contribution || ''}
                onChange={handleChange}
                placeholder="Enter contribution percentage"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Parts Figures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="partsQuoted">Parts Figure Quoted ($)</Label>
              <Input
                id="partsQuoted"
                name="partsQuoted"
                type="number"
                step="0.01"
                value={estimateData.partsQuoted || ''}
                onChange={handleChange}
                placeholder="Enter quoted parts figure"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adjustedParts">Adjusted Parts Figure ($)</Label>
              <Input
                id="adjustedParts"
                name="adjustedParts"
                type="number"
                step="0.01"
                value={estimateData.adjustedParts || ''}
                onChange={handleChange}
                placeholder="Enter adjusted parts figure"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Parts Remarks Preview */}
          <div className="space-y-1">
            <Label>Remarks Preview</Label>
            <div className="p-3 bg-gray-50 border border-secondary-200 rounded-md min-h-[100px]">
              <p className="text-sm text-secondary-700 whitespace-pre-line">
                {generatePartsRemarks() || 'Remarks will appear here based on your selections...'}
              </p>
            </div>
          </div>

          {/* Custom Parts Remarks */}
          <div className="space-y-1">
            <Label htmlFor="partsRemarks">Custom Section(A) Parts Remarks</Label>
            <Textarea
              id="partsRemarks"
              name="partsRemarks"
              value={estimateData.partsRemarks || ''}
              onChange={(e) => {
                handleChange(e);
                setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
              }}
              rows={4}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter additional remarks about parts..."
            />
          </div>
        </div>

        {/* Section B - Labour */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-secondary-900">Section B - Labour</h3>
          
          {/* Labour Figures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="figureQuoted">Figure Quoted ($)</Label>
              <Input
                id="figureQuoted"
                name="figureQuoted"
                type="number"
                step="0.01"
                value={estimateData.figureQuoted || ''}
                onChange={handleChange}
                placeholder="Enter quoted figure"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adjustedLabour">Adjusted Labour & Material Figure ($)</Label>
              <Input
                id="adjustedLabour"
                name="adjustedLabour"
                type="number"
                step="0.01"
                value={estimateData.adjustedLabour || ''}
                onChange={handleChange}
                placeholder="Enter adjusted figure"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="completionDays">Repairs ought to be completed in (days)</Label>
              <Input
                id="completionDays"
                name="completionDays"
                type="number"
                value={estimateData.completionDays || ''}
                onChange={handleChange}
                placeholder="Enter days"
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Labour Categories */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-800">Labour Categories</h4>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={labourCategory.category} onValueChange={(value) => handleLabourCategoryChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select labour category" />
                </SelectTrigger>
                <SelectContent>
                  {labourCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic fields based on category */}
            {labourCategory.category === 'overstated' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Original Figure ($)</Label>
                  <Input
                    value={labourCategory.originalFigure || ''}
                    onChange={(e) => handleLabourCategoryChange('originalFigure', e.target.value)}
                    placeholder="Enter original figure"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Adjusted Figure ($)</Label>
                  <Input
                    value={labourCategory.adjustedFigure || ''}
                    onChange={(e) => handleLabourCategoryChange('adjustedFigure', e.target.value)}
                    placeholder="Enter adjusted figure"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {labourCategory.category === 'negotiated' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Person Name</Label>
                  <Input
                    value={labourCategory.personName || ''}
                    onChange={(e) => handleLabourCategoryChange('personName', e.target.value)}
                    placeholder="Enter person name"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Company/Location</Label>
                  <Input
                    value={labourCategory.companyLocation || ''}
                    onChange={(e) => handleLabourCategoryChange('companyLocation', e.target.value)}
                    placeholder="Enter company/location"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Agreed Figure ($)</Label>
                  <Input
                    value={labourCategory.agreedFigure || ''}
                    onChange={(e) => handleLabourCategoryChange('agreedFigure', e.target.value)}
                    placeholder="Enter agreed figure"
                    className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {(labourCategory.category === 'estimated' || labourCategory.category === 'exceeds') && (
              <div className="space-y-1">
                <Label>Labour Figure ($)</Label>
                <Input
                  value={labourCategory.labourFigure || ''}
                  onChange={(e) => handleLabourCategoryChange('labourFigure', e.target.value)}
                  placeholder="Enter labour figure"
                  className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}
          </div>

          {/* Labour Remarks Preview */}
          <div className="space-y-1">
            <Label>Labour Remarks Preview</Label>
            <div className="p-3 bg-gray-50 border border-secondary-200 rounded-md min-h-[100px]">
              <p className="text-sm text-secondary-700 whitespace-pre-line">
                {generateLabourRemarks() || 'Labour remarks will appear here based on your category selection...'}
              </p>
            </div>
          </div>

          {/* Custom Labour Remarks */}
          <div className="space-y-1">
            <Label htmlFor="labourRemarks">Custom Section(B) Labour Remarks</Label>
            <Textarea
              id="labourRemarks"
              name="labourRemarks"
              value={estimateData.labourRemarks || ''}
              onChange={(e) => {
                handleChange(e);
                setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
              }}
              rows={4}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter remarks about labour..."
            />
          </div>
        </div>

        <FormNavigation onNext={handleSubmit} />
      </CardContent>
    </Card>
  );
};