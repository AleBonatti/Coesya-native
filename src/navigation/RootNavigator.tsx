import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Pressable, View } from "react-native";

import { AppNavigator } from "./AppNavigator"; // il tuo stack attuale
import { SettingsScreen } from "../screens/app/SettingsScreen";
import { AppText } from "../components/ui/AppText";
import { useAuthStore } from "../auth/authStore";

export type RootDrawerParamList = {
    Main: undefined;
    Settings: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const TransparentTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
};

function DrawerContent({ navigation }: DrawerContentComponentProps) {
    const logout = useAuthStore((s) => s.logout);

    return (
        <DrawerContentScrollView>
            <View className="px-5 pt-6 gap-3">
                <AppText className="text-xl font-sansSemibold mb-2">Coesya</AppText>

                <Pressable
                    className="py-3"
                    onPress={() => {
                        navigation.navigate("Main", {
                            screen: "Dashboard",
                        });
                    }}>
                    <AppText className="font-sansSemibold">Dashboard</AppText>
                </Pressable>

                <Pressable
                    className="py-3"
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}>
                    <AppText className="font-sansSemibold">Impostazioni</AppText>
                </Pressable>

                <Pressable
                    className="py-3"
                    onPress={() => {
                        navigation.closeDrawer();
                    }}>
                    <AppText className="font-sansSemibold">Chiudi</AppText>
                </Pressable>

                <View className="h-px bg-black/10 my-3" />

                <Pressable
                    className="py-3"
                    onPress={async () => {
                        await logout(); // App.tsx farà switch verso AuthNavigator
                    }}>
                    <AppText className="text-red-500 font-sansSemibold">Logout</AppText>
                </Pressable>
            </View>
        </DrawerContentScrollView>
    );
}

export function RootNavigator() {
    return (
        <NavigationContainer theme={TransparentTheme}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerType: "front",
                    drawerStyle: { backgroundColor: "transparent" },
                }}
                drawerContent={(p) => <DrawerContent {...p} />}>
                <Drawer.Screen
                    name="Main"
                    component={AppNavigator}
                />
                <Drawer.Screen
                    name="Settings"
                    component={SettingsScreen}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
