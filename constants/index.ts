import { DecisionResult } from "@/types"

export const menuItems = [
  {
    id: "account",
    title: "Account Information",
    icon: "user",
    screen: "Account",
    color: "#3498db",
  },
  {
    id: "dealValuation",
    title: "Deal Valuation",
    icon: "check-circle",
    screen: "DealValuation",
    color: "#2ecc71",
  },
  {
    id: "carRecommendation",
    title: "Car Recommendations",
    icon: "star",
    screen: "CarRecommendation",
    color: "#f39c12",
  },
]

export const mockResults: DecisionResult = {
  decision: "GOOD",
  confidence: 85,
  reports: [
    {
      agentName: "Market Analyst",
      decision: "GOOD",
      reasoning:
        "The price is 12% below market average for this make, model, and year. Recent sales data shows similar vehicles selling for $2,000-$3,000 more.",
    },
    {
      agentName: "Condition Evaluator",
      decision: "GOOD",
      reasoning:
        "The mileage is below average for a vehicle of this age. The condition described suggests normal wear and tear with no major mechanical issues.",
    },
    {
      agentName: "Value Predictor",
      decision: "GOOD",
      reasoning:
        "Depreciation rate for this model is slower than average. Resale value is projected to remain strong over the next 3 years.",
    },
  ],
}

export const carImages: { [key: string]: any } = {
  "car1": require("../assets/images/2020_toyota_rav4.jpg"),
  "car2": require("../assets/images/2015_honda_accord.jpg"),
  "car3": require("../assets/images/2019_mazda_cx5.jpg"),
}

export const mockRecommendations = [
  {
    make: "Toyota",
    model: "RAV4",
    year: "2020",
    price: "25,900",
    image: "car1",
    description: "The Toyota RAV4 is a reliable compact SUV with excellent fuel economy and a spacious interior.",
    pros: [
      "Excellent reliability ratings",
      "Good fuel economy",
      "Spacious cargo area",
      "Standard safety features",
    ],
    cons: ["Engine can be noisy", "Firm ride quality"],
  },
  {
    make: "Honda",
    model: "Accord",
    year: "2015",
    price: "24,500",
    image: "car2",
    description:
      "The Honda Accord is a midsize sedan known for its comfortable ride, spacious interior, and fuel efficiency.",
    pros: ["Upscale interior", "Engaging driving dynamics", "Spacious seating", "Excellent fuel economy"],
    cons: ["No all-wheel drive option", "Some road noise at highway speeds"],
  },
  {
    make: "Mazda",
    model: "CX-5",
    year: "2019",
    price: "22,800",
    image: "car3",
    description:
      "The Mazda CX-5 is a compact crossover SUV known for its upscale interior and engaging driving dynamics.",
    pros: ["Upscale interior design", "Engaging handling", "Premium feel for the price", "Strong safety ratings"],
    cons: ["Less cargo space than competitors", "Infotainment system can be finicky"],
  },
]