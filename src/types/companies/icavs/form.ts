interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface ClaimsFormData {
  id: number;
  // Documents
  documents?: UploadedFile[];

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
    estimateDate: string;
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
  | "documents"
  | "header"
  | "insured"
  | "vehicle"
  | "features"
  | "condition"
  | "tyres"
  | "damage"
  | "estimate"
  | "recommendation"
  | "review";

export interface InvoiceData {
  // Company Information
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    vatRegistration: string;
  };

  // Invoice Information
  invoice: {
    date: string;
    number: string;
  };

  // Bill To Information
  billTo: {
    name: string;
    address: string;
  };

  // Insured Details
  insured: {
    name: string;
    vehicleType: string;
  };

  // Third Party Information
  thirdParty: {
    name: string;
    vehicle: string;
  };

  // Reference Information
  reference: {
    our: string;
    your: string;
    claimsTechnician: string;
    dateOfLoss: string;
    adjuster: string;
  };

  // Service Items
  items: Array<{
    code: string;
    description: string;
    qty: number;
    rate: number;
    amount: number;
  }>;

  // Financial Information
  financial: {
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    total: number;
    paymentsCredits: number;
    balanceDue: number;
  };
}

export const invoiceData: InvoiceData = {
  company: {
    name: "Independent Claims Adjusting & Valuation Services Limited",
    address: "#139 Eastern Main Road, Barataria.",
    phone: "1 (868) 235-5069",
    email: "icavslimited@gmail.com",
    vatRegistration: "131269",
  },
  invoice: {
    date: "4/4/2022",
    number: "17-9434",
  },
  billTo: {
    name: "Maritime General Insurance Co. Limited",
    address: "Maritime Centre,\nBarataria.",
  },
  insured: {
    name: "Unknown",
    vehicleType: "T/p: Nissan Primera Seda",
  },
  thirdParty: {
    name: "A. Harding",
    vehicle: "PBM-7555",
  },
  reference: {
    our: "202204009",
    your: "PCP-576-736-001",
    claimsTechnician: "Shane Marchan",
    dateOfLoss: "3/26/2022",
    adjuster: "UR",
  },
  items: [
    {
      code: "PBM-7555 (SUR)",
      description: "To survey vehicle and report",
      qty: 1,
      rate: 500.0,
      amount: 500.0,
    },
  ],
  financial: {
    subtotal: 500.0,
    vatRate: 12.5,
    vatAmount: 62.5,
    total: 562.5,
    paymentsCredits: 0.0,
    balanceDue: 562.5,
  },
};
