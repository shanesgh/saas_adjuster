import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

export const FeaturesForm = () => {
  const { formData, updateFormData } = useForm();
  const [features, setFeatures] = useState({
    antiTheftDevice: formData.features?.antiTheftDevice || false,
    hubCaps: formData.features?.hubCaps || false,
    airCondition: formData.features?.airCondition || false,
    powerWindows: formData.features?.powerWindows || false,
    powerMirror: formData.features?.powerMirror || false,
    foldingWingMirrors: formData.features?.foldingWingMirrors || false,
    driverPassengerAirbags: formData.features?.driverPassengerAirbags || false,
    radio: formData.features?.radio || false,
    cdDeck: formData.features?.cdDeck || false,
    displayScreen: formData.features?.displayScreen || false,
    multifunctionalSteeringWheel: formData.features?.multifunctionalSteeringWheel || false,
    fogLamps: formData.features?.fogLamps || false,
    rearCamera: formData.features?.rearCamera || false,
    tractionControl: formData.features?.tractionControl || false,
    absBrakingSystem: formData.features?.absBrakingSystem || false,
    rearWiper: formData.features?.rearWiper || false,
    ecoMode: formData.features?.ecoMode || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    updateFormData({ features });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Vehicle Features</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <Checkbox
              id="antiTheftDevice"
              name="antiTheftDevice"
              label="Anti-Theft Device: Factory Immobilizer"
              checked={features.antiTheftDevice}
              onChange={handleChange}
            />
            
            <Checkbox
              id="hubCaps"
              name="hubCaps"
              label="Hub Caps/Steel Rims: 15''"
              checked={features.hubCaps}
              onChange={handleChange}
            />
            
            <Checkbox
              id="airCondition"
              name="airCondition"
              label="Air Condition"
              checked={features.airCondition}
              onChange={handleChange}
            />
            
            <Checkbox
              id="powerWindows"
              name="powerWindows"
              label="Power Windows"
              checked={features.powerWindows}
              onChange={handleChange}
            />
            
            <Checkbox
              id="powerMirror"
              name="powerMirror"
              label="Power Mirror"
              checked={features.powerMirror}
              onChange={handleChange}
            />
            
            <Checkbox
              id="foldingWingMirrors"
              name="foldingWingMirrors"
              label="Folding Wing Mirrors with Indicators"
              checked={features.foldingWingMirrors}
              onChange={handleChange}
            />
            
            <Checkbox
              id="driverPassengerAirbags"
              name="driverPassengerAirbags"
              label="Driver & Passenger Air Bags"
              checked={features.driverPassengerAirbags}
              onChange={handleChange}
            />
            
            <Checkbox
              id="radio"
              name="radio"
              label="Radio"
              checked={features.radio}
              onChange={handleChange}
            />
            
            <Checkbox
              id="cdDeck"
              name="cdDeck"
              label="CD Deck"
              checked={features.cdDeck}
              onChange={handleChange}
            />
            
            <Checkbox
              id="displayScreen"
              name="displayScreen"
              label="Display Screen"
              checked={features.displayScreen}
              onChange={handleChange}
            />
            
            <Checkbox
              id="multifunctionalSteeringWheel"
              name="multifunctionalSteeringWheel"
              label="Multifunctional Steering Wheel"
              checked={features.multifunctionalSteeringWheel}
              onChange={handleChange}
            />
            
            <Checkbox
              id="fogLamps"
              name="fogLamps"
              label="Fog Lamps"
              checked={features.fogLamps}
              onChange={handleChange}
            />
            
            <Checkbox
              id="rearCamera"
              name="rearCamera"
              label="Rear Camera"
              checked={features.rearCamera}
              onChange={handleChange}
            />
            
            <Checkbox
              id="tractionControl"
              name="tractionControl"
              label="Traction Control"
              checked={features.tractionControl}
              onChange={handleChange}
            />
            
            <Checkbox
              id="absBrakingSystem"
              name="absBrakingSystem"
              label="ABS Braking System"
              checked={features.absBrakingSystem}
              onChange={handleChange}
            />
            
            <Checkbox
              id="rearWiper"
              name="rearWiper"
              label="Rear Wiper"
              checked={features.rearWiper}
              onChange={handleChange}
            />
            
            <Checkbox
              id="ecoMode"
              name="ecoMode"
              label="Eco Mode"
              checked={features.ecoMode}
              onChange={handleChange}
            />
          </div>
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};