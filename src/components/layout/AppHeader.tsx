import React from "react";
import { Image, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation, type NavigationProp } from "@react-navigation/native";
import type { AppStackParamList } from "../../navigation/AppNavigator";

const logo = require("../../../assets/logo/logo-coesya-transparent.png");

type Nav = NavigationProp<AppStackParamList>;

export function AppHeader() {
    const navigation = useNavigation<Nav>();

    const handleLogoPress = () => {
        // chiudi drawer se presente (se non c'è, viene ignorato senza problemi)
        navigation.dispatch(DrawerActions.closeDrawer());

        // se siamo in una schermata secondaria, torna indietro
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }

        // altrimenti vai alla dashboard (no duplicati, perché non può andare back)
        navigation.navigate("Dashboard");
    };

    return (
        <View className="w-full flex-row px-6 pt-4 items-center justify-between">
            <Pressable
                onPress={handleLogoPress}
                className="p-2">
                <Image
                    source={logo}
                    resizeMode="contain"
                    className="w-8 h-8"
                />
            </Pressable>

            <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                accessibilityRole="button"
                accessibilityLabel="Impostazioni">
                <Feather
                    name="settings"
                    size={22}
                    color="#FFFFFF"
                />
            </Pressable>
        </View>
    );
}
