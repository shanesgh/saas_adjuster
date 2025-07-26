import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

export const HeaderForm = () => {
  const { formData, updateFormData } = useForm();
  
  const recipientOptions = [
    { name: 'General Accident Insurance Company (Trinidad and Tobago) Limited', address: '36A Ariapita Avenue, Woodbrook, Port of Spain' },
    { name: 'Guardian General Insurance Limited', address: '30–34 Maraval Road, Newtown Centre, Port of Spain' },
    { name: 'Gulf Insurance Limited', address: '1 Gray Street, St Clair, Port of Spain' },
    { name: 'Maritime General Insurance Company Limited', address: 'Maritime Centre, 29 Tenth Avenue, Barataria' },
    { name: 'Nagico Insurance Company (Trinidad and Tobago) Limited', address: '95–97 Queen Janelle Commissiong Street, Port of Spain' },
    { name: 'Sagicor General Insurance Trinidad & Tobago Limited', address: '122 St. Vincent Street, Port of Spain' },
    { name: 'The Beacon Insurance Company Limited', address: '13 Stanmore Avenue, Port of Spain' },
    { name: 'The Insurance Company of the West Indies (Trinidad) Limited', address: '13 Gray Street, St Clair, Port of Spain' },
    { name: 'The New India Assurance Company (Trinidad and Tobago) Limited', address: '6A Victoria Avenue, Port of Spain' },
    { name: 'The Presidential Insurance Company Limited', address: '54 Richmond Street, Port of Spain' },
    { name: 'Trinidad and Tobago Insurance Limited (TATIL)', address: 'TATIL Building, 11A Maraval Road, Port of Spain' },
    { name: 'TRINRE Insurance Company Limited', address: '69 Edward Street, Port of Spain' },
    { name: 'Bankers Insurance Company of Trinidad and Tobago Limited', address: '#40 Main Road, Chaguanas' },
    { name: 'Capital Insurance Limited', address: '38–42 Cipero Street, San Fernando' },
    { name: 'CG United Insurance TT Limited', address: '2nd Floor, Princes Court, 13–17 Keate Street, Port of Spain' },
    { name: 'Colonial Fire and General Insurance Company Limited (COLFIRE)', address: 'Corner Duke & Abercromby Streets, Port of Spain' },
  ];
  
  const [formState, setFormState] = useState({
    letterDate: formData.letterDate || '',
    recipientName: formData.recipient?.name || '',
    customRecipientName: '',
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

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedRecipient = recipientOptions.find(r => r.name === selectedName);
    
    setFormState((prev) => ({
      ...prev,
      recipientName: selectedName,
      recipientAddress: selectedName === 'custom' ? 'Custom address' : (selectedRecipient?.address || ''),
    }));
  };

  const handleSubmit = () => {
    updateFormData({
      letterDate: formState.letterDate,
      recipient: {
        name: formState.recipientName === 'custom' ? formState.customRecipientName : formState.recipientName,
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
            
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-secondary-700 mb-2">
                Recipient Name
              </label>
              <select
                name="recipientName"
                value={formState.recipientName}
                onChange={handleRecipientChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors border-gray-300"
              >
                <option value="">Select recipient...</option>
                {recipientOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {formState.recipientName === 'custom' && (
                <input
                  type="text"
                  name="customRecipientName"
                  value={formState.customRecipientName}
                  onChange={handleChange}
                  placeholder="Enter custom recipient name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors border-gray-300 mt-2"
                />
              )}
            </div>
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
          
          <NotesTextbox section="header" placeholder="Add notes about assignment information..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};