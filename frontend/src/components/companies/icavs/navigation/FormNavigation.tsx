import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Button } from "../../../ui/button";

export type ReviewStatus = 'pending' | 'review' | 'cancelled' | 'completed';

interface FormNavigationProps {
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  onGeneratePdf?: () => void;
  customButtons?: React.ReactNode;
}

export const FormNavigation = ({
  onSubmit,
  isSubmitting = false,
  canSubmit = true,
  onGeneratePdf,
  customButtons,
}: FormNavigationProps) => {
  const { goToPreviousStep, goToNextStep, isLastStep } = useForm();

  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        type="button"
        className="flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>

      <div className="flex gap-2">
        {customButtons}
        
        {isLastStep ? (
          <Button
            variant="default"
            onClick={onGeneratePdf}
            className="flex items-center gap-1"
            disabled={!canSubmit}
          >
            <FileText size={16} />
            <span>Generate PDF</span>
          </Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            onClick={onSubmit || goToNextStep}
            type={onSubmit ? "submit" : "button"}
            disabled={isSubmitting || !canSubmit}
          >
            <span>Save</span>
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};