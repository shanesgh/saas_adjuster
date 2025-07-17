import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';

interface PartsSectionProps {
  reportedSource: string;
  setReportedSource: (value: string) => void;
  adjusterSource: string;
  setAdjusterSource: (value: string) => void;
  adjusterSourceSupplier: string;
  setAdjusterSourceSupplier: (value: string) => void;
  excludedItemsList: any[];
  setExcludedItemsList: (items: any[]) => void;
  tradeDiscountPercentage: string;
  setTradeDiscountPercentage: (value: string) => void;
  contributionPercentage: string;
  setContributionPercentage: (value: string) => void;
  estimateData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  partsSourceOptions: any[];
  exclusionReasonOptions: any[];
  generatePartsSourceText: (sourceType: string, supplier: string, custom: string) => string;
  generateExcludedItemsText: () => string;
  generateRemarksPreview: () => string;
}

export const PartsSection = ({
  reportedSource,
  setReportedSource,
  adjusterSource,
  setAdjusterSource,
  adjusterSourceSupplier,
  setAdjusterSourceSupplier,
  excludedItemsList,
  setExcludedItemsList,
  tradeDiscountPercentage,
  setTradeDiscountPercentage,
  contributionPercentage,
  setContributionPercentage,
  estimateData,
  handleChange,
  partsSourceOptions,
  exclusionReasonOptions,
  generatePartsSourceText,
  generateExcludedItemsText,
  generateRemarksPreview
}: PartsSectionProps) => {
  
  const addExcludedItem = () => {
    setExcludedItemsList([...excludedItemsList, { 
      partName: '', 
      reason: 'to-repair',
      customReason: '' 
    }]);
  };

  const updateExcludedItem = (index: number, field: string, value: string) => {
    const updated = [...excludedItemsList];
    updated[index] = { ...updated[index], [field]: value };
    setExcludedItemsList(updated);
  };

  const removeExcludedItem = (index: number) => {
    setExcludedItemsList(excludedItemsList.filter((_, i) => i !== index));
  };

  return (
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
        <Input
          label={adjusterSource === 'custom' ? "Custom Entry" : "Supplier Name (with phone if applicable)"}
          value={adjusterSourceSupplier}
          onChange={(e) => setAdjusterSourceSupplier(e.target.value)}
          placeholder={adjusterSource === 'custom' ? "Enter custom parts source" : "e.g. Seenath's (360-7033) or Automix - 751-2782"}
        />
        {adjusterSource && (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            <strong>Preview:</strong> {generatePartsSourceText(adjusterSource, adjusterSourceSupplier, adjusterSource === 'custom' ? adjusterSourceSupplier : '')}
          </div>
        )}
      </div>

      {/* Excluded Items Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-secondary-700">
            Excluded Items & Reason Disallowed
          </label>
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

        <button
          type="button"
          onClick={addExcludedItem}
          className="mx-auto block px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          + Add Excluded Item
        </button>

        {excludedItemsList.length > 0 && (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            <strong>Preview:</strong>
            <pre className="whitespace-pre-wrap mt-1">{generateExcludedItemsText()}</pre>
          </div>
        )}
      </div>

      {/* Trade Discount and Contribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Trade Discount (%)"
          type="number"
          step="0.1"
          value={tradeDiscountPercentage}
          onChange={(e) => setTradeDiscountPercentage(e.target.value)}
          placeholder="e.g. 40"
        />

        <Input
          label="Contribution (%)"
          type="number"
          step="0.1"
          value={contributionPercentage}
          onChange={(e) => setContributionPercentage(e.target.value)}
          placeholder="e.g. 10"
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

      {/* Remarks Preview */}
      {(excludedItemsList.length > 0 || tradeDiscountPercentage || contributionPercentage || estimateData.partsRemarks) && (
        <div className="p-3 bg-gray-50 rounded border text-sm">
          <strong>Remarks Preview:</strong>
          <div className="mt-2 whitespace-pre-line text-gray-700">
            {generateRemarksPreview()}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="partsRemarks"
          className="block text-sm font-medium text-secondary-700"
        >
          Custom Section(A) Parts Remarks
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
    </div>
  );
};