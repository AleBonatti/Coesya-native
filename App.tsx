import "./src/global.css";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { Text } from "react-native";

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>; // puoi metterci uno splash screen personalizzato
    }

    return (
        <>
            <StatusBar style="light" />
            <AuthNavigator />
        </>
    );
}
