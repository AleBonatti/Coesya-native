import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FamilyWizardHomeScreen } from "../screens/app/FamilyWizardHomeScreen";
import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";
import { MainStackParamList } from "./MainStackParamList";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function FamilyOnboardingStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}>
            <Stack.Screen
                name="FamilyWizardHome"
                component={FamilyWizardHomeScreen}
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
