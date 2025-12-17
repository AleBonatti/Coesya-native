import React from "react";
import { Image, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation, type NavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../navigation/MainStackParamList";
import { useAuthStore } from "../../auth/authStore";
import { hasAnyFamily } from "../../auth/authSelectors";

const logo = require("../../../assets/logo/logo-coesya-transparent.png");

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function AppHeader() {
    const navigation = useNavigation<Nav>();
    const user = useAuthStore((s) => s.user);

    const handleLogoPress = () => {
        // chiudi drawer se presente (se non c'è, viene ignorato senza problemi)
        navigation.dispatch(DrawerActions.closeDrawer());

        // torna alla root dello stack corrente (se possibile)
        if (navigation.canGoBack()) {
            navigation.popToTop();
        }

        // vai alla “home” corretta senza duplicare
        const home = hasAnyFamily(user) ? "FamilyHome" : "Dashboard";
        navigation.navigate(home);
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
