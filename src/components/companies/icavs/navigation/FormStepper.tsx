import { CheckCircle2 } from 'lucide-react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { FormStep } from '../../../../types/companies/icavs/form';

const steps: { key: FormStep; label: string }[] = [
  { key: 'documents', label: 'Documents' },
  { key: 'header', label: 'Assignment Info' },
  { key: 'insured', label: 'Insured Details' },
  { key: 'vehicle', label: 'Vehicle Details' },
  { key: 'features', label: 'Features' },
  { key: 'condition', label: 'Condition' },
  { key: 'tyres', label: 'Tyres' },
  { key: 'damage', label: 'Damage' },
  { key: 'estimate', label: 'Estimate' },
  { key: 'recommendation', label: 'Recommendation' },
  { key: 'review', label: 'Review & Generate' },
];

export const FormStepper = () => {
  const { currentStep, goToStep } = useForm();
  
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="py-4 px-1 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          
          return (
            <button
              key={step.key}
              onClick={() => goToStep(step.key)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : isCompleted
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={16} className="text-primary-500" />
              ) : (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-secondary-200 text-xs">
                  {index + 1}
                </span>
              )}
              <span className="hidden md:inline">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};