import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//import { DashboardScreen } from "../screens/app/DashboardScreen";
//import { CreateFamilyScreen } from "../screens/app/CreateFamilyScreen";
//import { JoinFamilyScreen } from "../screens/app/JoinFamilyScreen";

import { ProfileScreen } from "../screens/app/ProfileScreen";
//import { NotificationsScreen } from "../screens/app/NotificationsScreen";
/* import { ThemeScreen } from "../screens/app/ThemeScreen"; */
import { PrivacyScreen } from "../screens/app/PrivacyScreen";
import { ResetDataScreen } from "../screens/app/ResetDataScreen";
import { FamilyHomeScreen } from "../screens/app/FamilyHomeScreen";

export type AppStackParamList = {
    FamilyHome: undefined;
    Dashboard: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;
    Settings: undefined;

    Profile: undefined;
    Notifications: undefined;
    /*     Theme: undefined; */
    Privacy: undefined;
    ResetData: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }}>
            <Stack.Screen
                name="FamilyHome"
                component={FamilyHomeScreen}
            />
            {/* <Stack.Screen
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
            /> */}
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
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
