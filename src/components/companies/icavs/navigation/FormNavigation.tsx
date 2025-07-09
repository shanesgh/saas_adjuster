import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Button } from "../../../ui/button";

interface FormNavigationProps {
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  onGeneratePdf?: () => void;
}

export const FormNavigation = ({
  onSubmit,
  isSubmitting = false,
  canSubmit = true,
  onGeneratePdf,
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
            variant="default"
            onClick={onSubmit || goToNextStep}
            type={onSubmit ? "submit" : "button"}
            className="flex items-center gap-1"
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