import React, { useEffect } from "react";
import { View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";
import { useAuthStore } from "../../auth/authStore";
import { getCurrentFamily, hasAnyFamily } from "../../auth/authSelectors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type MainStackParamList } from "../../navigation/MainStackParamList";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function FamilyHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const navigation = useNavigation<Nav>();

    const family = getCurrentFamily(user);

    // Edge case: per qualche motivo siamo qui senza famiglie
    useEffect(() => {
        if (!hasAnyFamily(user)) {
            navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
        }
    }, [user?.families?.length, navigation]);

    return (
        <AppShell>
            <View className="pt-6 gap-2">
                <AppText
                    className="text-2xl"
                    weight="semibold">
                    Home Famiglia
                </AppText>

                {family ? (
                    <>
                        <AppText
                            className="text-lg"
                            weight="bold">
                            {family.name}
                        </AppText>

                        <AppText>Qui andranno le operazioni familiari (attività, membri, ecc.)</AppText>
                    </>
                ) : (
                    <AppText>Nessuna famiglia attiva trovata.</AppText>
                )}
            </View>
        </AppShell>
    );
}
