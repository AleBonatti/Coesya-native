import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./MainStackParamList";

import { FamilyTabs } from "./FamilyTabs";

import { FamilyHomeScreen } from "../screens/app/tabs/FamilyHomeScreen";

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
        </Stack.Navigator>
    );
}
