// import React, { useState, useEffect } from 'react';
// import { Plus, X } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '../../../ui/card';
// import { Button } from '../../../ui/button';
// import { Input } from '../../../ui/input';
// import { Label } from '../../../ui/label';
// import { Textarea } from '../../../ui/textarea';
// import { FormNavigation } from '../navigation/FormNavigation';
// import { useForm } from '../../../../context/companies/icavs/FormContext';

// // Create a simple Select component since we don't have the full shadcn select
// interface SelectProps {
//   value: string;
//   onValueChange: (value: string) => void;
//   children: React.ReactNode;
// }

// const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
//   return (
//     <select 
//       value={value} 
//       onChange={(e) => onValueChange(e.target.value)}
//       className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//     >
//       {children}
//     </select>
//   );
// };

// const SelectTrigger: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
//   <div className={className}>{children}</div>
// );

// const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
//   <span>{placeholder}</span>
// );

// const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <>{children}</>
// );

// const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
//   <option value={value}>{children}</option>
// );

// interface ExcludedItem {
//   id: string;
//   partName: string;
//   reason: string;
// }

// interface LabourCategory {
//   category: string;
//   originalFigure?: string;
//   adjustedFigure?: string;
//   personName?: string;
//   companyLocation?: string;
//   agreedFigure?: string;
//   labourFigure?: string;
// }

// export const EstimateForm: React.FC = () => {
//   const { formData, updateFormData } = useForm();
//   const [estimateData, setEstimateData] = useState({
//     estimateFrom: formData.estimate?.from || '',
//     estimateDate: formData.estimate?.dated ? new Date().toISOString().split('T')[0] : '',
//     adjusterSource: formData.estimate?.parts?.adjustedSource || '',
//     supplierName: '',
//     tradeDiscount: '',
//     contribution: '',
//     partsQuoted: formData.estimate?.parts?.quotedFigure || '',
//     adjustedParts: formData.estimate?.parts?.adjustedFigure || '',
//     partsRemarks: formData.estimate?.parts?.remarks || '',
//     figureQuoted: formData.estimate?.labour?.quotedFigure || '',
//     adjustedLabour: formData.estimate?.labour?.adjustedFigure || '',
//     completionDays: formData.estimate?.completionDays || '',
//     labourRemarks: formData.estimate?.labour?.remarks || '',
//   });
  
//   const updateEstimateData = (data: any) => {
//     setEstimateData(prev => ({ ...prev, ...data }));
//   };
  
//   const [excludedItems, setExcludedItems] = useState<ExcludedItem[]>([]);
//   const [labourCategory, setLabourCategory] = useState<LabourCategory>({ category: '' });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     updateEstimateData({ [name]: value });
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     updateEstimateData({ [name]: value });
//   };

//   const addExcludedItem = () => {
//     const newItem: ExcludedItem = {
//       id: Date.now().toString(),
//       partName: '',
//       reason: ''
//     };
//     setExcludedItems([...excludedItems, newItem]);
//   };

//   const updateExcludedItem = (id: string, field: string, value: string) => {
//     setExcludedItems(items =>
//       items.map(item =>
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//     // Force re-render for preview
//     setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
//   };

//   const removeExcludedItem = (id: string) => {
//     setExcludedItems(items => items.filter(item => item.id !== id));
//     setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
//   };

//   const handleLabourCategoryChange = (field: string, value: string) => {
//     setLabourCategory(prev => ({ ...prev, [field]: value }));
//     setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
//   };

//   const generatePartsRemarks = () => {
//     let remarks = '';

//     // Excluded items remarks
//     excludedItems.forEach(item => {
//       if (item.partName && item.reason) {
//         switch (item.reason) {
//           case 'repair':
//             remarks += `The estimate included provision for a ${item.partName} under the heading of material items. The damage to this component is reparable and therefore the cost of replacement should be excluded from the estimate.\n\n`;
//             break;
//           case 'betterment':
//             remarks += `The estimate included provision for a ${item.partName} under the heading of material items. This component was not damaged in the accident and therefore the cost of replacement should be excluded from the estimate.\n\n`;
//             break;
//           case 'pre-existing':
//             remarks += `The estimate included provision for a ${item.partName} under the heading of material items. The damage to this component was pre-existing and therefore the cost of replacement should be excluded from the estimate.\n\n`;
//             break;
//           case 'no-contribution':
//             remarks += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
//             break;
//         }
//       }
//     });

//     // Trade discount and contribution remarks
//     const tradeDiscount = parseFloat(estimateData.tradeDiscount || '0');
//     const contribution = parseFloat(estimateData.contribution || '0');

//     if (tradeDiscount > 0 && contribution === 0) {
//       remarks += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
//     } else if (tradeDiscount > 0 && contribution > 0) {
//       remarks += `Age-Related Contribution: A ${contribution}% contribution has been applied to account for the age and condition of the vehicle.\n\n`;
//     }

//     return remarks.trim();
//   };

//   const generateLabourRemarks = () => {
//     let remarks = '';

