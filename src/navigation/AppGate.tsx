import React, { useEffect } from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../auth/authStore";
import { AuthNavigator } from "./AuthNavigator";
import { RootNavigator } from "./RootNavigator"; // drawer + stack famiglia
import { hasAnyFamily } from "../auth/authSelectors";
//import { FamilyOnboardingNavigator } from "./FamilyOnboardingNavigator"; // stack crea/join

export function AppGate({ fontsLoaded }: { fontsLoaded: boolean }) {
    const bootstrap = useAuthStore((s) => s.bootstrap);
    const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    if (!fontsLoaded || isBootstrapping) {
        return (
            <LinearGradient
                colors={["#A76D99", "#5E134C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <StatusBar style="light" />
                <Text style={{ color: "#fff" }}>Loading...</Text>
            </LinearGradient>
        );
    }
    if (!token) return <AuthNavigator />;

    return (
        <>
            <StatusBar style="light" />
            <RootNavigator hasFamily={hasAnyFamily(user)} />
        </>
    );
}
