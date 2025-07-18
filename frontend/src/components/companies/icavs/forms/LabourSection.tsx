import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';

interface LabourSectionProps {
  estimateData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  selectedLabourCategory: string;
  setSelectedLabourCategory: (value: string) => void;
  labourCategoryData: any;
  setLabourCategoryData: (data: any) => void;
  labourCategoryOptions: any[];
  generateLabourRemarksPreview: () => string;
}

export const LabourSection = ({
  estimateData,
  handleChange,
  selectedLabourCategory,
  setSelectedLabourCategory,
  labourCategoryData,
  setLabourCategoryData,
  labourCategoryOptions,
  generateLabourRemarksPreview
}: LabourSectionProps) => {
  return (
    <div className="border-t border-secondary-200 pt-4 space-y-4">
      <h3 className="text-lg font-medium">Labour (Section B)</h3>

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

      {/* Labour Category Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-secondary-700">
          Labour Category
        </label>
        <Select
          value={selectedLabourCategory}
          onChange={(e) => setSelectedLabourCategory(e.target.value)}
          options={labourCategoryOptions}
        />
      </div>

      {/* Dynamic fields based on labour category */}
      {selectedLabourCategory === 'overstated' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Original Figure ($)"
            value={labourCategoryData.originalFigure}
            onChange={(e) => setLabourCategoryData(prev => ({ ...prev, originalFigure: e.target.value }))}
            placeholder="e.g. 14730.00"
          />
          <Input
            label="Adjusted Figure ($)"
            value={labourCategoryData.adjustedFigure}
            onChange={(e) => setLabourCategoryData(prev => ({ ...prev, adjustedFigure: e.target.value }))}
            placeholder="e.g. 7690.00"
          />
        </div>
      )}

      {selectedLabourCategory === 'negotiated' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Person Name"
              value={labourCategoryData.personName}
              onChange={(e) => setLabourCategoryData(prev => ({ ...prev, personName: e.target.value }))}
              placeholder="e.g. John Smith"
            />
            <Input
              label="Company/Location"
              value={labourCategoryData.companyLocation}
              onChange={(e) => setLabourCategoryData(prev => ({ ...prev, companyLocation: e.target.value }))}
              placeholder="e.g. ABC Auto Body Shop"
            />
          </div>
          <Input
            label="Agreed Figure ($)"
            value={labourCategoryData.agreedFigure}
            onChange={(e) => setLabourCategoryData(prev => ({ ...prev, agreedFigure: e.target.value }))}
            placeholder="e.g. 8500.00"
          />
        </div>
      )}

      {(selectedLabourCategory === 'estimated' || selectedLabourCategory === 'exceeds') && (
        <Input
          label="Labour Figure ($)"
          value={labourCategoryData.labourFigure}
          onChange={(e) => setLabourCategoryData(prev => ({ ...prev, labourFigure: e.target.value }))}
          placeholder="e.g. 7500.00"
        />
      )}

      

      {/* Labour Remarks Preview */}
      {(selectedLabourCategory || estimateData.labourRemarks) && (
        <div className="p-3 bg-gray-50 rounded border text-sm">
          <strong>Labour Remarks Preview:</strong>
          <div className="mt-2 whitespace-pre-line text-gray-700">
            {generateLabourRemarksPreview()}
            {estimateData.labourRemarks && (
              <>
                {generateLabourRemarksPreview() && '\n\n'}
                {estimateData.labourRemarks}
              </>
            )}
          </div>
        </div>
      )}
      <div className="space-y-1">
        <label
          htmlFor="labourRemarks"
          className="block text-sm font-medium text-secondary-700"
        >
          Custom Section(B) Labour Remarks
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
    </div>
  );
};