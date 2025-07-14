export interface ClaimsFormData {
  // Header Information
  letterDate: string;
  recipient: {
    name: string;
    address: string;
  };
  
  // Insured Information
  insured: string;
  
  // Reference Information
  dateReceived: string;
  yourRef: string;
  dateInspected: string;
  ourRef: string;
  dateOfLoss: string;
  invoice: string;
  numberOfPhotographs: number;
  witness: string;
  placeOfInspection: string;
  claimsTechnician: string;
  
  // Vehicle Information
  vehicle: {
    makeAndModel: string;
    fuelType: string;
    transmissionType: string;
    registration: string;
    yearOfManufacture: string;
    color: string;
    odometer: number;
    identification: {
      vinChassis: string;
      engine: string;
    };
    isForeignUsed: boolean;
  };
  
CustomFeature : {
  name: string;
  checked: boolean;
}

// Update your features object in ClaimsFormData to include:
features: {
  antiTheftDevice: boolean;
  hubCaps: boolean;
  airCondition: boolean;
  powerWindows: boolean;
  powerMirror: boolean;
  foldingWingMirrors: boolean;
  driverPassengerAirbags: boolean;
  radio: boolean;
  cdDeck: boolean;
  displayScreen: boolean;
  multifunctionalSteeringWheel: boolean;
  fogLamps: boolean;
  rearCamera: boolean;
  tractionControl: boolean;
  absBrakingSystem: boolean;
  rearWiper: boolean;
  ecoMode: boolean;
  customFeatures?: CustomFeature[]; 
};

  
  // Condition Prior to Loss
  condition: {
    body: string;
    paint: string;
    specializedPaint: string;
    doorUpholstery: string;
    seatTrim: string;
  };
  
  // Previous Damage/Repairs
  previousDamage: string;
  previousRepairs: string;
  
  // General Remarks
  generalRemarks: string;
  
  // Tyres Information
  tyres: {
    rightFront: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    leftFront: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    rightRear: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    leftRear: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
  };
  
  // Nature of Damage
  damage: {
    affectedArea: string;
    deformationSeverity: string;
    affectedStructuralComponents: string;
  };
  
  // Estimate
  estimate: {
    from: string;
    dated: boolean;
    invoiceFrom: string;
    invoiceDated: string;
    
    // Parts
    parts: {
      adjustedSource: string;
      excludedItems: string[];
      remarks: string;
      quotedFigure: number;
      adjustedFigure: number;
    };
    
    // Labour
    labour: {
      remarks: string;
      quotedFigure: number;
      adjustedFigure: number;
    };
    
    completionDays: number;
  };
  
  // Recommendation
  recommendation: {
    settlementBasis: string;
    apparentCostOfRepairs: number;
    preAccidentValue: number;
    settlementOffer: number;
    reserve: number;
    remarks: string;
  };
  
  // Vehicle Information
  vehicle: {
    makeAndModel: string;
    fuelType: string;
    transmissionType: string;
    registration: string;
    yearOfManufacture: string;
    color: string;
    odometer: number;
    identification: {
      vinChassis: string;
      engine: string;
    };
    isForeignUsed: boolean;
  };
  
  // Vehicle Features
  features: {
    antiTheftDevice: boolean;
    hubCaps: boolean;
    airCondition: boolean;
    powerWindows: boolean;
    powerMirror: boolean;
    foldingWingMirrors: boolean;
    driverPassengerAirbags: boolean;
    radio: boolean;
    cdDeck: boolean;
    displayScreen: boolean;
    multifunctionalSteeringWheel: boolean;
    fogLamps: boolean;
    rearCamera: boolean;
    tractionControl: boolean;
    absBrakingSystem: boolean;
    rearWiper: boolean;
    ecoMode: boolean;
  };
  
  // Condition Prior to Loss
  condition: {
    body: string;
    paint: string;
    specializedPaint: string;
    doorUpholstery: string;
    seatTrim: string;
  };
  
  // Previous Damage/Repairs
  previousDamage: string;
  previousRepairs: string;
  
  // General Remarks
  generalRemarks: string;
  
  // Tyres Information
  tyres: {
    rightFront: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    leftFront: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    rightRear: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
    leftRear: {
      make: string;
      size: string;
      treadDepth: string;
      condition: string;
    };
  };
  
  // Nature of Damage
  damage: {
    affectedArea: string;
    deformationSeverity: string;
    affectedStructuralComponents: string;
  };
  
  // Estimate
  estimate: {
    from: string;
    dated: boolean;
    invoiceFrom: string;
    invoiceDated: string;
    
    // Parts
    parts: {
      adjustedSource: string;
      excludedItems: string[];
      remarks: string;
      quotedFigure: number;
      adjustedFigure: number;
    };
    
    // Labour
    labour: {
      remarks: string;
      quotedFigure: number;
      adjustedFigure: number;
    };
    
    completionDays: number;
  };
  
  // Recommendation
  recommendation: {
    settlementBasis: string;
    apparentCostOfRepairs: number;
    preAccidentValue: number;
    settlementOffer: number;
    reserve: number;
    remarks: string;
  };
}

export type FormStep = 
  | 'header'
  | 'insured'
  | 'vehicle'
  | 'features'
  | 'condition'
  | 'tyres'
  | 'damage'
  | 'estimate'
  | 'recommendation'
  | 'review';