import { APIResponse, dealCheckAPI } from "@/api/API";

async function sendDealCheckRequest<T>(path: string, data: object): Promise<T> {
    const response = await dealCheckAPI.post<T>(path, data);
    const responseData: T = response.data;
    return responseData;
}

export type valuationResponse = APIResponse & {
    uid: string | undefined,
    token: string | undefined
};