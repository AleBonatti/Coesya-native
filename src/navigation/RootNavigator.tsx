import React from "react";
import { NavigationContainer, DefaultTheme, type NavigatorScreenParams } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, type DrawerContentComponentProps, type DrawerNavigationProp } from "@react-navigation/drawer";

import type { MainStackParamList } from "./MainStackParamList";
import { CommonActions } from "@react-navigation/native";

import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { AppText, type TextVariant } from "../components/ui/AppText";
import { useAuthStore } from "../auth/authStore";
import { MainStack } from "./MainStack";

export type RootDrawerParamList = {
    Main: NavigatorScreenParams<MainStackParamList>;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
type RootDrawerNav = DrawerNavigationProp<RootDrawerParamList>;

const TransparentTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
};

function DrawerItem({ label, variante = "primary", onPress }: { label: string; variante?: TextVariant; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className="w-full rounded-xl px-4 py-4 bg-brand-primary active:bg-white/15">
            <AppText
                variant={variante}
                weight="semibold"
                className="text-base">
                {label}
            </AppText>
        </Pressable>
    );
}

function DrawerContent({ navigation }: DrawerContentComponentProps) {
    const logout = useAuthStore((s) => s.logout);

    const go = (screen: keyof MainStackParamList) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: "Main",
                params: { screen },
            })
        );
        navigation.closeDrawer();
    };

    return (
        <LinearGradient
            colors={["#A76D99", "#5E134C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}>
            <DrawerContentScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 0 }}
                style={{ padding: 0 }}>
                <View className="flex-row items-center justify-between px-6 pt-6 pb-6">
                    <AppText
                        className="text-xl"
                        weight="semibold">
                        Settings
                    </AppText>
                    <Pressable
                        onPress={() => {
                            navigation.closeDrawer();
                        }}>
                        <Feather
                            name="x"
                            size={22}
                            color="#FFFFFF"
                        />
                    </Pressable>
                </View>
                <View className="flex-1 gap-3 mt-12 px-6">
                    <DrawerItem
                        label="Profilo"
                        onPress={() => go("Profile")}
                    />
                    <DrawerItem
                        label="Notifiche"
                        onPress={() => go("Notifications")}
                    />
                    {/* <DrawerItem
                        label="Tema"
                        onPress={() => go("Theme")}
                    /> */}
                    <DrawerItem
                        label="Privacy e condizioni"
                        onPress={() => go("Privacy")}
                    />
                    <DrawerItem
                        label="Reset dati"
                        onPress={() => go("ResetData")}
                    />
                    <DrawerItem
                        label="Logout"
                        variante="secondary"
                        onPress={async () => {
                            await logout(); // App.tsx farà switch verso AuthNavigator
                        }}
                    />
                </View>
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

export function RootNavigator({ hasFamily }: { hasFamily: boolean }) {
    return (
        <NavigationContainer theme={TransparentTheme}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerType: "front",
                    // IMPORTANTE: lascia trasparente lo “scheletro” del drawer, perché il gradient lo disegniamo noi nel contenuto.
                    drawerStyle: { backgroundColor: "transparent" },
                }}
                drawerContent={(props) => <DrawerContent {...props} />}>
                <Drawer.Screen name="Main">{() => <MainStack hasFamily={hasFamily} />}</Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
