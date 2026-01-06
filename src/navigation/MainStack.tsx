import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./MainStackParamList";

import { FamilyTabs } from "./FamilyTabs";

import { FamilyHomeScreen } from "../screens/app/tabs/FamilyHomeScreen";
import { ProfileScreen } from "../screens/app/ProfileScreen";
import { NotificationsScreen } from "../screens/app/NotificationsScreen";
import { PrivacyScreen } from "../screens/app/PrivacyScreen";
import { ResetDataScreen } from "../screens/app/ResetDataScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack({ hasFamily }: { hasFamily: boolean }) {
    return (
        <Stack.Navigator
            initialRouteName="FamilyTabs"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}>
            {/* Family */}
            <Stack.Screen
                name="FamilyTabs"
                component={FamilyTabs}
            />
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
