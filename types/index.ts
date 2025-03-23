export type DecisionResult = {
  decision: "GOOD" | "BAD";
  confidence: number;
  reports: Array<{
    agentName: string;
    decision: "GOOD" | "BAD";
    reasoning: string;
  }>;
};

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