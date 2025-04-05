import { APIResponse, carRecommendationAPI } from "@/api/API";

async function sendCarRecommendRequest<T>(path: string, data: object): Promise<T> {
    const response = await carRecommendationAPI.post<T>(path, data);
    const responseData: T = response.data;
    return responseData;
}

export type CarRecommendRequest = {
  user_id: {
    id: string;
  };
  description: {
    user_preferences: string;
  };
  recommendation: {
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
  };
}

export type CarRecommendResponse = APIResponse & {
  user_id: {
    id: string;
  };
  description: {
    user_preferences: string;
  };
  recommendation: {
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
  };
};

export async function carRecommendRequest(data: CarRecommendRequest): Promise<CarRecommendResponse> {
    const carRecommendData: CarRecommendResponse = await sendCarRecommendRequest<CarRecommendResponse>('/recommend/carRecommendation', data);
    return carRecommendData;
}