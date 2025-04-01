import { APIResponse, dealCheckAPI } from "@/api/API";
import { FormattedData } from "@/types/index";

async function sendDealCheckRequest<T>(path: string, data: object): Promise<T> {
    const response = await dealCheckAPI.post<T>(path, data);
    const responseData: T = response.data;
    return responseData;
}

export type ValuationResponse = APIResponse & {
    success: boolean;
    msg: string;
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
        prediction: string;
        actual: string;
        confidence: number;
    };
};

export async function valuationRequest(data: FormattedData): Promise<ValuationResponse> {
    const valuationData: ValuationResponse = await sendDealCheckRequest<ValuationResponse>('/val/dealCheck', { data });
    return valuationData;
}