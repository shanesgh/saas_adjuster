import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

export const RecommendationForm = () => {
  const { formData, updateFormData } = useForm();
  const [recommendationData, setRecommendationData] = useState({
    settlementBasis: formData.recommendation?.settlementBasis || 'Repair or Cash In Lieu of Repair Basis',
    apparentCostOfRepairs: formData.recommendation?.apparentCostOfRepairs || 0,
    preAccidentValue: formData.recommendation?.preAccidentValue || 0,
    settlementOffer: formData.recommendation?.settlementOffer || 0,
    reserve: formData.recommendation?.reserve || 0,
    remarks: formData.recommendation?.remarks || '',
  });

  const basisOptions = [
    { value: 'Repair or Cash In Lieu of Repair Basis', label: 'Repair or Cash In Lieu of Repair Basis' },
    { value: 'Total Loss', label: 'Total Loss' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    const parsedValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;
    
    setRecommendationData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = () => {
    updateFormData({
      recommendation: recommendationData,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Recommendation</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            label="Settlement Basis"
            name="settlementBasis"
            value={recommendationData.settlementBasis}
            onChange={handleChange}
            options={basisOptions}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Apparent Cost of Repairs (VAT exc.) ($)"
              type="number"
              step="0.01"
              name="apparentCostOfRepairs"
              value={recommendationData.apparentCostOfRepairs}
              onChange={handleChange}
            />
            
            <Input
              label="Pre-Accident Value ($)"
              type="number"
              step="0.01"
              name="preAccidentValue"
              value={recommendationData.preAccidentValue}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Settlement Offer (VAT exc.) ($)"
              type="number"
              step="0.01"
              name="settlementOffer"
              value={recommendationData.settlementOffer}
              onChange={handleChange}
            />
            
            <Input
              label="Reserve ($)"
              type="number"
              step="0.01"
              name="reserve"
              value={recommendationData.reserve}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-1">
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-secondary-700"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={recommendationData.remarks}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Enter recommendation remarks..."
            />
          </div>

          <NotesTextbox section="recommendation" placeholder="Add notes about recommendation..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};