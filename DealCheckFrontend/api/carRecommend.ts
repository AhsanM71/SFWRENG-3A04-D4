import { APIResponse, carRecommendationAPI } from "@/api/API";
import { FormattedData } from "@/types/index";

async function sendCarRecommendRequest<T>(path: string, data: object): Promise<T> {
    const response = await carRecommendationAPI.post<T>(path, data);
    const responseData: T = response.data;
    return responseData;
}
export type CarRecommendResponse = APIResponse & {
    user_id: {
        id: string;
    };      
    description: {
        user_preferences: string;
    };
    answers: {
        recommendation_info: string;
        pros: string;
        cons: string;
    };
};

export async function carRecommendRequest(data: FormattedData): Promise<CarRecommendResponse> {
    const carRecommendData: CarRecommendResponse = await sendCarRecommendRequest<CarRecommendResponse>('/recommend/carRecommendation', data);
    return carRecommendData;
}