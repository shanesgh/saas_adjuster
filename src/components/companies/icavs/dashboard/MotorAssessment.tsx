import React from 'react';
import { FormProvider } from '../../../../context/companies/icavs/FormContext';
import { FormStepper } from '../navigation/FormStepper';
import { 
  HeaderForm, 
  InsuredForm, 
  VehicleForm, 
  FeaturesForm, 
  ConditionForm, 
  TyresForm, 
  DamageForm, 
  EstimateForm, 
  RecommendationForm, 
  ReviewForm 
} from '../forms';
import { useForm } from '../../../../context/companies/icavs/FormContext';

const FormContent = () => {
  const { currentStep } = useForm();
  
  switch (currentStep) {
    case 'header':
      return <HeaderForm />;
    case 'insured':
      return <InsuredForm />;
    case 'vehicle':
      return <VehicleForm />;
    case 'features':
      return <FeaturesForm />;
    case 'condition':
      return <ConditionForm />;
    case 'tyres':
      return <TyresForm />;
    case 'damage':
      return <DamageForm />;
    case 'estimate':
      return <EstimateForm />;
    case 'recommendation':
      return <RecommendationForm />;
    case 'review':
      return <ReviewForm />;
    default:
      return <HeaderForm />;
  }
};

export const MotorAssessment = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-secondary-50">
        <main className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto mt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Motor Assessment Form</h1>
              <p className="text-gray-600">Complete the digital claims form for motor vehicle assessment</p>
            </div>
            <FormStepper />
            <div className="mt-6 transition-all">
              <FormContent />
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
};