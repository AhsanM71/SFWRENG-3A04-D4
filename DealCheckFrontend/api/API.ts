import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const API_URL = Platform.OS === 'ios' ? 
    Constants.expoConfig?.extra?.apiUrlIos : 
    Constants.expoConfig?.extra?.apiUrlAndroid;

export const dealCheckAPI = axios.create({
    baseURL: API_URL
});

export const carRecommendationAPI = axios.create({
    baseURL: API_URL
});

export type APIResponse = {
    success: boolean,
    msg: string
};