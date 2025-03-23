import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { UserProvider } from "../context/UserContext"

import LoginScreen from "../components/screens/LoginScreen"
import HomeScreen from "../components/screens/HomeScreen"
import AccountScreen from "../components/screens/AccountScreen"
import DealValuationScreen from "../components/screens/DealValuationScreen"
import CarRecommendationScreen from "../components/screens/CarRecommendationScreen"
import LandingScreen from "@/components/screens/LandingScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <Stack.Navigator initialRouteName="Landing" >
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Account" component={AccountScreen} options={{ title: "Account Information" }} />
          <Stack.Screen name="DealValuation" component={DealValuationScreen} options={{ title: "Deal Valuation" }} />
          <Stack.Screen name="CarRecommendation" component={CarRecommendationScreen} options={{ title: "Car Recommendations" }}/>
        </Stack.Navigator>
      </UserProvider>
    </SafeAreaProvider>
  )
}

