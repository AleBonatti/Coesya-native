import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DashboardScreen } from "../screens/app/DashboardScreen";
import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";
import { SettingsScreen } from "../screens/app/SettingsScreen";

export type AppStackParamList = {
    Dashboard: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }}>
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
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
            />
        </Stack.Navigator>
    );
}
