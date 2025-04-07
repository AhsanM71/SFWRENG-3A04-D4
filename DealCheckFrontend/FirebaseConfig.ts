// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from "expo-constants";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = initializeAuth(
    app,
    {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    }
);

/**
 * A method that gets the download url of an image from firebase storage to display
 * @param fileName The name of the file in firebase storage
 * @returns The download URL of the image
 */
export async function getStorageImgDownloadURL(fileName: string): Promise<string> {
  const imageRef = ref(storage, fileName);
  const url = await getDownloadURL(imageRef);
  return url
}