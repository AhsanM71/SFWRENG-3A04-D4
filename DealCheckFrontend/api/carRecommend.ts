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

export type RecommendationRetrieval = {
  user_id: string;
}

export type CurveRequest = {
  user_id: {
    id: string;
  };
  car: {
    year: string;
    make: string;
    model: string;
    price: string;
  };
};

export type CurveRequestResponse = APIResponse & {
  user_id: {
    id: string;
  };
  car: {
    year: string,
    make: string;
    model: string;
    price: string;
  }
  depreciation: {
    depreciationCurveSrc: string;
  }
};

export type CarRecommendRetriever = {
  doc_id: string;
}

export async function carRecommendRequest(data: CarRecommendRequest): Promise<CarRecommendResponse> {
    const carRecommendData: CarRecommendResponse = await sendCarRecommendRequest<CarRecommendResponse>('/rec/carRecommendation', data);
    return carRecommendData;
}

export async function carRecommendRetrieve(data: CarRecommendRetriever): Promise<CarRecommendResponse> {
  const carRecommendData: CarRecommendResponse = await sendCarRecommendRequest<CarRecommendResponse>('/rec/carRecommendation/retrieve', data);
  return carRecommendData;
}

export async function recommendationRetrieval(data: RecommendationRetrieval): Promise<CarRecommendResponse> {
  const carRecommendData: CarRecommendResponse = await sendCarRecommendRequest<CarRecommendResponse>('/rec/carRecommendation/user',data);
  return carRecommendData;
}

export async function curveRetrieval(data: CurveRequest): Promise<CurveRequestResponse> {
  const curveData: CurveRequestResponse = await sendCarRecommendRequest<CurveRequestResponse>('/rec/carRecommendation/curve',data);
  return curveData;
}