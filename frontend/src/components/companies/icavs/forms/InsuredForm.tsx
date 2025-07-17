import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

export const InsuredForm = () => {
  const { formData, updateFormData } = useForm();
  const [insured, setInsured] = useState(formData.insured || '');
  const [thirdParty, setThirdParty] = useState(formData.thirdParty || '');

  const handleInsuredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsured(e.target.value);
  };

  const handleThirdPartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThirdParty(e.target.value);
  };

  const handleSubmit = () => {
    updateFormData({ insured, thirdParty });
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
            value={insured}
            onChange={handleInsuredChange}
          />
          
          <Input
            label="Third Party"
            name="thirdParty"
            value={thirdParty}
            onChange={handleThirdPartyChange}
            placeholder="Add third party name if applicable"
          />
          
          <NotesTextbox section="insured" placeholder="Add notes about client details..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};