//     switch (labourCategory.category) {
//       case 'overstated':
//         const original = labourCategory.originalFigure || '[original figure]';
//         const adjusted = labourCategory.adjustedFigure || '[adjusted figure]';
//         remarks += `The labour and material figure was overstated in the amount of $${original} which was adjusted downward to $${adjusted} which would be more realistic when compared to the actual man hours involved to complete the repair exercise.\n\n`;
//         break;
//       case 'negotiated':
//         const person = labourCategory.personName || '[person name]';
//         const company = labourCategory.companyLocation || '[company/location]';
//         const agreed = labourCategory.agreedFigure || '[agreed figure]';
//         remarks += `In keeping with your instructions we have negotiated a labour figure with ${person} of ${company} and after a deliberation on the issue, a labour and material figure of $${agreed} was mutually agreed.\n\n`;
//         break;
//       case 'reasonable':
//         remarks += `The labour and material figure quoted is reasonable when one considers the nature of repairs and time involved to restore the vehicle to its pre-accident condition. This figure therefore should be allowed.\n\n`;
//         break;
//       case 'estimated':
//         const estimated = labourCategory.labourFigure || '[labour figure]';
//         remarks += `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in the region of $${estimated}.\n\n`;
//         break;
//       case 'exceeds':
//         const exceeds = labourCategory.labourFigure || '[labour figure]';
//         remarks += `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in excess of $${exceeds}.\n\n`;
//         break;
//     }

//     return remarks.trim();
//   };

//   const handleSubmit = () => {
//     // Update form data with estimate information
//     updateFormData({
//       estimate: {
//         from: estimateData.estimateFrom,
//         dated: !!estimateData.estimateDate,
//         parts: {
//           adjustedSource: estimateData.adjusterSource,
//           quotedFigure: parseFloat(estimateData.partsQuoted) || 0,
//           adjustedFigure: parseFloat(estimateData.adjustedParts) || 0,
//           remarks: estimateData.partsRemarks,
//           excludedItems: excludedItems.map(item => item.partName).filter(Boolean),
//         },
//         labour: {
//           quotedFigure: parseFloat(estimateData.figureQuoted) || 0,
//           adjustedFigure: parseFloat(estimateData.adjustedLabour) || 0,
//           remarks: estimateData.labourRemarks,
//         },
//         completionDays: parseInt(estimateData.completionDays) || 0,
//       }
//     });
    
//     // Auto-navigate to next tab after save
//     setTimeout(() => {
//       const event = new CustomEvent('navigateToNextTab');
//       window.dispatchEvent(event);
//     }, 100);
//   };

//   const reasonOptions = [
//     { value: 'repair', label: 'To repair' },
//     { value: 'betterment', label: 'Betterment' },
//     { value: 'pre-existing', label: 'Pre-existing damage' },
//     { value: 'no-contribution', label: 'No Contribution Applied' }
//   ];

//   const labourCategoryOptions = [
//     { value: 'overstated', label: 'Overstated - Adjusted Downward' },
//     { value: 'negotiated', label: 'Negotiated with Repairer' },
//     { value: 'reasonable', label: 'Reasonable - Should be Allowed' },
//     { value: 'estimated', label: 'Estimated Labour Figure' },
//     { value: 'exceeds', label: 'Labour Figure Exceeds Amount' }
//   ];

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <h2 className="text-xl font-semibold">Estimate Information</h2>
//       </CardHeader>
//       <CardContent className="space-y-8">
//         {/* Estimate From and Date */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-1">
//             <Label htmlFor="estimateFrom">Estimate From</Label>
//             <Input
//               id="estimateFrom"
//               name="estimateFrom"
//               value={estimateData.estimateFrom || ''}
//               onChange={handleChange}
//               placeholder="Enter estimate source"
//               className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//             />
//           </div>
//           <div className="space-y-1">
//             <Label htmlFor="estimateDate">Estimate Date</Label>
//             <Input
//               id="estimateDate"
//               name="estimateDate"
//               type="date"
//               value={estimateData.estimateDate || ''}
//               onChange={handleChange}
//               className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//             />
//           </div>
//         </div>

//         {/* Section A - Parts */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-secondary-900">Section A - Parts</h3>
          
//           {/* Excluded Items */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-secondary-800">Excluded Items & Reason Disallowed</h4>
            
//             {excludedItems.map((item) => (
//               <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-secondary-200 rounded-lg">
//                 <div className="space-y-1">
//                   <Label>Part Name</Label>
//                   <Input
//                     value={item.partName}
//                     onChange={(e) => updateExcludedItem(item.id, 'partName', e.target.value)}
//                     placeholder="Enter part name"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Reason</Label>
//                   <Select value={item.reason} onValueChange={(value) => updateExcludedItem(item.id, 'reason', value)}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select reason" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {reasonOptions.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="flex items-end">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => removeExcludedItem(item.id)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
            
//             <div className="flex justify-center">
//               <Button
//                 type="button"
//                 onClick={addExcludedItem}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto block"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Excluded Item
//               </Button>
//             </div>
//           </div>

//           {/* Adjusted Source & Type of Parts */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-secondary-800">Adjusted Source & Type of Parts</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <Label htmlFor="adjusterSource">Source</Label>
//                 <Select value={estimateData.adjusterSource || ''} onValueChange={(value) => handleSelectChange('adjusterSource', value)}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select source" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="franchise">Franchise Parts</SelectItem>
//                     <SelectItem value="aftermarket">Aftermarket parts</SelectItem>
//                     <SelectItem value="used">Used parts</SelectItem>
//                     <SelectItem value="custom">Custom Entry</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-1">
//                 <Label htmlFor="supplierName">
//                   {estimateData.adjusterSource === 'custom' ? 'Custom Entry' : 'Supplier Name (with phone if applicable)'}
//                 </Label>
//                 <Input
//                   id="supplierName"
//                   name="supplierName"
//                   value={estimateData.supplierName || ''}
//                   onChange={handleChange}
//                   placeholder={estimateData.adjusterSource === 'custom' ? 'Enter custom entry' : 'Enter supplier name and phone'}
//                   className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Trade Discount & Contribution */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <Label htmlFor="tradeDiscount">Trade Discount (%)</Label>
//               <Input
//                 id="tradeDiscount"
//                 name="tradeDiscount"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.tradeDiscount || ''}
//                 onChange={handleChange}
//                 placeholder="Enter trade discount percentage"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="contribution">Contribution (%)</Label>
//               <Input
//                 id="contribution"
//                 name="contribution"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.contribution || ''}
//                 onChange={handleChange}
//                 placeholder="Enter contribution percentage"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//           </div>

