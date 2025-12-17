import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./MainStackParamList";

import { DashboardScreen } from "../screens/app/DashboardScreen";
import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";

/* export type FamilyOnboardingStackParamList = {
    Dashboard: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;
}; */

const Stack = createNativeStackNavigator<MainStackParamList>();

/* const TransparentTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
}; */

export function FamilyOnboardingStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}>
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
            />
            <Stack.Screen
                name="CreateFamily"
                component={CreateFamilyScreen}
            />
            <Stack.Screen
                name="JoinFamily"
                component={JoinFamilyScreen}
            />
        </Stack.Navigator>
    );
}
