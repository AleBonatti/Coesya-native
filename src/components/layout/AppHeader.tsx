import React from "react";
import { Image, Pressable, View } from "react-native";
import { AppIcon } from "../../components/ui/AppIcon";
import { CommonActions, DrawerActions, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import type { MainStackParamList } from "../../navigation/MainStackParamList";
import { useAuthStore } from "../../auth/authStore";
import { hasAnyFamily } from "../../auth/authSelectors";
import { MainStackParamList } from "../../navigation/MainStackParamList";

const logoDark = require("../../../assets/logo/logo-coesya.png");
const logoLight = require("../../../assets/logo/logo-coesya-transparent.png");

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function AppHeader() {
    //const navigation = useNavigation();
    const navigation = useNavigation<Nav>();
    const user = useAuthStore((s) => s.user);

    // se hasFamily => area bianca => icone scure
    const iconColor = hasAnyFamily(user) ? "#868686" : "#FFFFFF";
    const logo = hasAnyFamily(user) ? logoDark : logoLight;

    const handleLogoPress = () => {
        // chiudi drawer se presente
        navigation.dispatch(DrawerActions.closeDrawer());

        // Usa CommonActions per navigare in modo robusto
        if (hasAnyFamily(user)) {
            // Naviga alla home delle tabs
            navigation.dispatch(
                CommonActions.navigate({
                    name: "Main",
                    params: {
                        screen: "FamilyTabs",
                        params: {
                            screen: "Home",
                        },
                    },
                })
            );
        } else {
            // Naviga al wizard home
            navigation.dispatch(
                CommonActions.navigate({
                    name: "Main",
                    params: {
                        screen: "FamilyWizardHome",
                    },
                })
            );
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
                onPress={() => navigation.getParent("LoggedDrawer" as never)?.dispatch(DrawerActions.openDrawer())}
                accessibilityRole="button"
                accessibilityLabel="Impostazioni">
                <AppIcon
                    name="settings-outline"
                    size={24}
                    color={iconColor}
                />
            </Pressable>
        </View>
    );
}
