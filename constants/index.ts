import { DealValuation, DecisionResult, RecentActivity } from "@/types"

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

export const mockResults: Array<DecisionResult> = [
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
    result: mockResults[0],
  },
  {
    carMake: "Honda",
    carModel: "Civic",
    carYear: "2019",
    mileage: "45,000",
    price: "18,500",
    condition: "Fair",
    result: mockResults[1],
  },
  {
    carMake: "Ford",
    carModel: "Focus",
    carYear: "2021",
    mileage: "15,000",
    price: "20,500",
    condition: "Good",
    result: mockResults[2],
  },
]


export const mockRecentActivities: Array<RecentActivity> = [
  {
    id: 0,
    title: "Toyota Camry 2020",
    date: "Yesterday",
    description: "Deal valuation completed",
    result: mockResults[0].decision,
  },
  {
    id: 1,
    title: "Honda Civic 2019",
    date: "2 days ago",
    description: "Deal valuation completed",
    result: mockResults[1].decision,
  },
  {
    id: 2,
    title: "Ford Focus 2021",
    date: "1 week ago",
    description: "Deal valuation completed",
    result: mockResults[2].decision,
  },
]