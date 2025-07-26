import { Input } from '../../../ui/input';
import { Checkbox } from '../../../ui/checkbox';

interface EstimateSourceSectionProps {
  estimateData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EstimateSourceSection = ({ estimateData, handleChange }: EstimateSourceSectionProps) => {
  return (
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

        <Input
          label="Estimate Date"
          type="date"
          name="estimateDate"
          value={estimateData.estimateDate || ''}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center mt-8">
          <Checkbox
            id="dated"
            name="dated"
            label="Dated"
            checked={estimateData.dated}
            onChange={handleChange}
          />
        </div>

        <div></div>
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
  );
};