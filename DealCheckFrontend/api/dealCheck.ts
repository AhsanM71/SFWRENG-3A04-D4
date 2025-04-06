import { APIResponse, dealCheckAPI } from "@/api/API";

async function sendDealCheckRequest<T>(path: string, data: object): Promise<T> {
  const response = await dealCheckAPI.post<T>(path, data);
  const responseData: T = response.data;
  return responseData;
}

export type ValuationRetrieval = {
  user_id: string;
}

export type ValuationRequest = {
  user_id: {
    id: string;
  };
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

export type ValuationResponse = APIResponse & {
  user_id: {
    id: string;
  };
  car_details: {
    make: string;
    model: string;
    year: number;
    trim: string;
    mileage: number;
    condition: string;
    accident_history: boolean;
    previous_owners: number;
    image: string;
    description: string;
  };
  pricing: {
    price: number;
  };
  seller_info: {
    seller_type: string;
    warranty: string;
    inspection_completed: boolean;
  };
  additonal_info: {
    fuel_efficiency_mpg: number;
    insurance_estimate: number;
    resale_value: number;
  };
  answers: {
    predicted: string;
    actual: string;
    confidence: number;
    rationale: string;
    expert: string;
  };
};

export async function valuationRequest(data: ValuationRequest): Promise<ValuationResponse> {
  const valuationData: ValuationResponse = await sendDealCheckRequest<ValuationResponse>('/val/dealCheck', data);
  return valuationData;
}

export async function valuationRetrieval(data: ValuationRetrieval): Promise<ValuationResponse> {
  const valuationData: ValuationResponse = await sendDealCheckRequest<ValuationResponse>('/val/dealCheck/user',data);
  return valuationData;
}