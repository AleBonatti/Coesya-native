import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChoresScreen } from "../screens/app/tabs/ChoresScreen";
//import { FamilyDetailScreen } from "../screens/app/FamilyDetailScreen";

export type ChoresStackParamList = {
    FamilyRoot: undefined;
    FamilyDetail: { familyId: number };
};

const Stack = createNativeStackNavigator<ChoresStackParamList>();

export function FamilyStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="FamilyRoot"
                component={ChoresScreen}
            />
            {/* <Stack.Screen
                name="FamilyDetail"
                component={FamilyDetailScreen}
            /> */}
        </Stack.Navigator>
    );
}
