import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import LoginScreen from "./app/screens/LoginScreen"
import HomeScreen from "./app/screens/HomeScreen"
import AccountScreen from "./app/screens/AccountScreen"
import DealValuationScreen from "./app/screens/DealValuationScreen"
import CarRecommendationScreen from "./app/screens/CarRecommendationScreen"
import { UserProvider } from "./components/context/UserContext"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Account" component={AccountScreen} options={{ title: "Account Information" }} />
            <Stack.Screen name="DealValuation" component={DealValuationScreen} options={{ title: "Deal Valuation" }} />
            <Stack.Screen
              name="CarRecommendation"
              component={CarRecommendationScreen}
              options={{ title: "Car Recommendations" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  )
}

