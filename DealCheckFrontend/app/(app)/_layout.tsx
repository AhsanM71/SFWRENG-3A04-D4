import { Stack } from "expo-router";

export default function AuthenticatedAppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
            <Stack.Screen name="account" options={{ title: "Account Information" }} />
            <Stack.Screen name="edit-account" options={{ title: "Edit Profile" }} />
            <Stack.Screen name="deal-valuation" options={{ title: "Deal Valuation" }} />
            <Stack.Screen name="depreciation-curve" options={{ title: "Depreciation Curve" }} />
            <Stack.Screen name="car-recommendation" options={{ title: "Car Recommendations" }} />
        </Stack>
    );
}