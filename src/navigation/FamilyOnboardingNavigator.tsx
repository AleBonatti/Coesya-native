import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DashboardScreen } from "../screens/app/DashboardScreen";
import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";

export type FamilyOnboardingStackParamList = {
    Dashboard: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;
};

const Stack = createNativeStackNavigator<FamilyOnboardingStackParamList>();

const TransparentTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
};

export function FamilyOnboardingNavigator() {
    return (
        <NavigationContainer theme={TransparentTheme}>
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
        </NavigationContainer>
    );
}