//           {/* Parts Figures */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <Label htmlFor="partsQuoted">Parts Figure Quoted ($)</Label>
//               <Input
//                 id="partsQuoted"
//                 name="partsQuoted"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.partsQuoted || ''}
//                 onChange={handleChange}
//                 placeholder="Enter quoted parts figure"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="adjustedParts">Adjusted Parts Figure ($)</Label>
//               <Input
//                 id="adjustedParts"
//                 name="adjustedParts"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.adjustedParts || ''}
//                 onChange={handleChange}
//                 placeholder="Enter adjusted parts figure"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//           </div>

//           {/* Parts Remarks Preview */}
//           <div className="space-y-1">
//             <Label>Remarks Preview</Label>
//             <div className="p-3 bg-gray-50 border border-secondary-200 rounded-md min-h-[100px]">
//               <p className="text-sm text-secondary-700 whitespace-pre-line">
//                 {generatePartsRemarks() || 'Remarks will appear here based on your selections...'}
//               </p>
//             </div>
//           </div>

//           {/* Custom Parts Remarks */}
//           <div className="space-y-1">
//             <Label htmlFor="partsRemarks">Custom Section(A) Parts Remarks</Label>
//             <Textarea
//               id="partsRemarks"
//               name="partsRemarks"
//               value={estimateData.partsRemarks || ''}
//               onChange={(e) => {
//                 handleChange(e);
//                 setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
//               }}
//               rows={4}
//               className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               placeholder="Enter additional remarks about parts..."
//             />
//           </div>
//         </div>

//         {/* Section B - Labour */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-secondary-900">Section B - Labour</h3>
          
//           {/* Labour Figures */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-1">
//               <Label htmlFor="figureQuoted">Figure Quoted ($)</Label>
//               <Input
//                 id="figureQuoted"
//                 name="figureQuoted"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.figureQuoted || ''}
//                 onChange={handleChange}
//                 placeholder="Enter quoted figure"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="adjustedLabour">Adjusted Labour & Material Figure ($)</Label>
//               <Input
//                 id="adjustedLabour"
//                 name="adjustedLabour"
//                 type="number"
//                 step="0.01"
//                 value={estimateData.adjustedLabour || ''}
//                 onChange={handleChange}
//                 placeholder="Enter adjusted figure"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="completionDays">Repairs ought to be completed in (days)</Label>
//               <Input
//                 id="completionDays"
//                 name="completionDays"
//                 type="number"
//                 value={estimateData.completionDays || ''}
//                 onChange={handleChange}
//                 placeholder="Enter days"
//                 className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               />
//             </div>
//           </div>

//           {/* Labour Categories */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-secondary-800">Labour Categories</h4>
//             <div className="space-y-1">
//               <Label>Category</Label>
//               <Select value={labourCategory.category} onValueChange={(value) => handleLabourCategoryChange('category', value)}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select labour category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {labourCategoryOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Dynamic fields based on category */}
//             {labourCategory.category === 'overstated' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <Label>Original Figure ($)</Label>
//                   <Input
//                     value={labourCategory.originalFigure || ''}
//                     onChange={(e) => handleLabourCategoryChange('originalFigure', e.target.value)}
//                     placeholder="Enter original figure"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Adjusted Figure ($)</Label>
//                   <Input
//                     value={labourCategory.adjustedFigure || ''}
//                     onChange={(e) => handleLabourCategoryChange('adjustedFigure', e.target.value)}
//                     placeholder="Enter adjusted figure"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             )}

//             {labourCategory.category === 'negotiated' && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-1">
//                   <Label>Person Name</Label>
//                   <Input
//                     value={labourCategory.personName || ''}
//                     onChange={(e) => handleLabourCategoryChange('personName', e.target.value)}
//                     placeholder="Enter person name"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Company/Location</Label>
//                   <Input
//                     value={labourCategory.companyLocation || ''}
//                     onChange={(e) => handleLabourCategoryChange('companyLocation', e.target.value)}
//                     placeholder="Enter company/location"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <Label>Agreed Figure ($)</Label>
//                   <Input
//                     value={labourCategory.agreedFigure || ''}
//                     onChange={(e) => handleLabourCategoryChange('agreedFigure', e.target.value)}
//                     placeholder="Enter agreed figure"
//                     className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             )}

//             {(labourCategory.category === 'estimated' || labourCategory.category === 'exceeds') && (
//               <div className="space-y-1">
//                 <Label>Labour Figure ($)</Label>
//                 <Input
//                   value={labourCategory.labourFigure || ''}
//                   onChange={(e) => handleLabourCategoryChange('labourFigure', e.target.value)}
//                   placeholder="Enter labour figure"
//                   className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Labour Remarks Preview */}
//           <div className="space-y-1">
//             <Label>Labour Remarks Preview</Label>
//             <div className="p-3 bg-gray-50 border border-secondary-200 rounded-md min-h-[100px]">
//               <p className="text-sm text-secondary-700 whitespace-pre-line">
//                 {generateLabourRemarks() || 'Labour remarks will appear here based on your category selection...'}
//               </p>
//             </div>
//           </div>

