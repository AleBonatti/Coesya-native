import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChoresScreen } from "../screens/app/tabs/ChoresScreen";
import { ChoresListScreen } from "../screens/app/ChoresListScreen";

export type ChoresStackParamList = {
    ChoresRoot: undefined;
    ChoresList: undefined;
};

const Stack = createNativeStackNavigator<ChoresStackParamList>();

export function ChoresStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ChoresRoot"
                component={ChoresScreen}
            />
            <Stack.Screen
                name="ChoresList"
                component={ChoresListScreen}
            />
        </Stack.Navigator>
    );
}
