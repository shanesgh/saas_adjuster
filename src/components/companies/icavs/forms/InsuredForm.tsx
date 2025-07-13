import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

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
        <h2 className="text-xl font-semibold">Client Details</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Client Name"
            name="insured"
            value={formState.insured}
            onChange={handleChange}
          />
          
          <Input
            label="Third Party"
            name="thirdParty"
            value={formState.thirdParty}
            onChange={handleChange}
            placeholder="Add third party name if applicable"
          />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};