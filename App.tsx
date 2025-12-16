import "./src/global.css";
import React from "react";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import "react-native-gesture-handler";

import { AppGate } from "./src/navigation/AppGate";

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    return <AppGate fontsLoaded={fontsLoaded} />;
}
