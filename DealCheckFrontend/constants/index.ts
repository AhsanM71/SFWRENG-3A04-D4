import { DealValuation, ValuationResult, Activity } from "@/types"

export const menuItems = [
  {
    id: "account",
    title: "Account Information",
    icon: "user",
    screen: "/account",
    color1: "#4A90E2",
    color2: "#1C74D5"
  },
  {
    id: "dealValuation",
    title: "Deal Valuation",
    icon: "check-circle",
    screen: "/deal-valuation",
    color1: "#2ECC71",
    color2: "#27AE60",
  },
  {
    id: "carRecommendation",
    title: "Car Recommendations",
    icon: "star",
    screen: "/car-recommendation",
    color1: "#F1C40F",
    color2: "#F39C12"
  },
  {
    id: "depreciationCurve",
    title: "Depreciation Curve",
    icon: "trending-down",
    screen: "/depreciation-curve",
    color1: "#E74C3C",
    color2: "#C0392B"
  },
]

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

export const mockValuationResults: Array<ValuationResult> = [
  { // Toyota Camry 2020
    decision: "RECOMMENDED",
    confidence: 90,
    reports: [
      {
        agentName: "Market Analyst",
        decision: "GREAT",
        reasoning:
          "The price is 12% below market average for this make, model, and year. Recent sales data shows similar vehicles selling for $2,000-$3,000 more.",
      },
      {
        agentName: "Condition Evaluator",
        decision: "GOOD",
        reasoning:
          "The mileage is well below average for a vehicle of this age. While the condition is solid, it is not exceptional.",
      },
      {
        agentName: "Value Predictor",
        decision: "FAIR",
        reasoning:
          "Depreciation for this model is in line with average, but the resale value may not be as strong as similar vehicles with a better reputation for longevity.",
      },
    ],
  },
  { // Honda Civic 2019
    decision: "NOT RECOMMENDED",
    confidence: 70,
    reports: [
      {
        agentName: "Market Analyst",
        decision: "FAIR",
        reasoning:
          "The price is near the market average, but you can find similar cars at better prices. There are better deals available for the same model.",
      },
      {
        agentName: "Condition Evaluator",
        decision: "WEAK",
        reasoning:
          "The vehicle has higher mileage for its age, and some parts show signs of wear. This is likely to require more maintenance in the near future.",
      },
      {
        agentName: "Value Predictor",
        decision: "AWFUL",
        reasoning:
          "This model's depreciation is higher than expected, and given the mileage and condition, the car may lose significant value quickly.",
      },
    ],
  },
  { // Ford Focus 2021
    decision: "NOT RECOMMENDED",
    confidence: 80,
    reports: [
      {
        agentName: "Market Analyst",
        decision: "WEAK",
        reasoning:
          "The price is slightly above the market average for this model. Comparable vehicles from other manufacturers are priced more competitively.",
      },
      {
        agentName: "Condition Evaluator",
        decision: "GOOD",
        reasoning:
          "The vehicle is in decent condition for a 2021 model. No major mechanical issues were found, and the exterior looks good. However, some minor interior wear is visible.",
      },
      {
        agentName: "Value Predictor",
        decision: "AWFUL",
        reasoning:
          "This model has a higher-than-average depreciation rate. Given the pricing and overall value projections, this car is expected to lose its value much faster than similar models.",
      },
    ],
  },
]

export const mockValuations: Array<DealValuation> = [
  {
    carMake: "Toyota",
    carModel: "Camry",
    carYear: "2020",
    mileage: "25,000",
    price: "22,000",
    condition: "Good",
    result: mockValuationResults[0],
  },
  {
    carMake: "Honda",
    carModel: "Civic",
    carYear: "2019",
    mileage: "45,000",
    price: "18,500",
    condition: "Fair",
    result: mockValuationResults[1],
  },
  {
    carMake: "Ford",
    carModel: "Focus",
    carYear: "2021",
    mileage: "15,000",
    price: "20,500",
    condition: "Good",
    result: mockValuationResults[2],
  },
]

export const mockDepreciationCurve = require("../assets/images/carDepreciationCurve.png")

export const mockActivities: Array<Activity> = [
  {
    id: 0,
    type: "Deal Valuation",
    date: "Yesterday",
    description: "Toyota Camry 2020",
    data: mockValuations[0],
  },
  {
    id: 1,
    type: "Recommendation",
    date: "2 days ago",
    description: "Reliable and Affordable SUV",
    data: mockRecommendations,
  },
  {
    id: 2,
    type: "Deal Valuation",
    date: "1 week ago",
    description: "Honda Civic 2019",
    data: mockValuations[1],
  },
  {
    id: 3,
    type: "Deal Valuation",
    date: "2 week ago",
    description: "Ford Focus 2021",
    data: mockValuations[2],
  },
]