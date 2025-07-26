import { createContext, ReactNode, useContext, useState } from "react";
import { ClaimsFormData, FormStep } from "../../../types/companies/icavs/form";

type FormContextType = {
  formData: Partial<ClaimsFormData>;
  updateFormData: (data: Partial<ClaimsFormData>) => void;
  currentStep: FormStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: FormStep) => void;
  isLastStep: boolean;
};

export const defaultFormData: Partial<ClaimsFormData> = {
  documents: [],
  letterDate: new Date().toISOString().split("T")[0],
  recipient: {
    name: "Maritime General Insurance Company Limited",
    address: "Maritime Centre, Barataria.",
  },
  insured: "John Smith",
  dateReceived: "2024-03-15",
  yourRef: "REF-2024-001",
  dateInspected: "2024-03-16",
  ourRef: "ICAVS-2024-001",
  dateOfLoss: "2024-03-14",
  invoice: "INV-2024-001",
  numberOfPhotographs: 12,
  witness: "Mary Johnson",
  placeOfInspection: "ICAVS Service Center",
  claimsTechnician: "David Williams",

  vehicle: {
    makeAndModel: "Toyota Camry SE",
    fuelType: "gasoline",
    transmissionType: "AT",
    registration: "PCS 1234",
    yearOfManufacture: "2022",
    color: "Pearl White",
    odometer: 15000,
    identification: {
      vinChassis: "JT2BF22K1W0123456",
      engine: "2AZ-FE123456",
    },
    isForeignUsed: false,
  },

  features: {
    antiTheftDevice: true,
    hubCaps: true,
    airCondition: true,
    powerWindows: true,
    powerMirror: true,
    foldingWingMirrors: true,
    driverPassengerAirbags: true,
    radio: true,
    cdDeck: false,
    displayScreen: true,
    multifunctionalSteeringWheel: true,
    fogLamps: true,
    rearCamera: true,
    tractionControl: true,
    absBrakingSystem: true,
    rearWiper: true,
    ecoMode: true,
  },

  condition: {
    body: "Excellent",
    paint: "Excellent",
    specializedPaint: "Pearl White Metallic",
    doorUpholstery: "Excellent",
    seatTrim: "Excellent",
  },

  previousDamage: "None visible",
  previousRepairs: "None visible",
  generalRemarks: "",

  tyres: {
    rightFront: {
      make: "Michelin",
      size: "215/55R17",
      treadDepth: "7mm",
      condition: "Excellent",
    },
    leftFront: {
      make: "Michelin",
      size: "215/55R17",
      treadDepth: "7mm",
      condition: "Excellent",
    },
    rightRear: {
      make: "Michelin",
      size: "215/55R17",
      treadDepth: "6.5mm",
      condition: "Good",
    },
    leftRear: {
      make: "Michelin",
      size: "215/55R17",
      treadDepth: "6.5mm",
      condition: "Good",
    },
  },

  damage: {
    affectedArea: "Left broadside",
    deformationSeverity: "Major",
    affectedStructuralComponents: 'Left "B" pillar and left rear wheel arch',
  },

  estimate: {
    from: "Elite Auto Body Shop",
    estimateDate: "2025-04-23",
    dated: true,
    invoiceFrom: "Parts Plus Limited",
    invoiceDated: "2024-03-16",
    parts: {
      adjustedSource: "OEM Toyota Parts",
      excludedItems: [
        "Rear bumper - To repair",
        "Left quarter panel - To repair",
      ],
      remarks: "All parts are genuine Toyota OEM parts",
      quotedFigure: 5800.0,
      adjustedFigure: 5200.0,
    },
    labour: {
      remarks: "",
      quotedFigure: 2200.0,
      adjustedFigure: 2000.0,
    },
    completionDays: 14,
  },

  recommendation: {
    settlementBasis: "Repair or Cash In Lieu of Repair Basis",
    apparentCostOfRepairs: 7200.0,
    preAccidentValue: 45000.0,
    settlementOffer: 7200.0,
    reserve: 8000.0,
    remarks: "Recommend proceeding with repairs at approved facility.",
  },
};

const steps: FormStep[] = [
  "documents",
  "header",
  "insured",
  "vehicle",
  "features",
  "condition",
  "tyres",
  "damage",
  "estimate",
  "recommendation",
  "review",
];

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] =
    useState<Partial<ClaimsFormData>>(defaultFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>("header");

  const updateFormData = (data: Partial<ClaimsFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: FormStep) => {
    if (steps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const isLastStep = steps.indexOf(currentStep) === steps.length - 1;

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        isLastStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
