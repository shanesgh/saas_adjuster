import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

export const VehicleForm = () => {
  const { formData, updateFormData } = useForm();
  const [vehicleData, setVehicleData] = useState({
    makeAndModel: formData.vehicle?.makeAndModel || '',
    isAutomatic: formData.vehicle?.isAutomatic || false,
    isGasolene: formData.vehicle?.isGasolene || false,
    isHybridElectric: formData.vehicle?.isHybridElectric || false,
    registration: formData.vehicle?.registration || '',
    yearOfManufacture: formData.vehicle?.yearOfManufacture || '',
    color: formData.vehicle?.color || '',
    odometer: formData.vehicle?.odometer || '',
    vinChassis: formData.vehicle?.identification?.vinChassis || '',
    engine: formData.vehicle?.identification?.engine || '',
    isForeignUsed: formData.vehicle?.isForeignUsed || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    updateFormData({
      vehicle: {
        makeAndModel: vehicleData.makeAndModel,
        isAutomatic: vehicleData.isAutomatic,
        isGasolene: vehicleData.isGasolene,
        isHybridElectric: vehicleData.isHybridElectric,
        registration: vehicleData.registration,
        yearOfManufacture: vehicleData.yearOfManufacture,
        color: vehicleData.color,
        odometer: vehicleData.odometer,
        identification: {
          vinChassis: vehicleData.vinChassis,
          engine: vehicleData.engine,
        },
        isForeignUsed: vehicleData.isForeignUsed,
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Vehicle Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Make & Model"
            name="makeAndModel"
            value={vehicleData.makeAndModel}
            onChange={handleChange}
            placeholder="e.g. Toyota Aqua 3 Hatchback"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Checkbox
              id="isAutomatic"
              name="isAutomatic"
              label="Automatic"
              checked={vehicleData.isAutomatic}
              onChange={handleChange}
            />
            
            <Checkbox
              id="isGasolene"
              name="isGasolene"
              label="Gasolene"
              checked={vehicleData.isGasolene}
              onChange={handleChange}
            />
            
            <Checkbox
              id="isHybridElectric"
              name="isHybridElectric"
              label="Hybrid Electric"
              checked={vehicleData.isHybridElectric}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registration Number"
              name="registration"
              value={vehicleData.registration}
              onChange={handleChange}
              placeholder="e.g. PDX-7167"
            />
            
            <Input
              label="Year of Manufacture"
              name="yearOfManufacture"
              value={vehicleData.yearOfManufacture}
              onChange={handleChange}
              placeholder="e.g. 2016"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Color"
              name="color"
              value={vehicleData.color}
              onChange={handleChange}
              placeholder="e.g. Blue"
            />
            
            <Input
              label="Odometer Reading"
              name="odometer"
              value={vehicleData.odometer}
              onChange={handleChange}
              placeholder="e.g. 67,614 Kms"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="VIN/Chassis Number"
              name="vinChassis"
              value={vehicleData.vinChassis}
              onChange={handleChange}
              placeholder="e.g. NHP10-6500472"
            />
            
            <Input
              label="Engine Number"
              name="engine"
              value={vehicleData.engine}
              onChange={handleChange}
              placeholder="e.g. 1NZ7898389"
            />
          </div>
          
          <Checkbox
            id="isForeignUsed"
            name="isForeignUsed"
            label="Foreign Used"
            checked={vehicleData.isForeignUsed}
            onChange={handleChange}
          />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};