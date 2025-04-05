import { APIResponse, dealCheckAPI } from "@/api/API";

async function sendAuthRequest<T>(path: string, data: object): Promise<T> {
    const response = await dealCheckAPI.post<T>('/auth'+path, data);
    const responseData: T = response.data;
    return responseData;
}

export type LoginResponse = APIResponse & {
    uid: string | undefined,
    token: string | undefined
}

/**
 * 
 * @param email The email of the user to be authenticated
 * @param password The password of the email to be authenticated
 * @returns The response of the login API request
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
    const login: LoginResponse = await sendAuthRequest<LoginResponse>('/login', { email: email, password: password });
    return login;
}

export type RegistrationResponse = APIResponse & {
    uid: string | undefined,
    token: string | undefined
};

/**
 * 
 * @param email The email of the user being created
 * @param password The password of the user being created
 * @param username The username of the user being created
 * @param phoneNumber The phone number of the user being created
 * @returns The registration API response
 */
export async function registrationRequest(email: string, password: string, username: string, phoneNumber: string): Promise<RegistrationResponse> {
    const signup: RegistrationResponse = await sendAuthRequest<RegistrationResponse>('/signup', {
        username: username,
        email: email,
        password: password,
        phoneNumber: phoneNumber
    });
    return signup
}

export type LogoutResponse = APIResponse;

/**
 * 
 * @param token The id token of the authenticated user
 * @returns The response of the logout API request
 */
export async function logoutRequest(token: string | undefined): Promise<LogoutResponse> {
    const logout: LogoutResponse = await sendAuthRequest<LogoutResponse>('/logout', { token: token });
    return logout
}

export type EditAccountResponse = APIResponse & {
    username: string,
    email: string,
    phoneNumber: string
};

/**
 * 
 * @param token The auth token of the user being edited
 * @param username The new username of the user being edited
 * @param email The new email of the user being edited
 * @param phoneNumber The new phone number of the user being edited
 * @param password The new password of the user being editted
 * @returns The edit account API response
 */
export async function editRequest(token: string | undefined, username: string, email: string, phoneNumber: string, password: string) {
    if(!password)
        password = 'N/A___INAPPLICABLE';

    const edit: EditAccountResponse = await sendAuthRequest<EditAccountResponse>('/account/edit', {
        token: token,
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        password: password
    });
    return edit;
}