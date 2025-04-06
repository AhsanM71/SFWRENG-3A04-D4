export type ValuationResult = {
  decision: "RECOMMENDED" | "NOT RECOMMENDED"
  confidence: number
  image: string | null
  reports: Array<{
    agent: string,
    decision: "GREAT" | "GOOD" | "FAIR" | "WEAK" | "AWFUL"
    reasoning: string
  }>;
};

export type DealValuation = {
  carMake: string
  carModel: string
  carYear: number
  mileage: number
  price: number
  condition: string
  result: ValuationResult
}

export type Recommendation = {
  price: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  mileage: number;
  condition: string;
  accident_history: string;
  previous_owners: number;
  image: string | null;
  description: string;
  pros: string[];
  cons: string[];
  overall_description: string;
  depreciationCurveSrc: string;
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