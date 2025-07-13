import { useState } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

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
                  className="w-full sm:w-48 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};

// import { useState } from 'react';
// import { useForm } from '../../../../context/companies/icavs/FormContext';
// import { Checkbox } from '../../../ui/checkbox';
// import { Card, CardContent, CardHeader } from '../../../ui/card';
// import { FormNavigation } from '../navigation/FormNavigation';

// interface CustomFeature {
//   name: string;
//   checked: boolean;
// }

// interface FeatureConfig {
//   key: string;
//   label: string;
// }

// const PREDEFINED_FEATURES: FeatureConfig[] = [
//   { key: 'antiTheftDevice', label: 'Anti-Theft Device: Factory Immobilizer' },
//   { key: 'hubCaps', label: 'Hub Caps/Steel Rims: 15"' },
//   { key: 'airCondition', label: 'Air Condition' },
//   { key: 'powerWindows', label: 'Power Windows' },
//   { key: 'powerMirror', label: 'Power Mirror' },
//   { key: 'foldingWingMirrors', label: 'Folding Wing Mirrors with Indicators' },
//   { key: 'driverPassengerAirbags', label: 'Driver & Passenger Air Bags' },
//   { key: 'radio', label: 'Radio' },
//   { key: 'cdDeck', label: 'CD Deck' },
//   { key: 'displayScreen', label: 'Display Screen' },
//   { key: 'multifunctionalSteeringWheel', label: 'Multifunctional Steering Wheel' },
//   { key: 'fogLamps', label: 'Fog Lamps' },
//   { key: 'rearCamera', label: 'Rear Camera' },
//   { key: 'tractionControl', label: 'Traction Control' },
//   { key: 'absBrakingSystem', label: 'ABS Braking System' },
//   { key: 'rearWiper', label: 'Rear Wiper' },
//   { key: 'ecoMode', label: 'Eco Mode' },
// ];

// export const FeaturesForm = () => {
//   const { formData, updateFormData } = useForm();
  
//   // Initialize features state using reduce for better performance
//   const [features, setFeatures] = useState(() => {
//     return PREDEFINED_FEATURES.reduce((acc, feature) => {
//       acc[feature.key] = formData.features?.[feature.key] || false;
//       return acc;
//     }, {} as Record<string, boolean>);
//   });

