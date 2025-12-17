import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./MainStackParamList";

import { FamilyHomeScreen } from "../screens/app/FamilyHomeScreen";
import { ProfileScreen } from "../screens/app/ProfileScreen";
import { NotificationsScreen } from "../screens/app/NotificationsScreen";
//import { ThemeScreen } from "../screens/app/ThemeScreen";
import { PrivacyScreen } from "../screens/app/PrivacyScreen";
import { ResetDataScreen } from "../screens/app/ResetDataScreen";

/* export type FamilyAppStackParamList = {
    FamilyHome: undefined;
    Profile: undefined;
    Notifications: undefined;
    Theme: undefined;
    Privacy: undefined;
    ResetData: undefined;
}; */

const Stack = createNativeStackNavigator<MainStackParamList>();

export function FamilyAppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}>
            <Stack.Screen
                name="FamilyHome"
                component={FamilyHomeScreen}
            />
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
