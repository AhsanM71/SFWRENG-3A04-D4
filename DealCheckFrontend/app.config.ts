import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "DealCheck",
  slug: "dealcheck",
  scheme: "dealcheck",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/blackCar.png",
  userInterfaceStyle: "light",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.3a04.dealcheck"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/blackCar.png",
      backgroundColor: "#F9F9F9"
    },
    package: "com.x3a04.dealcheck"
  },
  web: {
    favicon: "./assets/images/whiteCar.png"
  },
  jsEngine: "hermes",
  newArchEnabled: true,
  extra: {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    apiUrlIos: process.env.EXPO_PUBLIC_API_URL_IOS,
    apiUrlAndroid: process.env.EXPO_PUBLIC_API_URL_ANDROID,
    eas: {
      projectId: "f796e827-db4f-41f3-a78b-f701f7a9714a"
    }
  }
});