//   const [customFeatures, setCustomFeatures] = useState<CustomFeature[]>(
//     formData.features?.customFeatures || []
//   );

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFeatures((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const addCustomFeature = () => {
//     setCustomFeatures((prev) => [...prev, { name: '', checked: false }]);
//   };

//   const updateCustomFeature = (index: number, field: keyof CustomFeature, value: string | boolean) => {
//     setCustomFeatures((prev) => 
//       prev.map((feature, i) => 
//         i === index ? { ...feature, [field]: value } : feature
//       )
//     );
//   };

//   const removeCustomFeature = (index: number) => {
//     setCustomFeatures((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = () => {
//     updateFormData({ 
//       features: {
//         ...features,
//         customFeatures: customFeatures.filter(f => f.name.trim() !== '')
//       }
//     });
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <h2 className="text-xl font-semibold">Vehicle Features</h2>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Predefined Features */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
//             {PREDEFINED_FEATURES.map((feature) => (
//               <Checkbox
//                 key={feature.key}
//                 id={feature.key}
//                 name={feature.key}
//                 label={feature.label}
//                 checked={features[feature.key]}
//                 onChange={handleChange}
//               />
//             ))}
//           </div>
          
//           {/* Custom Features - Integrated with predefined features */}
//           {customFeatures.map((feature, index) => (
//             <div key={`custom-${index}`} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={feature.checked}
//                 onChange={(e) => updateCustomFeature(index, 'checked', e.target.checked)}
//                 className="h-4 w-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
//               />
//               <input
//                 type="text"
//                 value={feature.name}
//                 onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
//                 placeholder="Enter feature name"
//                 className="flex-1 text-sm text-secondary-900"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeCustomFeature(index)}
//                 className="text-red-500 hover:text-red-700 text-sm font-bold w-4 h-4 flex items-center justify-center"
//                 title="Remove feature"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
          
//           <button
//             type="button"
//             onClick={addCustomFeature}
//             className="text-primary-500 hover:text-primary-700 text-sm underline"
//           >
//             + Add Custom Feature
//           </button>
          
//           <FormNavigation onSubmit={handleSubmit} />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };



// // import { useState } from 'react';
// // import { useForm } from '../../../../context/companies/icavs/FormContext';
// // import { Checkbox } from '../../../ui/checkbox';
// // import { Card, CardContent, CardHeader } from '../../../ui/card';
// // import { FormNavigation } from '../navigation/FormNavigation';

// // interface CustomFeature {
// //   name: string;
// //   checked: boolean;
// // }

// // interface FeatureConfig {
// //   key: string;
// //   label: string;
// // }

// // const PREDEFINED_FEATURES: FeatureConfig[] = [
// //   { key: 'antiTheftDevice', label: 'Anti-Theft Device: Factory Immobilizer' },
// //   { key: 'hubCaps', label: 'Hub Caps/Steel Rims: 15"' },
// //   { key: 'airCondition', label: 'Air Condition' },
// //   { key: 'powerWindows', label: 'Power Windows' },
// //   { key: 'powerMirror', label: 'Power Mirror' },
// //   { key: 'foldingWingMirrors', label: 'Folding Wing Mirrors with Indicators' },
// //   { key: 'driverPassengerAirbags', label: 'Driver & Passenger Air Bags' },
// //   { key: 'radio', label: 'Radio' },
// //   { key: 'cdDeck', label: 'CD Deck' },
// //   { key: 'displayScreen', label: 'Display Screen' },
// //   { key: 'multifunctionalSteeringWheel', label: 'Multifunctional Steering Wheel' },
// //   { key: 'fogLamps', label: 'Fog Lamps' },
// //   { key: 'rearCamera', label: 'Rear Camera' },
// //   { key: 'tractionControl', label: 'Traction Control' },
// //   { key: 'absBrakingSystem', label: 'ABS Braking System' },
// //   { key: 'rearWiper', label: 'Rear Wiper' },
// //   { key: 'ecoMode', label: 'Eco Mode' },
// // ];

// // export const FeaturesForm = () => {
// //   const { formData, updateFormData } = useForm();
  
// //   // Initialize features state using reduce for better performance
// //   const [features, setFeatures] = useState(() => {
// //     return PREDEFINED_FEATURES.reduce((acc, feature) => {
// //       acc[feature.key] = formData.features?.[feature.key] || false;
// //       return acc;
// //     }, {} as Record<string, boolean>);
// //   });

// //   const [customFeatures, setCustomFeatures] = useState<CustomFeature[]>(
// //     formData.features?.customFeatures || []
// //   );

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, checked } = e.target;
// //     setFeatures((prev) => ({
// //       ...prev,
// //       [name]: checked,
// //     }));
// //   };

// //   const addCustomFeature = () => {
// //     setCustomFeatures((prev) => [...prev, { name: '', checked: false }]);
// //   };

// //   const updateCustomFeature = (index: number, field: keyof CustomFeature, value: string | boolean) => {
// //     setCustomFeatures((prev) => 
// //       prev.map((feature, i) => 
// //         i === index ? { ...feature, [field]: value } : feature
// //       )
// //     );
// //   };

// //   const removeCustomFeature = (index: number) => {
// //     setCustomFeatures((prev) => prev.filter((_, i) => i !== index));
// //   };

// //   const handleSubmit = () => {
// //     updateFormData({ 
// //       features: {
// //         ...features,
// //         customFeatures: customFeatures.filter(f => f.name.trim() !== '')
// //       }
// //     });
// //   };

// //   return (
// //     <Card className="w-full">
// //       <CardHeader>
// //         <h2 className="text-xl font-semibold">Vehicle Features</h2>
// //       </CardHeader>
// //       <CardContent>
// //         <div className="space-y-4">
// //           {/* Predefined Features */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
// //             {PREDEFINED_FEATURES.map((feature) => (
// //               <Checkbox
// //                 key={feature.key}
// //                 id={feature.key}
// //                 name={feature.key}
// //                 label={feature.label}
// //                 checked={features[feature.key]}
// //                 onChange={handleChange}
// //               />
// //             ))}
// //           </div>
          
// //           {/* Custom Features Section */}
// //           {customFeatures.length > 0 && (
// //             <div className="mt-6">
// //               <h3 className="text-lg font-medium mb-3">Custom Features</h3>
// //               <div className="space-y-2">
// //                 {customFeatures.map((feature, index) => (
// //                   <div key={index} className="flex items-center space-x-2">
// //                     <input
// //                       type="text"
// //                       value={feature.name}
// //                       onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
// //                       placeholder="Enter feature name"
// //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                     <input
// //                       type="checkbox"
// //                       checked={feature.checked}
// //                       onChange={(e) => updateCustomFeature(index, 'checked', e.target.checked)}
// //                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => removeCustomFeature(index)}
// //                       className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
          
// //           <button
// //             type="button"
// //             onClick={addCustomFeature}
// //             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
// //           >
// //             Add Custom Feature
// //           </button>
          
// //           <FormNavigation onSubmit={handleSubmit} />
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };
// // // import { useState } from 'react';
// // // import { useForm } from '../../../../context/companies/icavs/FormContext';
// // // import { Checkbox } from '../../../ui/checkbox';
// // // import { Card, CardContent, CardHeader } from '../../../ui/card';
// // // import { FormNavigation } from '../navigation/FormNavigation';

// // // export const FeaturesForm = () => {
// // //   const { formData, updateFormData } = useForm();
// // //   const [features, setFeatures] = useState({
// // //     antiTheftDevice: formData.features?.antiTheftDevice || false,
// // //     hubCaps: formData.features?.hubCaps || false,
// // //     airCondition: formData.features?.airCondition || false,
// // //     powerWindows: formData.features?.powerWindows || false,
// // //     powerMirror: formData.features?.powerMirror || false,
// // //     foldingWingMirrors: formData.features?.foldingWingMirrors || false,
// // //     driverPassengerAirbags: formData.features?.driverPassengerAirbags || false,
// // //     radio: formData.features?.radio || false,
// // //     cdDeck: formData.features?.cdDeck || false,
// // //     displayScreen: formData.features?.displayScreen || false,
// // //     multifunctionalSteeringWheel: formData.features?.multifunctionalSteeringWheel || false,
// // //     fogLamps: formData.features?.fogLamps || false,
// // //     rearCamera: formData.features?.rearCamera || false,
// // //     tractionControl: formData.features?.tractionControl || false,
// // //     absBrakingSystem: formData.features?.absBrakingSystem || false,
// // //     rearWiper: formData.features?.rearWiper || false,
// // //     ecoMode: formData.features?.ecoMode || false,
// // //   });

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, checked } = e.target;
// // //     setFeatures((prev) => ({
// // //       ...prev,
// // //       [name]: checked,
// // //     }));
// // //   };

