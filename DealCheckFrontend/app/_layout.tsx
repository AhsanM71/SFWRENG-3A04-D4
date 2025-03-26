import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "", headerShown: false }} />  
          <Stack.Screen name="sign-up" options={{ title: "Create Account" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="home" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="account" options={{ title: "Account Information" }} />
          <Stack.Screen name="edit-account" options={{ title: "Edit Profile" }} />
          <Stack.Screen name="deal-valuation" options={{ title: "Deal Valuation" }} />
          <Stack.Screen name="depreciation-curve" options={{ title: "Depreciation Curve" }} />
          <Stack.Screen name="car-recommendation" options={{ title: "Car Recommendations" }} />
        </Stack>
      </UserProvider>
    </SafeAreaProvider>
  );
}

