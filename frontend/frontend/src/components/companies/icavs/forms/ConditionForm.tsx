import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

export const ConditionForm = () => {
  const { formData, updateFormData } = useForm();
  const [conditionData, setConditionData] = useState({
    body: formData.condition?.body || 'Good',
    paint: formData.condition?.paint || 'Good',
    specializedPaint: formData.condition?.specializedPaint || '',
    doorUpholstery: formData.condition?.doorUpholstery || 'Good',
    seatTrim: formData.condition?.seatTrim || 'Good',
    previousDamage: formData.previousDamage || '',
    previousRepairs: formData.previousRepairs || '',
    generalRemarks: formData.generalRemarks || '',
  });

  const conditionOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConditionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    updateFormData({
      condition: {
        body: conditionData.body,
        paint: conditionData.paint,
        specializedPaint: conditionData.specializedPaint,
        doorUpholstery: conditionData.doorUpholstery,
        seatTrim: conditionData.seatTrim,
      },
      previousDamage: conditionData.previousDamage,
      previousRepairs: conditionData.previousRepairs,
      generalRemarks: conditionData.generalRemarks,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Vehicle Condition Prior to Loss</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Body Condition"
              name="body"
              value={conditionData.body}
              onChange={handleChange}
              options={conditionOptions}
            />
            
            <Select
              label="Paint Condition"
              name="paint"
              value={conditionData.paint}
              onChange={handleChange}
              options={conditionOptions}
            />
          </div>
          
          <Input
            label="Specialized Paint"
            name="specializedPaint"
            value={conditionData.specializedPaint}
            onChange={handleChange}
            placeholder="e.g. Metallic"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Door/Upholstery"
              name="doorUpholstery"
              value={conditionData.doorUpholstery}
              onChange={handleChange}
              options={conditionOptions}
            />
            
            <Select
              label="Seat Trim (Front & Rear)"
              name="seatTrim"
              value={conditionData.seatTrim}
              onChange={handleChange}
              options={conditionOptions}
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="previousDamage" className="block text-sm font-medium text-secondary-700">
              Previous Damage
            </label>
            <textarea
              id="previousDamage"
              name="previousDamage"
              value={conditionData.previousDamage}
              onChange={handleChange}
              rows={2}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="e.g. Right apron (Dent), Front bumper - (Scratches)"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="previousRepairs" className="block text-sm font-medium text-secondary-700">
              Previous Repairs
            </label>
            <textarea
              id="previousRepairs"
              name="previousRepairs"
              value={conditionData.previousRepairs}
              onChange={handleChange}
              rows={2}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="e.g. None visible"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="generalRemarks" className="block text-sm font-medium text-secondary-700">
              General Remarks on Vehicle Condition
            </label>
            <textarea
              id="generalRemarks"
              name="generalRemarks"
              value={conditionData.generalRemarks}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Add general remarks on vehicle"
            />
          </div>

          <NotesTextbox section="condition" placeholder="Add notes about vehicle condition..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};