//           {/* Custom Labour Remarks */}
//           <div className="space-y-1">
//             <Label htmlFor="labourRemarks">Custom Section(B) Labour Remarks</Label>
//             <Textarea
//               id="labourRemarks"
//               name="labourRemarks"
//               value={estimateData.labourRemarks || ''}
//               onChange={(e) => {
//                 handleChange(e);
//                 setTimeout(() => updateEstimateData({ _forceUpdate: Date.now() }), 0);
//               }}
//               rows={4}
//               className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
//               placeholder="Enter remarks about labour..."
//             />
//           </div>
//         </div>

//         <FormNavigation onNext={handleSubmit} />
//       </CardContent>
//     </Card>
//   );
// };

import { useState, useEffect } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';

// Parts source options
const partsSourceOptions = [
{ value: 'franchise', label: 'Franchise Parts' },
{ value: 'used', label: 'Used parts' },
{ value: 'oem', label: 'O.E.M.' },
{ value: 'aftermarket', label: 'Aftermarket parts' },
{ value: 'custom-built', label: 'Custom Built aftermarket' },
{ value: 'reconditioned', label: 'Reconditioned parts' },
{ value: 'mixed', label: 'Mixed (O.E.M. & Used)' },
{ value: 'custom', label: 'Custom Entry' },
];

// Exclusion reason options
const exclusionReasonOptions = [
{ value: 'to-repair', label: 'To repair' },
{ value: 'no-visible-damage', label: 'No visible damage' },
{ value: 'closer-inspection', label: 'For closer inspection' },
{ value: 'not-consistent', label: 'Not consistent' },
{ value: 'reusable', label: 'Reusable' },
{ value: 'salvageable', label: 'Salvageable Value' },
{ value: 'age-contribution', label: 'Age-Related Contribution' },
{ value: 'lower-price', label: 'Lower Price Parts Found' },
{ value: 'total-loss', label: 'Constructive Total Loss' },
{ value: 'no-contribution', label: 'No Contribution Applied + Unseen Damage Warning' },
{ value: 'no-contribution-applied', label: 'No Contribution Applied' },
{ value: 'custom', label: 'Custom Reason' },
];

export const EstimateForm = () => {
const { formData, updateFormData, goToNextStep } = useForm();
const [estimateData, setEstimateData] = useState({
from: formData.estimate?.from || '',
dated: formData.estimate?.dated || false,
invoiceFrom: formData.estimate?.invoiceFrom || '',
invoiceDated: formData.estimate?.invoiceDated || '',

adjustedSource: formData.estimate?.parts.adjustedSource || '',
excludedItems: formData.estimate?.parts.excludedItems?.join('\n') || '',
partsRemarks: '',
partsQuotedFigure: formData.estimate?.parts.quotedFigure || 0,
partsAdjustedFigure: formData.estimate?.parts.adjustedFigure || 0,

labourRemarks: formData.estimate?.labour.remarks || '',
labourQuotedFigure: formData.estimate?.labour.quotedFigure || 0,
labourAdjustedFigure: formData.estimate?.labour.adjustedFigure || 0,

completionDays: formData.estimate?.completionDays || 0,
estimateDate: '',
});

// New state for dropdown functionality
const [reportedSource, setReportedSource] = useState('');
const [reportedSourceSupplier, setReportedSourceSupplier] = useState('');
const [reportedSourceCustom, setReportedSourceCustom] = useState('');
const [adjusterSource, setAdjusterSource] = useState('');
const [adjusterSourceSupplier, setAdjusterSourceSupplier] = useState('');
const [adjusterSourceCustom, setAdjusterSourceCustom] = useState('');
const [excludedItemsList, setExcludedItemsList] = useState([]);

// State for trade discount and contribution
const [tradeDiscountList, setTradeDiscountList] = useState([]);
const [contributionList, setContributionList] = useState([]);
const [tradeDiscountPercentage, setTradeDiscountPercentage] = useState('');
const [contributionPercentage, setContributionPercentage] = useState('');

// State for labour categories
const [selectedLabourCategory, setSelectedLabourCategory] = useState('');
const [labourCategoryData, setLabourCategoryData] = useState({
originalFigure: '',
adjustedFigure: '',
personName: '',
companyLocation: '',
agreedFigure: '',
labourFigure: ''
});

const labourCategoryOptions = [
{ value: '', label: 'Select labour category...' },
{ value: 'overstated', label: 'Overstated - Adjusted Downward' },
{ value: 'negotiated', label: 'Negotiated with Repairer' },
{ value: 'reasonable', label: 'Reasonable - Should be Allowed' },
{ value: 'estimated', label: 'Estimated Labour Figure' },
{ value: 'exceeds', label: 'Labour Figure Exceeds Amount' },
];

// Helper function to generate parts source text
const generatePartsSourceText = (sourceType, supplier, custom) => {
if (sourceType === 'custom') return custom;
if (!supplier) return partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';

switch (sourceType) {
case 'franchise':
return `Franchise Parts – ${supplier}`;
case 'used':
return `${supplier} – Used parts`;
case 'aftermarket':
return `Aftermarket parts – ${supplier}`;
case 'custom-built':
return `Custom Built aftermarket – ${supplier}`;
case 'reconditioned':
return `${supplier} – Reconditioned parts`;
case 'oem':
return `O.E.M. – ${supplier}`;
case 'mixed':
return `Mixed (O.E.M. & Used) – ${supplier}`;
default:
const baseLabel = partsSourceOptions.find(opt => opt.value === sourceType)?.label || '';
return supplier ? `${baseLabel} – ${supplier}` : baseLabel;
}
};

// Helper function to add excluded item
const addExcludedItem = () => {
setExcludedItemsList([...excludedItemsList, { 
partName: '', 
reason: 'to-repair', // Set default reason to first option
customReason: '' 
}]);
// Force preview update after adding item
setTimeout(() => {
setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() }));
}, 0);
};

