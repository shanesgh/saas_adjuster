import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

const vehicleTypes = [
  { value: 'car', label: 'Car (4 tyres)' },
  { value: 'motorcycle', label: 'Motorcycle (2 tyres)' },
  { value: 'truck', label: 'Truck (6-8 tyres)' },
  { value: 'custom', label: 'Custom' },
];

const conditionOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

const getDefaultTyres = (type) => {
  const defaults = {
    car: ['Right Front', 'Left Front', 'Right Rear', 'Left Rear'],
    motorcycle: ['Front', 'Rear'],
    truck: ['Right Front', 'Left Front', 'Right Middle', 'Left Middle', 'Right Rear', 'Left Rear'],
  };
  return defaults[type]?.map(position => ({
    position,
    make: '',
    size: '',
    treadDepth: '',
    condition: 'Good'
  })) || [];
};

export const TyresForm = () => {
  const { formData, updateFormData } = useForm();
  const [vehicleType, setVehicleType] = useState('car');
  const [tyres, setTyres] = useState(() => 
    formData.tyres ? Object.entries(formData.tyres).map(([key, value]) => ({
      position: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      ...value
    })) : getDefaultTyres('car')
  );

  const handleVehicleTypeChange = (e) => {
    const newType = e.target.value;
    setVehicleType(newType);
    if (newType !== 'custom') {
      setTyres(getDefaultTyres(newType));
    }
  };

  const handleTyreChange = (index, field, value) => {
    setTyres(prev => prev.map((tyre, i) => 
      i === index ? { ...tyre, [field]: value } : tyre
    ));
  };

  const addCustomTyre = () => {
    setTyres(prev => [...prev, { position: '', make: '', size: '', treadDepth: '', condition: 'Good' }]);
  };

  const removeTyre = (index) => {
    setTyres(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const tyresData = tyres.reduce((acc, tyre) => {
      const key = tyre.position.toLowerCase().replace(/\s+/g, '');
      if (key) acc[key] = { make: tyre.make, size: tyre.size, treadDepth: tyre.treadDepth, condition: tyre.condition };
      return acc;
    }, {});
    updateFormData({ tyres: tyresData });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Tyre Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Select
            label="Vehicle Type"
            value={vehicleType}
            onChange={handleVehicleTypeChange}
            options={vehicleTypes}
          />

          {tyres.map((tyre, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {vehicleType === 'custom' ? `Tyre ${index + 1}` : tyre.position}
                </h3>
                {vehicleType === 'custom' && (
                  <button
                    type="button"
                    onClick={() => removeTyre(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicleType === 'custom' && (
                  <Input
                    label="Position"
                    value={tyre.position}
                    onChange={(e) => handleTyreChange(index, 'position', e.target.value)}
                    placeholder="e.g. Front Left"
                  />
                )}
                <Input
                  label="Make"
                  value={tyre.make}
                  onChange={(e) => handleTyreChange(index, 'make', e.target.value)}
                  placeholder="e.g. Michelin"
                />
                <Input
                  label="Size"
                  value={tyre.size}
                  onChange={(e) => handleTyreChange(index, 'size', e.target.value)}
                  placeholder="e.g. 185/65R15"
                />
                <Input
                  label="Tread Depth"
                  value={tyre.treadDepth}
                  onChange={(e) => handleTyreChange(index, 'treadDepth', e.target.value)}
                  placeholder="e.g. 7mm"
                />
                <Select
                  label="Condition"
                  value={tyre.condition}
                  onChange={(e) => handleTyreChange(index, 'condition', e.target.value)}
                  options={conditionOptions}
                />
              </div>
            </div>
          ))}

          {vehicleType === 'custom' && (
            <button
              type="button"
              onClick={addCustomTyre}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Add Tyre
            </button>
          )}
          
          <NotesTextbox section="tyres" placeholder="Add notes about tyre information..." />

          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};