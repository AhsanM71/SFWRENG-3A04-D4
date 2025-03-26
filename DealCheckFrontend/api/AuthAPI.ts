import { APIResponse, dealCheckAPI } from "@/api/API";

async function sendAuthRequest<T>(path: string, data: object): Promise<T> {
    const response = await dealCheckAPI.post<T>(path, data);
    const responseData: T = response.data;
    return responseData;
}

export type LoginResponse = APIResponse & {
    uid: string | undefined
}

/**
 * 
 * @param email The email of the user to be authenticated
 * @param password The password of the email to be authenticated
 * @returns The response of the login API request
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
    const login: LoginResponse = await sendAuthRequest<LoginResponse>('/auth/login', { email: email, password: password });
    return login;
}

export type LogoutResponse = APIResponse;

/**
 * 
 * @param token The id token of the authenticated user
 * @returns The response of the logout API request
 */
export async function logoutRequest(token: string | undefined): Promise<LogoutResponse> {
    const logout: LogoutResponse = await sendAuthRequest<LogoutResponse>('/auth/logout', { token: token });
    return logout
}