import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { FormNavigation } from '../FormNavigation';

export const InsuredForm = () => {
  const { formData, updateFormData } = useForm();
  const [insured, setInsured] = useState(formData.insured || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsured(e.target.value);
  };

  const handleSubmit = () => {
    updateFormData({ insured });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Insured Details</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Insured"
            name="insured"
            value={insured}
            onChange={handleChange}
          />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};