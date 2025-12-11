import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "../screens/auth/AuthScreen";

export type AuthStackParamList = {
    Auth: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Auth"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
