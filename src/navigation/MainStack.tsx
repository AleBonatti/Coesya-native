import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./MainStackParamList";

import { DashboardScreen } from "../screens/app/DashboardScreen";
import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";

import { FamilyHomeScreen } from "../screens/app/FamilyHomeScreen";

import { ProfileScreen } from "../screens/app/ProfileScreen";
import { NotificationsScreen } from "../screens/app/NotificationsScreen";
//import { ThemeScreen } from "../screens/app/ThemeScreen";
import { PrivacyScreen } from "../screens/app/PrivacyScreen";
import { ResetDataScreen } from "../screens/app/ResetDataScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack({ hasFamily }: { hasFamily: boolean }) {
    return (
        <Stack.Navigator
            initialRouteName={hasFamily ? "FamilyHome" : "Dashboard"}
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}>
            {/* Onboarding */}
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

            {/* Family */}
            <Stack.Screen
                name="FamilyHome"
                component={FamilyHomeScreen}
            />

            {/* Account */}
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
            />
            {/* <Stack.Screen
                name="Theme"
                component={ThemeScreen}
            /> */}
            <Stack.Screen
                name="Privacy"
                component={PrivacyScreen}
            />
            <Stack.Screen
                name="ResetData"
                component={ResetDataScreen}
            />
        </Stack.Navigator>
    );
}
