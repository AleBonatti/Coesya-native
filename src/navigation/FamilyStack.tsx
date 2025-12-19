import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FamilyScreen } from "../screens/app/tabs/FamilyScreen";
import { FamilyDetailScreen } from "../screens/app/FamilyDetailScreen";

export type FamilyStackParamList = {
    FamilyRoot: undefined;
    FamilyDetail: { familyId: number };
};

const Stack = createNativeStackNavigator<FamilyStackParamList>();

export function FamilyStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="FamilyRoot"
                component={FamilyScreen}
            />
            <Stack.Screen
                name="FamilyDetail"
                component={FamilyDetailScreen}
            />
        </Stack.Navigator>
    );
}
