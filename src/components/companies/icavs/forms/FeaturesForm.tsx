import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

interface CustomFeature {
  name: string;
  checked: boolean;
}

interface FeatureConfig {
  key: string;
  label: string;
}

const PREDEFINED_FEATURES: FeatureConfig[] = [
  { key: 'antiTheftDevice', label: 'Anti-Theft Device: Factory Immobilizer' },
  { key: 'hubCaps', label: 'Hub Caps/Steel Rims: 15"' },
  { key: 'airCondition', label: 'Air Condition' },
  { key: 'powerWindows', label: 'Power Windows' },
  { key: 'powerMirror', label: 'Power Mirror' },
  { key: 'foldingWingMirrors', label: 'Folding Wing Mirrors with Indicators' },
  { key: 'driverPassengerAirbags', label: 'Driver & Passenger Air Bags' },
  { key: 'radio', label: 'Radio' },
  { key: 'cdDeck', label: 'CD Deck' },
  { key: 'displayScreen', label: 'Display Screen' },
  { key: 'multifunctionalSteeringWheel', label: 'Multifunctional Steering Wheel' },
  { key: 'fogLamps', label: 'Fog Lamps' },
  { key: 'rearCamera', label: 'Rear Camera' },
  { key: 'tractionControl', label: 'Traction Control' },
  { key: 'absBrakingSystem', label: 'ABS Braking System' },
  { key: 'rearWiper', label: 'Rear Wiper' },
  { key: 'ecoMode', label: 'Eco Mode' },
];

export const FeaturesForm = () => {
  const { formData, updateFormData } = useForm();
  
  // Initialize features state using reduce for better performance
  const [features, setFeatures] = useState(() => {
    return PREDEFINED_FEATURES.reduce((acc, feature) => {
      acc[feature.key] = formData.features?.[feature.key] || false;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const [customFeatures, setCustomFeatures] = useState<CustomFeature[]>(
    formData.features?.customFeatures || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addCustomFeature = () => {
    setCustomFeatures((prev) => [...prev, { name: '', checked: false }]);
  };

  const updateCustomFeature = (index: number, field: keyof CustomFeature, value: string | boolean) => {
    setCustomFeatures((prev) => 
      prev.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    );
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    updateFormData({ 
      features: {
        ...features,
        customFeatures: customFeatures.filter(f => f.name.trim() !== '')
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Vehicle Features</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* All Features in unified grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            {/* Predefined Features */}
            {PREDEFINED_FEATURES.map((feature) => (
              <Checkbox
                key={feature.key}
                id={feature.key}
                name={feature.key}
                label={feature.label}
                checked={features[feature.key]}
                onChange={handleChange}
              />
            ))}
            
            {/* Custom Features - Now in the same grid */}
            {customFeatures.map((feature, index) => (
              <div key={`custom-${index}`} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={feature.checked}
                  onChange={(e) => updateCustomFeature(index, 'checked', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
                  placeholder="Enter feature name"
                  className="w-full sm:w-48 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeCustomFeature(index)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold leading-none flex-shrink-0"
                  title="Remove feature"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addCustomFeature}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium underline"
          >
            + Add Custom Feature
          </button>
          
          <NotesTextbox section="features" placeholder="Add notes about vehicle features..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};
