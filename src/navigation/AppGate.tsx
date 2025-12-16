import React, { useEffect } from "react";
import { Text } from "react-native";
import { useAuthStore } from "../auth/authStore";
import { AuthNavigator } from "./AuthNavigator";
import { RootNavigator } from "./RootNavigator"; // drawer + stack famiglia
import { hasAnyFamily } from "../auth/authSelectors";
import { FamilyOnboardingNavigator } from "./FamilyOnboardingNavigator"; // stack crea/join
import { LinearGradient } from "expo-linear-gradient";

export function AppGate() {
    const bootstrap = useAuthStore((s) => s.bootstrap);
    const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
    const token = useAuthStore((s) => s.token);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    if (isBootstrapping) return <Text>Loading...</Text>;

    if (!token) return <AuthNavigator />;

    // Qui decidi “ha famiglia?”
    //const hasFamily = Boolean(user && "family" in user ? (user as { family?: unknown }).family : false);

    // non ha famiglie, vado alla sezione di gestione
    if (!hasAnyFamily(user))
        return (
            <LinearGradient
                colors={["#A76D99", "#5E134C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}>
                <FamilyOnboardingNavigator />
            </LinearGradient>
        );

    // ha famigghia, vado all'area gestione
    return <RootNavigator />;
}
