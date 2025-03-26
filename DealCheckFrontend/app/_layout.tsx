import { SafeAreaProvider } from "react-native-safe-area-context";
import { Redirect, Stack, router } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function AuthStateHandler() {
  const { loggedIn, loading } = useAuth();

  if(!loading) {
    return (
      <Redirect href={loggedIn ? '/(app)' : '/main'} />
    ); 
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "", headerShown: false, animation: "none" }} />
          <Stack.Screen name="main" options={{ title: "", headerShown: false, animation: "none" }} />
          <Stack.Screen name="sign-up" options={{ title: "Create Account" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="(app)" options={{ title: "", headerShown: false, animation: "none" }} />
        </Stack>
        <AuthStateHandler />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

