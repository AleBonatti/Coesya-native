import "./src/global.css";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";

import { useAuthStore } from "./src/auth/authStore";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
// TODO: creeremo AppNavigator dopo
// import { AppNavigator } from "./src/navigation/AppNavigator";

import { Text, View } from "react-native";

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
                // <AppNavigator />
                <View className="flex-1 items-center justify-center bg-auth-bg">
                    <Text className="text-text-main">Logged in ✅ (AppNavigator next)</Text>
                </View>
            ) : (
                <AuthNavigator />
            )}
        </>
    );
}
