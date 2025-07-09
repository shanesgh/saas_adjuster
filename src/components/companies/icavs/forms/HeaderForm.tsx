import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

export const HeaderForm = () => {
  const { formData, updateFormData } = useForm();
  const [formState, setFormState] = useState({
    letterDate: formData.letterDate || '',
    recipientName: formData.recipient?.name || '',
    recipientAddress: formData.recipient?.address || '',
    dateReceived: formData.dateReceived || '',
    yourRef: formData.yourRef || '',
    dateInspected: formData.dateInspected || '',
    ourRef: formData.ourRef || '',
    dateOfLoss: formData.dateOfLoss || '',
    invoice: formData.invoice || '',
    numberOfPhotographs: formData.numberOfPhotographs || 0,
    witness: formData.witness || '',
    placeOfInspection: formData.placeOfInspection || '',
    claimsTechnician: formData.claimsTechnician || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert to number if the input type is number
    const parsedValue = type === 'number' ? parseInt(value) || 0 : value;
    
    setFormState((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = () => {
    updateFormData({
      letterDate: formState.letterDate,
      recipient: {
        name: formState.recipientName,
        address: formState.recipientAddress,
      },
      dateReceived: formState.dateReceived,
      yourRef: formState.yourRef,
      dateInspected: formState.dateInspected,
      ourRef: formState.ourRef,
      dateOfLoss: formState.dateOfLoss,
      invoice: formState.invoice,
      numberOfPhotographs: formState.numberOfPhotographs,
      witness: formState.witness,
      placeOfInspection: formState.placeOfInspection,
      claimsTechnician: formState.claimsTechnician,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Assignment Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Letter Date"
              type="date"
              name="letterDate"
              value={formState.letterDate}
              onChange={handleChange}
            />
            
            <Input
              label="Recipient Name"
              name="recipientName"
              value={formState.recipientName}
              onChange={handleChange}
            />
          </div>
          
          <Input
            label="Recipient Address"
            name="recipientAddress"
            value={formState.recipientAddress}
            onChange={handleChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date Received"
              type="date"
              name="dateReceived"
              value={formState.dateReceived}
              onChange={handleChange}
            />
            <Input
              label="Your Reference"
              name="yourRef"
              value={formState.yourRef}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date Inspected"
              type="date"
              name="dateInspected"
              value={formState.dateInspected}
              onChange={handleChange}
            />
            <Input
              label="Our Reference"
              name="ourRef"
              value={formState.ourRef}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Loss"
              type="date"
              name="dateOfLoss"
              value={formState.dateOfLoss}
              onChange={handleChange}
            />
            <Input
              label="Invoice #"
              name="invoice"
              value={formState.invoice}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Number of Photographs"
              type="number"
              name="numberOfPhotographs"
              value={formState.numberOfPhotographs}
              onChange={handleChange}
            />
            <Input
              label="Witness"
              name="witness"
              value={formState.witness}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Place of Inspection"
              name="placeOfInspection"
              value={formState.placeOfInspection}
              onChange={handleChange}
            />
            <Input
              label="Claims Technician"
              name="claimsTechnician"
              value={formState.claimsTechnician}
              onChange={handleChange}
            />
          </div>
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};