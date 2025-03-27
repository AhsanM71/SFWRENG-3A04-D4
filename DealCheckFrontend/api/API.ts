import axios from "axios";
import { Platform } from "react-native";

export const API_URL = Platform.OS === 'ios' ? 
    process.env.EXPO_PUBLIC_API_URL_IOS : 
    process.env.EXPO_PUBLIC_API_URL_ANDROID;

export const dealCheckAPI = axios.create({
    baseURL: API_URL
});

export type APIResponse = {
    success: boolean,
    msg: string
};