// Helper function to update excluded item
const updateExcludedItem = (index, field, value) => {
const updated = [...excludedItemsList];
updated[index] = { ...updated[index], [field]: value };
setExcludedItemsList(updated);

// Force immediate re-render of preview
setTimeout(() => {
setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() }));
}, 0);
};
useEffect(() => {
// This will trigger whenever excludedItemsList changes
setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() }));
}, [excludedItemsList]);
// Helper function to remove excluded item
const removeExcludedItem = (index) => {
setExcludedItemsList(excludedItemsList.filter((_, i) => i !== index));
};

// Helper function to generate excluded items text
const generateExcludedItemsText = () => {
return excludedItemsList
.filter(item => item.partName.trim() !== '') // Only include items with part names
.map(item => {
const reasonText = item.reason === 'custom' ? item.customReason : 
exclusionReasonOptions.find(opt => opt.value === item.reason)?.label || '';
return `${item.partName} - ${reasonText}`;
}).join('\n');
};

// Helper functions for trade discount
const addTradeDiscount = () => {
setTradeDiscountList([...tradeDiscountList, { percentage: '', description: '' }]);
};

const updateTradeDiscount = (index, field, value) => {
const updated = [...tradeDiscountList];
updated[index] = { ...updated[index], [field]: value };
setTradeDiscountList(updated);
};

const removeTradeDiscount = (index) => {
setTradeDiscountList(tradeDiscountList.filter((_, i) => i !== index));
};

// Helper functions for contribution
const addContribution = () => {
setContributionList([...contributionList, { percentage: '', description: '' }]);
};

const updateContribution = (index, field, value) => {
const updated = [...contributionList];
updated[index] = { ...updated[index], [field]: value };
setContributionList(updated);
};

const removeContribution = (index) => {
setContributionList(contributionList.filter((_, i) => i !== index));
};