// // //   const handleSubmit = () => {
// // //     updateFormData({ features });
// // //   };

// // //   return (
// // //     <Card className="w-full">
// // //       <CardHeader>
// // //         <h2 className="text-xl font-semibold">Vehicle Features</h2>
// // //       </CardHeader>
// // //       <CardContent>
// // //         <div className="space-y-4">
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
// // //             <Checkbox
// // //               id="antiTheftDevice"
// // //               name="antiTheftDevice"
// // //               label="Anti-Theft Device: Factory Immobilizer"
// // //               checked={features.antiTheftDevice}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="hubCaps"
// // //               name="hubCaps"
// // //               label="Hub Caps/Steel Rims: 15''"
// // //               checked={features.hubCaps}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="airCondition"
// // //               name="airCondition"
// // //               label="Air Condition"
// // //               checked={features.airCondition}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="powerWindows"
// // //               name="powerWindows"
// // //               label="Power Windows"
// // //               checked={features.powerWindows}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="powerMirror"
// // //               name="powerMirror"
// // //               label="Power Mirror"
// // //               checked={features.powerMirror}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="foldingWingMirrors"
// // //               name="foldingWingMirrors"
// // //               label="Folding Wing Mirrors with Indicators"
// // //               checked={features.foldingWingMirrors}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="driverPassengerAirbags"
// // //               name="driverPassengerAirbags"
// // //               label="Driver & Passenger Air Bags"
// // //               checked={features.driverPassengerAirbags}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="radio"
// // //               name="radio"
// // //               label="Radio"
// // //               checked={features.radio}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="cdDeck"
// // //               name="cdDeck"
// // //               label="CD Deck"
// // //               checked={features.cdDeck}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="displayScreen"
// // //               name="displayScreen"
// // //               label="Display Screen"
// // //               checked={features.displayScreen}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="multifunctionalSteeringWheel"
// // //               name="multifunctionalSteeringWheel"
// // //               label="Multifunctional Steering Wheel"
// // //               checked={features.multifunctionalSteeringWheel}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="fogLamps"
// // //               name="fogLamps"
// // //               label="Fog Lamps"
// // //               checked={features.fogLamps}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="rearCamera"
// // //               name="rearCamera"
// // //               label="Rear Camera"
// // //               checked={features.rearCamera}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="tractionControl"
// // //               name="tractionControl"
// // //               label="Traction Control"
// // //               checked={features.tractionControl}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="absBrakingSystem"
// // //               name="absBrakingSystem"
// // //               label="ABS Braking System"
// // //               checked={features.absBrakingSystem}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="rearWiper"
// // //               name="rearWiper"
// // //               label="Rear Wiper"
// // //               checked={features.rearWiper}
// // //               onChange={handleChange}
// // //             />
            
// // //             <Checkbox
// // //               id="ecoMode"
// // //               name="ecoMode"
// // //               label="Eco Mode"
// // //               checked={features.ecoMode}
// // //               onChange={handleChange}
// // //             />
// // //           </div>
          
// // //           {customFeatures.map((feature, index) => (
// // //             <div key={index} className="flex items-center space-x-2">
// // //               <input
// // //                 type="text"
// // //                 value={feature.name}
// // //                 onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
// // //                 placeholder="Enter feature name"
// // //                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
// // //               />
// // //               <input
// // //                 type="checkbox"
// // //                 checked={feature.checked}
// // //                 onChange={(e) => updateCustomFeature(index, 'checked', e.target.checked)}
// // //                 className="h-4 w-4"
// // //               />
// // //             </div>
// // //           ))}
          
// // //           <button
// // //             type="button"
// // //             onClick={addCustomFeature}
// // //             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
// // //           >
// // //             Add Feature
// // //           </button>
          
// // //           <FormNavigation onSubmit={handleSubmit} />
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

