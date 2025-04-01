export type ValuationResult = {
  decision: "RECOMMENDED" | "NOT RECOMMENDED"
  confidence: number
  reports: Array<{
    agentName: string
    decision: "GREAT" | "GOOD" | "FAIR" | "WEAK" | "AWFUL"
    reasoning: string
  }>;
};

export type DealValuation = {
  carMake: string
  carModel: string
  carYear: string
  mileage: string
  price: string
  condition: string
  result: ValuationResult
}

export type Recommendation = {
  make: string
  model: string
  year: string
  price: string
  image: string
  description: string
  pros: string[]
  cons: string[]
}

export type DepreciationCurve = {
  
}

export type ActivityType = "Deal Valuation" | "Recommendation" | "Depreciation Curve"

export type ActivityData = DealValuation | Array<Recommendation> | DepreciationCurve

export type Activity = {
  id: number
  type: ActivityType
  date: string
  description: string
  data: ActivityData
}

export type FormattedData = {
  car_details: {
    make: string;
    model: string;
    year: number;
    trim: string;
    mileage: number;
    condition: string;
    accident_history: boolean;
    previous_owners: number;
    image: string | null;
    description: string;
  };
  pricing: {
    listed_price: number;
  };
  seller_info: {
    seller_type: string;
    warranty: string;
    inspection_completed: boolean;
  };
  additional_factors: {
    fuel_efficiency_mpg: number;
    insurance_estimate: number;
    resale_value_estimate: number;
  };
  answers: {
    predicted: string;
    actual: string;
  };
}