// Generate remarks preview based on excluded items
const generateRemarksPreview = () => {
let preview = '';

// Group excluded items by reason for better paragraph generation
const groupedItems = {};
excludedItemsList.forEach(item => {
const reasonKey = item.reason;
if (!groupedItems[reasonKey]) {
groupedItems[reasonKey] = [];
}
groupedItems[reasonKey].push(item.partName);
});

// Generate remarks paragraphs for each reason category
Object.entries(groupedItems).forEach(([reason, parts]) => {
if (!reason || parts.length === 0) return;

const partsText = parts.length === 1 ? parts[0] : 
parts.length === 2 ? parts.join(' and ') :
parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];

switch (reason) {
case 'to-repair':
if (parts.length === 1) {
preview += `The estimate included provision for a ${partsText} under the heading of material items. The damage to this component is reparable and was as a result excluded from the material items by way of an adjustment.\n\n`;
} else {
preview += `The estimate included provision for ${partsText} under the heading of material items. The damage to these components are reparable and were as a result excluded from the material items by way of adjustments.\n\n`;
}
break;
case 'no-visible-damage':
if (parts.length === 1) {
preview += `The ${partsText} showed no signs of impact damage and was struck off the material section of the estimate by way of adjustments.\n\n`;
} else {
preview += `The ${partsText} showed no signs of impact damage and were struck off the material section of the estimate by way of adjustments.\n\n`;
}
break;
case 'closer-inspection':
if (parts.length === 1) {
preview += `The estimate included provision for the replacement of a ${partsText} under the heading of material items. No damage was visible to this component at the time of inspection. This component will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned item was excluded from the material items in the interim.\n\n`;
} else {
preview += `The estimate included provision for the replacement of ${partsText} under the heading of material items. No damage was visible to these components at the time of inspection. These components will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned items were excluded from the material items in the interim.\n\n`;
}
break;
case 'not-consistent':
if (parts.length === 1) {
preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
} else {
preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
}
break;
case 'reusable':
if (parts.length === 1) {
preview += `The material section of the estimate included a ${partsText}. This component is re-usable and was excluded from the material section by way of adjustments.\n\n`;
} else {
preview += `The material section of the estimate included ${partsText}. These components are re-usable and were excluded from the material section by way of adjustments.\n\n`;
}
break;
case 'salvageable':
parts.forEach(part => {
const item = excludedItemsList.find(i => i.partName === part);
const amount = item?.customReason || '0.00';
preview += `The unaffected ${part} has salvageable worth which we estimate to be in the order of $${amount}. You may wish to have this item turned into your Office as a result.\n\n`;
});
break;
case 'lower-price':
preview += `The material section of the estimate made provision for secondhand components. We were able to locate the required items on the market at lower prices, which are shown in red on the estimate.\n\n`;
break;
case 'total-loss':
const item = excludedItemsList.find(i => i.reason === 'total-loss');
const company = item?.customReason || '[company name]';
preview += `We were presented with a letter from ${company} which recommended that this loss be treated as a 'Constructive Total Loss.' The parts figure will be in excess of $[amount] which no doubt far exceeds an economical undertaking.\n\n`;
break;
case 'no-contribution':
preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items. There is a possibility that unseen damage may come to light after the job is opened. In the event that there is unseen damage, this ought to be the subject of a supplementary estimate by a further inspection.\n\n`;
break;
case 'no-contribution-applied':
preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
break;
default:
if (reason === 'custom') {
const customReason = excludedItemsList.find(i => i.partName === parts[0])?.customReason;
if (customReason) {
preview += `${partsText} - ${customReason}\n\n`;
}
}
}
});

// Add trade discount and contribution logic
const hasTradeDiscount = tradeDiscountPercentage && tradeDiscountPercentage.trim() !== '';
const hasContribution = contributionPercentage && contributionPercentage.trim() !== '';

if (hasTradeDiscount && !hasContribution) {
// Trade discount applied but no contribution
preview += `On account of the age and condition of the vehicle no contribution ought to be applied to the irreparable items.\n\n`;
} else if (hasContribution) {
// Contribution applied (with or without trade discount)
preview += `On account of the age of the vehicle we applied ${contributionPercentage}% contribution towards the O.E.M. parts which has been reflected in our handwritten workings on the attached estimate.\n\n`;
}

// Add custom remarks if any
if (estimateData.partsRemarks) {
preview += `${estimateData.partsRemarks}\n\n`;
}

return preview.trim();
};

// Generate labour remarks preview
const generateLabourRemarksPreview = () => {
if (!selectedLabourCategory) return '';

const { originalFigure, adjustedFigure, personName, companyLocation, agreedFigure, labourFigure } = labourCategoryData;

switch (selectedLabourCategory) {
case 'overstated':
return `The labour and material figure was overstated in the amount of $${originalFigure || '[original figure]'} which was adjusted downward to $${adjustedFigure || '[adjusted figure]'} which would be more realistic when compared to the actual man hours involved to complete the repair exercise.`;

case 'negotiated':
return `In keeping with your instructions we have negotiated a labour figure with ${personName || '[person name]'} of ${companyLocation || '[company/location]'} and after a deliberation on the issue, a labour and material figure of $${agreedFigure || '[agreed figure]'} was mutually agreed.`;

case 'reasonable':
return `The labour and material figure quoted is reasonable when one considers the nature of repairs and time involved to restore the vehicle to its pre-accident condition. This figure therefore should be allowed.`;

case 'estimated':
return `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in the region of $${labourFigure || '[labour figure]'}.`;

case 'exceeds':
return `When one considers the nature of the repairs and the man-hours required to restore the vehicle to its pre-accident condition, a labour figure will be in excess of $${labourFigure || '[labour figure]'}.`;

default:
return '';
}
};

// Generate full preview with paragraphs
const generateFullPreview = () => {
let preview = '';

// Group excluded items by reason for better paragraph generation
const groupedItems = {};
excludedItemsList.forEach(item => {
const reasonKey = item.reason === 'custom' ? item.customReason : item.reason;
if (!groupedItems[reasonKey]) {
groupedItems[reasonKey] = [];
}
groupedItems[reasonKey].push(item.partName);
});

// Generate excluded items list
Object.entries(groupedItems).forEach(([reason, parts]) => {
const reasonText = exclusionReasonOptions.find(opt => opt.value === reason)?.label || reason;
const partsText = parts.join(', ');
preview += `${partsText} – ${reasonText}\n`;
});

// Add trade discount
if (tradeDiscountPercentage && tradeDiscountPercentage.trim() !== '') {
preview += `Trade Discount: ${tradeDiscountPercentage}%\n`;
}

// Add contribution
if (contributionPercentage && contributionPercentage.trim() !== '') {
preview += `Contribution: ${contributionPercentage}%\n`;
}

// Add salvageable items (from excluded items with salvageable reason)
const salvageableItems = excludedItemsList.filter(item => item.reason === 'salvageable');
if (salvageableItems.length > 0) {
const salvageText = salvageableItems.map(item => `${item.partName} ($${item.customReason || '0.00'})`).join(', ');
preview += `Salvageable items & Estimated value: ${salvageText}\n`;
}

preview += '\nRemarks:\n';

// Generate detailed remarks paragraphs
Object.entries(groupedItems).forEach(([reason, parts]) => {
const partsText = parts.join(', ');

switch (reason) {
case 'to-repair':
preview += `The estimate included provision for ${partsText} under the heading of material items. The damage to ${parts.length > 1 ? 'these components are' : 'this component is'} reparable and ${parts.length > 1 ? 'were' : 'was'} as a result excluded from the material items by way of ${parts.length > 1 ? 'adjustments' : 'an adjustment'}.\n\n`;
break;
case 'no-visible-damage':
preview += `The ${partsText} showed no signs of impact damage and were struck off the material section of the estimate by way of adjustments.\n\n`;
break;
case 'closer-inspection':
preview += `The estimate included provision for the replacement of ${partsText} under the heading of material items. No damage was visible to ${parts.length > 1 ? 'these components' : 'this component'} at the time of inspection. ${parts.length > 1 ? 'These components' : 'This component'} will require verification by the repairer after the job is opened and the findings communicated to your office following which the damage can be confirmed by our office. To this end the above-mentioned items were excluded from the material items in the interim.\n\n`;
break;
case 'not-consistent':
preview += `The damage to the ${partsText} is not consistent with this claim and was therefore not allowed.\n\n`;
break;
case 'reusable':
preview += `The material section of the estimate included ${partsText}. These components are re-usable and were excluded from the material section by way of adjustments.\n\n`;
break;
case 'salvageable':
parts.forEach(part => {
const item = excludedItemsList.find(i => i.partName === part);
const amount = item?.customReason || '0.00';
preview += `The unaffected ${part} has salvageable worth which we estimate to be in the order of $${amount}. You may wish to have this item turned into your Office as a result.\n\n`;
});
break;
default:
if (reason) {
preview += `${partsText} - ${reason}\n\n`;
}
}
});

// Add contribution remarks
if (contributionList.length > 0) {
contributionList.forEach(contribution => {
preview += `On account of the age of the vehicle we applied ${contribution.percentage}% contribution towards the O.E.M. parts which has been reflected in our handwritten workings on the attached estimate.\n\n`;
});
}

// Add custom remarks
if (estimateData.partsRemarks) {
preview += `${estimateData.partsRemarks}\n`;
}

return preview.trim();
};
const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
const { name, value, type, checked } = e.target;

let parsedValue: string | number | boolean = value;

if (type === 'number') {
parsedValue = value === '' ? 0 : parseFloat(value);
} else if (type === 'checkbox') {
parsedValue = checked;
}

setEstimateData((prev) => ({
...prev,
[name]: parsedValue,
}));
};

const handleSubmit = () => {
const excludedItemsArray = estimateData.excludedItems
.split('\n')
.filter(item => item.trim() !== '');

// Update adjusted source with generated text
const finalAdjustedSource = generatePartsSourceText(adjusterSource, adjusterSourceSupplier, adjusterSourceCustom);
const finalExcludedItems = generateExcludedItemsText();

updateFormData({
estimate: {
from: estimateData.from,
dated: estimateData.dated,
invoiceFrom: estimateData.invoiceFrom,
invoiceDated: estimateData.invoiceDated,

parts: {
adjustedSource: finalAdjustedSource || estimateData.adjustedSource,
excludedItems: finalExcludedItems ? finalExcludedItems.split('\n') : excludedItemsArray,
remarks: estimateData.partsRemarks,
quotedFigure: Number(estimateData.partsQuotedFigure),
adjustedFigure: Number(estimateData.partsAdjustedFigure),
},

labour: {
remarks: estimateData.labourRemarks,
quotedFigure: Number(estimateData.labourQuotedFigure),
adjustedFigure: Number(estimateData.labourAdjustedFigure),
},

completionDays: Number(estimateData.completionDays),
},
});

// Auto-navigate to next step after saving
setTimeout(() => {
goToNextStep();
}, 100);
};

return (
<Card className="w-full">
<CardHeader>
<h2 className="text-xl font-semibold">Estimate Information</h2>
</CardHeader>
<CardContent>
<div className="space-y-6">
<div className="space-y-4">
<h3 className="text-lg font-medium">Estimate Source</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Estimate From"
name="from"
value={estimateData.from}
onChange={handleChange}
placeholder="e.g. Aristocraft Auto Collision"
/>

<Input
label="Estimate Date"
type="date"
name="estimateDate"
value={estimateData.estimateDate || ''}
onChange={handleChange}
/>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex items-center mt-8">
<Checkbox
id="dated"
name="dated"
label="Dated"
checked={estimateData.dated}
onChange={handleChange}
/>
</div>

<div></div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Invoice From"
name="invoiceFrom"
value={estimateData.invoiceFrom}
onChange={handleChange}
placeholder="e.g. White Boy Auto"
/>

<Input
label="Invoice Dated"
type="date"
name="invoiceDated"
value={estimateData.invoiceDated}
onChange={handleChange}
/>
</div>
</div>

<div className="border-t border-secondary-200 pt-4 space-y-4">
<h3 className="text-lg font-medium">Parts (Section A)</h3>

{/* Reported Source Dropdown */}
<div className="space-y-2">
<label className="block text-sm font-medium text-secondary-700">
Reported Source & Type of Parts
</label>
<Select
value={reportedSource}
onChange={(e) => setReportedSource(e.target.value)}
options={partsSourceOptions}
/>
</div>

{/* Adjuster Source Dropdown */}
<div className="space-y-2">
<label className="block text-sm font-medium text-secondary-700">
Adjusted Source & Type of Parts
</label>
<Select
value={adjusterSource}
onChange={(e) => setAdjusterSource(e.target.value)}
options={partsSourceOptions}
/>
<Input
label={adjusterSource === 'custom' ? "Custom Entry" : "Supplier Name (with phone if applicable)"}
value={adjusterSourceSupplier}
onChange={(e) => setAdjusterSourceSupplier(e.target.value)}
placeholder={adjusterSource === 'custom' ? "Enter custom parts source" : "e.g. Seenath's (360-7033) or Automix - 751-2782"}
/>
{adjusterSource && (
<div className="p-2 bg-gray-50 rounded border text-sm">
<strong>Preview:</strong> {generatePartsSourceText(adjusterSource, adjusterSourceSupplier, adjusterSource === 'custom' ? adjusterSourceSupplier : '')}
</div>
)}
</div>

{/* Excluded Items Section */}
<div className="space-y-2">
<div className="flex items-center justify-between">
<label className="block text-sm font-medium text-secondary-700">
Excluded Items & Reason Disallowed
</label>
</div>

{excludedItemsList.map((item, index) => (
<div key={index} className="border border-gray-200 rounded p-3 space-y-2">
<div className="flex items-center justify-between">
<span className="text-sm font-medium">Item {index + 1}</span>
<button
type="button"
onClick={() => removeExcludedItem(index)}
className="text-red-500 hover:text-red-700 text-sm"
>
Remove
</button>
</div>
<Input
label="Part Name"
value={item.partName}
onChange={(e) => {
updateExcludedItem(index, 'partName', e.target.value);
// Force immediate preview update
setTimeout(() => setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() })), 0);
}}
placeholder="e.g. Rear bumper"
/>
<Select
label="Reason"
value={item.reason}
onChange={(e) => updateExcludedItem(index, 'reason', e.target.value)}
options={exclusionReasonOptions}
/>
{item.reason === 'custom' && (
<Input
label="Custom Reason"
value={item.customReason}
onChange={(e) => updateExcludedItem(index, 'customReason', e.target.value)}
placeholder="Enter custom reason"
/>
)}
</div>
))}

<button
type="button"
onClick={addExcludedItem}
className="mx-auto block px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
>
+ Add Excluded Item
</button>

{excludedItemsList.length > 0 && (
<div className="p-2 bg-gray-50 rounded border text-sm">
<strong>Preview:</strong>
<pre className="whitespace-pre-wrap mt-1">{generateExcludedItemsText()}</pre>
</div>
)}
</div>

{/* Trade Discount and Contribution */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Trade Discount (%)"
type="number"
step="0.1"
value={tradeDiscountPercentage}
onChange={(e) => setTradeDiscountPercentage(e.target.value)}
placeholder="e.g. 40"
/>

<Input
label="Contribution (%)"
type="number"
step="0.1"
value={contributionPercentage}
onChange={(e) => setContributionPercentage(e.target.value)}
placeholder="e.g. 10"
/>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Parts Figure Quoted ($)"
type="number"
step="0.01"
name="partsQuotedFigure"
value={estimateData.partsQuotedFigure}
onChange={handleChange}
/>

<Input
label="Adjusted Parts Figure ($)"
type="number"
step="0.01"
name="partsAdjustedFigure"
value={estimateData.partsAdjustedFigure}
onChange={handleChange}
/>
</div>

<div className="space-y-1">
<label
htmlFor="partsRemarks"
className="block text-sm font-medium text-secondary-700"
>
Custom Section(A) Parts Remarks
</label>
<textarea
id="partsRemarks"
name="partsRemarks"
value={estimateData.partsRemarks}
onChange={handleChange}
rows={4}
className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
placeholder="Enter remarks about parts..."
/>
</div>

{/* Remarks Preview */}
{(excludedItemsList.length > 0 || tradeDiscountPercentage || contributionPercentage || estimateData.partsRemarks) && (
<div className="p-3 bg-gray-50 rounded border text-sm">
<strong>Remarks Preview:</strong>
<div className="mt-2 whitespace-pre-line text-gray-700">
{generateRemarksPreview()}
</div>
</div>
)}
</div>

<div className="border-t border-secondary-200 pt-4 space-y-4">
<h3 className="text-lg font-medium">Labour (Section B)</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Figure Quoted ($)"
type="number"
step="0.01"
name="labourQuotedFigure"
value={estimateData.labourQuotedFigure}
onChange={handleChange}
/>

<Input
label="Adjusted Labour & Material Figure ($)"
type="number"
step="0.01"
name="labourAdjustedFigure"
value={estimateData.labourAdjustedFigure}
onChange={handleChange}
/>
</div>

<Input
label="Repairs ought to be completed in (days)"
type="number"
name="completionDays"
value={estimateData.completionDays}
onChange={handleChange}
/>

{/* Labour Category Dropdown */}
          {/* Remarks Preview */}
          {(excludedItemsList.length > 0 || tradeDiscountPercentage || contributionPercentage || estimateData.partsRemarks) && (
            <div className="p-3 bg-gray-50 rounded border text-sm">
              <strong>Remarks Preview:</strong>
              <div className="mt-2 whitespace-pre-line text-gray-700">
                {generateRemarksPreview()}
              </div>
            </div>
          )}
          
<div className="space-y-2">
<label className="block text-sm font-medium text-secondary-700">
Labour Category
</label>
<Select
value={selectedLabourCategory}
onChange={(e) => setSelectedLabourCategory(e.target.value)}
options={labourCategoryOptions}
/>
</div>

{/* Dynamic fields based on labour category */}
{selectedLabourCategory === 'overstated' && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Original Figure ($)"
value={labourCategoryData.originalFigure}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, originalFigure: e.target.value }))}
placeholder="e.g. 14730.00"
/>
<Input
label="Adjusted Figure ($)"
value={labourCategoryData.adjustedFigure}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, adjustedFigure: e.target.value }))}
placeholder="e.g. 7690.00"
/>
</div>
)}

{selectedLabourCategory === 'negotiated' && (
<div className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
label="Person Name"
value={labourCategoryData.personName}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, personName: e.target.value }))}
placeholder="e.g. John Smith"
/>
<Input
label="Company/Location"
value={labourCategoryData.companyLocation}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, companyLocation: e.target.value }))}
placeholder="e.g. ABC Auto Body Shop"
/>
</div>
<Input
label="Agreed Figure ($)"
value={labourCategoryData.agreedFigure}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, agreedFigure: e.target.value }))}
placeholder="e.g. 8500.00"
/>
</div>
)}

{(selectedLabourCategory === 'estimated' || selectedLabourCategory === 'exceeds') && (
<Input
label="Labour Figure ($)"
value={labourCategoryData.labourFigure}
onChange={(e) => setLabourCategoryData(prev => ({ ...prev, labourFigure: e.target.value }))}
placeholder="e.g. 7500.00"
/>
)}

{/* Labour Remarks Preview */}
{selectedLabourCategory && (
<div className="p-3 bg-gray-50 rounded border text-sm">
<strong>Labour Remarks Preview:</strong>
<div className="mt-2 text-gray-700">
{generateLabourRemarksPreview()}
</div>
</div>
)}

<div className="space-y-1">
<label
htmlFor="labourRemarks"
className="block text-sm font-medium text-secondary-700"
>
Custom Section(B) Labour Remarks
</label>
<textarea
id="labourRemarks"
name="labourRemarks"
                value={estimateData.labourRemarks}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border border-secondary-300 shadow-sm px-3 py-2 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter remarks about labour..."
              />
            </div>
          </div>
          
          <FormNavigation onSubmit={handleSubmit} />
</div>
      </CardContent>
                onChange={(e) => {
                  handleChange(e);
                  // Force re-render to update labour preview
                  setTimeout(() => setEstimateData(prev => ({ ...prev, _forceUpdate: Date.now() })), 0);
                }}
</Card>
);
};