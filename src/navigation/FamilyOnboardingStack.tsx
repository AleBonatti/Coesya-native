import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { WizardHomeScreen } from "../screens/app/WizardHomeScreen";
import { WizardCreateFamilyScreen } from "../screens/app/WizardCreateFamilyScreen";
import { WizardJoinFamilyScreen } from "../screens/app/WizardJoinFamilyScreen";
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
                name="WizardHome"
                component={WizardHomeScreen}
            />
            <Stack.Screen
                name="WizardCreateFamily"
                component={WizardCreateFamilyScreen}
            />
            <Stack.Screen
                name="WizardJoinFamily"
                component={WizardJoinFamilyScreen}
            />
        </Stack.Navigator>
    );
}
