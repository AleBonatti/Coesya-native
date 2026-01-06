import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, type DrawerContentComponentProps } from "@react-navigation/drawer";
import type { NavigatorScreenParams } from "@react-navigation/native";

import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppIcon } from "../components/ui/AppIcon";
import { AppText, type TextVariant } from "../components/ui/AppText";

import { useAuthStore } from "../auth/authStore";
import { hasAnyFamily } from "../auth/authSelectors";

import type { MainStackParamList } from "./MainStackParamList";
import { MainStack } from "./MainStack";
import { FamilyOnboardingStack } from "./FamilyOnboardingStack";
import { ProfileScreen } from "../screens/app/ProfileScreen";
import { NotificationsScreen } from "../screens/app/NotificationsScreen";
import { PrivacyScreen } from "../screens/app/PrivacyScreen";
import { ResetDataScreen } from "../screens/app/ResetDataScreen";

export type LoggedDrawerParamList = {
    Main: NavigatorScreenParams<MainStackParamList>;
    Profile: undefined;
    Notifications: undefined;
    Privacy: undefined;
    ResetData: undefined;
};

const Drawer = createDrawerNavigator<LoggedDrawerParamList>();

export function LoggedInNavigator() {
    const user = useAuthStore((s) => s.user);

    const hasFamily = hasAnyFamily(user);
    const wizardRequired = !!user && (!user.has_completed_wizard || !hasFamily);

    return (
        <View style={{ flex: 1 }}>
            {/* ✅ Drawer sempre montato nel logged */}
            <Drawer.Navigator
                id="LoggedDrawer"
                screenOptions={{
                    headerShown: false,
                    drawerType: "front",
                    drawerStyle: { backgroundColor: "transparent" },
                    //sceneContainerStyle: { backgroundColor: "transparent" },
                }}
                drawerContent={(props) => <DrawerContent {...props} />}>
                <Drawer.Screen name="Main">{() => (wizardRequired ? <WizardShell /> : <MainShell hasFamily={hasFamily} />)}</Drawer.Screen>

                {/* Settings screens available from both wizard and main */}
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Notifications" component={NotificationsScreen} />
                <Drawer.Screen name="Privacy" component={PrivacyScreen} />
                <Drawer.Screen name="ResetData" component={ResetDataScreen} />
            </Drawer.Navigator>
        </View>
    );
}

function WizardShell() {
    return (
        <LinearGradient
            colors={["#A76D99", "#5E134C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}>
            <FamilyOnboardingStack />
        </LinearGradient>
    );
}

function MainShell({ hasFamily }: { hasFamily: boolean }) {
    // niente background globale qui: lasci ai singoli screen la gestione dello sfondo
    return <MainStack hasFamily={hasFamily} />;
}

/** ===== DrawerContent (il tuo, identico a quello che hai già) ===== */

function DrawerContent({ navigation }: DrawerContentComponentProps) {
    const logout = useAuthStore((s) => s.logout);

    const go = (screen: keyof LoggedDrawerParamList) => {
        navigation.navigate(screen as any);
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
                        variant="light"
                        className="text-xl"
                        weight="semibold">
                        Settings
                    </AppText>
                    <Pressable onPress={() => navigation.closeDrawer()}>
                        <AppIcon
                            name="close-outline"
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
                            await logout();
                        }}
                    />
                </View>
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

function DrawerItem({ label, variante = "light", onPress }: { label: string; variante?: TextVariant; onPress: () => void }) {
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
