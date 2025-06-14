import React from 'react';
import { FormProvider } from './context/FormContext';
import { Header } from './components/Header';
import { FormStepper } from './components/FormStepper';
import { HeaderForm } from './components/forms/HeaderForm';
import { InsuredForm } from './components/forms/InsuredForm';
import { VehicleForm } from './components/forms/VehicleForm';
import { FeaturesForm } from './components/forms/FeaturesForm';
import { ConditionForm } from './components/forms/ConditionForm';
import { TyresForm } from './components/forms/TyresForm';
import { DamageForm } from './components/forms/DamageForm';
import { EstimateForm } from './components/forms/EstimateForm';
import { RecommendationForm } from './components/forms/RecommendationForm';
import { ReviewForm } from './components/forms/ReviewForm';
import { useForm } from './context/FormContext';

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

function App() {
  return (
    <FormProvider>
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto mt-8">
            <FormStepper />
            <div className="mt-6 transition-all">
              <FormContent />
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}

export default App;