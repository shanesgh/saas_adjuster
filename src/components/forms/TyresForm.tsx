import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { FormNavigation } from '../FormNavigation';

export const TyresForm = () => {
  const { formData, updateFormData } = useForm();
  const [tyresData, setTyresData] = useState({
    rightFront: {
      make: formData.tyres?.rightFront.make || '',
      size: formData.tyres?.rightFront.size || '',
      treadDepth: formData.tyres?.rightFront.treadDepth || '',
      condition: formData.tyres?.rightFront.condition || 'Good',
    },
    leftFront: {
      make: formData.tyres?.leftFront.make || '',
      size: formData.tyres?.leftFront.size || '',
      treadDepth: formData.tyres?.leftFront.treadDepth || '',
      condition: formData.tyres?.leftFront.condition || 'Good',
    },
    rightRear: {
      make: formData.tyres?.rightRear.make || '',
      size: formData.tyres?.rightRear.size || '',
      treadDepth: formData.tyres?.rightRear.treadDepth || '',
      condition: formData.tyres?.rightRear.condition || 'Good',
    },
    leftRear: {
      make: formData.tyres?.leftRear.make || '',
      size: formData.tyres?.leftRear.size || '',
      treadDepth: formData.tyres?.leftRear.treadDepth || '',
      condition: formData.tyres?.leftRear.condition || 'Good',
    },
  });

  const conditionOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' },
  ];

  const handleChange = (
    tyre: 'rightFront' | 'leftFront' | 'rightRear' | 'leftRear',
    field: 'make' | 'size' | 'treadDepth' | 'condition',
    value: string
  ) => {
    setTyresData((prev) => ({
      ...prev,
      [tyre]: {
        ...prev[tyre],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    updateFormData({ tyres: tyresData });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Tyre Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Right Front Tyre */}
          <div>
            <h3 className="text-lg font-medium mb-2">Right Front Tyre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Make"
                value={tyresData.rightFront.make}
                onChange={(e) => handleChange('rightFront', 'make', e.target.value)}
                placeholder="e.g. Roadstone"
              />
              
              <Input
                label="Size"
                value={tyresData.rightFront.size}
                onChange={(e) => handleChange('rightFront', 'size', e.target.value)}
                placeholder="e.g. 185/65R15"
              />
              
              <Input
                label="Tread Depth"
                value={tyresData.rightFront.treadDepth}
                onChange={(e) => handleChange('rightFront', 'treadDepth', e.target.value)}
                placeholder="e.g. 7mm"
              />
              
              <Select
                label="Condition"
                value={tyresData.rightFront.condition}
                onChange={(e) => handleChange('rightFront', 'condition', e.target.value)}
                options={conditionOptions}
              />
            </div>
          </div>
          
          {/* Left Front Tyre */}
          <div>
            <h3 className="text-lg font-medium mb-2">Left Front Tyre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Make"
                value={tyresData.leftFront.make}
                onChange={(e) => handleChange('leftFront', 'make', e.target.value)}
                placeholder="e.g. Roadstone"
              />
              
              <Input
                label="Size"
                value={tyresData.leftFront.size}
                onChange={(e) => handleChange('leftFront', 'size', e.target.value)}
                placeholder="e.g. 185/65R15"
              />
              
              <Input
                label="Tread Depth"
                value={tyresData.leftFront.treadDepth}
                onChange={(e) => handleChange('leftFront', 'treadDepth', e.target.value)}
                placeholder="e.g. 7mm"
              />
              
              <Select
                label="Condition"
                value={tyresData.leftFront.condition}
                onChange={(e) => handleChange('leftFront', 'condition', e.target.value)}
                options={conditionOptions}
              />
            </div>
          </div>
          
          {/* Right Rear Tyre */}
          <div>
            <h3 className="text-lg font-medium mb-2">Right Rear Tyre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Make"
                value={tyresData.rightRear.make}
                onChange={(e) => handleChange('rightRear', 'make', e.target.value)}
                placeholder="e.g. Dunlop"
              />
              
              <Input
                label="Size"
                value={tyresData.rightRear.size}
                onChange={(e) => handleChange('rightRear', 'size', e.target.value)}
                placeholder="e.g. 175/65R15"
              />
              
              <Input
                label="Tread Depth"
                value={tyresData.rightRear.treadDepth}
                onChange={(e) => handleChange('rightRear', 'treadDepth', e.target.value)}
                placeholder="e.g. 5mm"
              />
              
              <Select
                label="Condition"
                value={tyresData.rightRear.condition}
                onChange={(e) => handleChange('rightRear', 'condition', e.target.value)}
                options={conditionOptions}
              />
            </div>
          </div>
          
          {/* Left Rear Tyre */}
          <div>
            <h3 className="text-lg font-medium mb-2">Left Rear Tyre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Make"
                value={tyresData.leftRear.make}
                onChange={(e) => handleChange('leftRear', 'make', e.target.value)}
                placeholder="e.g. Dunlop"
              />
              
              <Input
                label="Size"
                value={tyresData.leftRear.size}
                onChange={(e) => handleChange('leftRear', 'size', e.target.value)}
                placeholder="e.g. 175/65R15"
              />
              
              <Input
                label="Tread Depth"
                value={tyresData.leftRear.treadDepth}
                onChange={(e) => handleChange('leftRear', 'treadDepth', e.target.value)}
                placeholder="e.g. 5mm"
              />
              
              <Select
                label="Condition"
                value={tyresData.leftRear.condition}
                onChange={(e) => handleChange('leftRear', 'condition', e.target.value)}
                options={conditionOptions}
              />
            </div>
          </div>
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};