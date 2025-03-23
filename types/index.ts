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

export type RecentActivity = {
  id: number
  title: string
  date: string
  description: string
  result: "RECOMMENDED" | "NOT RECOMMENDED"
}

export type DecisionResult = {
  decision: "RECOMMENDED" | "NOT RECOMMENDED";
  confidence: number;
  reports: Array<{
    agentName: string;
    decision: "GREAT" | "GOOD" | "FAIR" | "WEAK" | "AWFUL";
    reasoning: string;
  }>;
};

export type DealValuation = {
  carMake: string;
  carModel: string;
  carYear: string;
  mileage: string;
  price: string;
  condition: string;
  result: DecisionResult;
}