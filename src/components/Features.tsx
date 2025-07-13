// import { motion } from 'framer-motion';
// import {  FileText, Search, Shield, } from 'lucide-react';

// export function Features() {
//   const features = [
    
//     {
//       icon: Search,
//       title: 'Smart Historical Search',
//       description: 'Ask questions like "Where can I get parts for a 2019 Corolla?" and get instant answers from your entire claims database. No more digging through files.',
//       gradient: 'from-green-500 to-green-600'
//     },
//     {
//       icon: FileText,
//       title: 'Paperless Workflow',
//       description: 'Complete digital claims processing from first view to report. Eliminate physical paperwork and reduce processing time by up to 60%.',
//       gradient: 'from-purple-500 to-purple-600'
//     },
//     {
//       icon: Shield,
//       title: 'Secure Claims Database',
//       description: 'All your claims data centralized and searchable with enterprise-grade security. HIPAA compliant and insurance industry certified.',
//       gradient: 'from-indigo-500 to-indigo-600'
//     },
    
//   ];

//   return (
//     <section className="py-4 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
//               Everything Your Team Needs
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Powerful tools designed to streamline report processing and eliminate administrative bottlenecks
//             </p>
//           </motion.div>

//           {/* Features Grid */}
//           <div className="grid sm:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -10 }}
//                 className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-200"
//               >
//                 {/* Icon */}
//                 <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
//                   <feature.icon className="w-8 h-8 text-white" />
//                 </div>

//                 {/* Content */}
//                 <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {feature.description}
//                 </p>

//                 {/* Hover Effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Stats Section */}
//           {/* <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             viewport={{ once: true }}
//             className="mt-32 grid md:grid-cols-4 gap-8 text-center"
//           >
//             {[
//               // { number: '2.1M+', label: 'Claims Processed' },
//               // { number: '60%', label: 'Time Reduction' },
//               // { number: '847', label: 'Active Adjusters' },
//               // { number: '24/7', label: 'AI Support' }
//             ].map((stat, index) => (
//               <div key={stat.label} className="space-y-2">
//                 <div className="text-4xl font-bold text-gradient">{stat.number}</div>
//                 <div className="text-gray-600 font-medium">{stat.label}</div>
//               </div>
//             ))}
//           </motion.div> */}
//         </div>
//       </div>
//     </section>
//   );
// }

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
          {/* Predefined Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
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
          </div>
          
          {/* Custom Features Section */}
          {customFeatures.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Custom Features</h3>
              <div className="space-y-2">
                {customFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => updateCustomFeature(index, 'name', e.target.value)}
                      placeholder="Enter feature name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="checkbox"
                      checked={feature.checked}
                      onChange={(e) => updateCustomFeature(index, 'checked', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomFeature(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={addCustomFeature}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Custom Feature
          </button>
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};