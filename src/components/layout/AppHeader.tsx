import React, { use } from "react";
import { Image, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation, type NavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../navigation/MainStackParamList";
import { useAuthStore } from "../../auth/authStore";
import { hasAnyFamily } from "../../auth/authSelectors";

const logoDark = require("../../../assets/logo/logo-coesya.png");
const logoLight = require("../../../assets/logo/logo-coesya-transparent.png");

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function AppHeader() {
    const navigation = useNavigation<Nav>();
    const user = useAuthStore((s) => s.user);

    // se hasFamily => area bianca => icone scure
    const iconColor = hasAnyFamily(user) ? "#868686" : "#FFFFFF";
    const logo = hasAnyFamily(user) ? logoDark : logoLight;

    const handleLogoPress = () => {
        // chiudi drawer se presente (se non c'è, viene ignorato senza problemi)
        navigation.dispatch(DrawerActions.closeDrawer());

        // torna alla root dello stack corrente (se possibile)
        if (navigation.canGoBack()) {
            navigation.popToTop();
        }

        // vai alla “home” corretta senza duplicare
        if (hasAnyFamily(user)) {
            navigation.navigate("FamilyTabs", { screen: "Home" }); // o la tab che vuoi
        } else {
            navigation.navigate("Dashboard");
        }
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
                    color={iconColor}
                />
            </Pressable>
        </View>
    );
}
