import "./src/global.css";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-gesture-handler";

import { useAuthStore } from "./src/auth/authStore";
import { AuthNavigator } from "./src/navigation/AuthNavigator";

import { Text } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const bootstrap = useAuthStore((s) => s.bootstrap);
    const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    if (isBootstrapping || !fontsLoaded) {
        return <Text>Loading...</Text>; // puoi metterci uno splash screen personalizzato
    }

    return (
        <>
            <StatusBar style="light" />
            {token ? (
                <LinearGradient
                    colors={["#A76D99", "#5E134C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ flex: 1 }}>
                    <RootNavigator />
                </LinearGradient>
            ) : (
                <AuthNavigator />
            )}
        </>
    );
}
