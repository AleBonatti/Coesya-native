import "react-native-gesture-handler";
import "./src/global.css";
import React from "react";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AppGate } from "./src/navigation/AppGate";

const TransparentTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
};

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    return (
        <NavigationContainer theme={TransparentTheme}>
            <AppGate fontsLoaded={fontsLoaded} />
        </NavigationContainer>
    );
}
