import React, { useEffect } from "react";
import { View, Pressable, Image } from "react-native";
import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";
import { useAuthStore } from "../../../auth/authStore";
import { getCurrentFamily, hasAnyFamily } from "../../../auth/authSelectors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type MainStackParamList } from "../../../navigation/MainStackParamList";
import { Button } from "../../../components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { Avatar } from "../../../components/ui/Avatar";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function FamilyHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const navigation = useNavigation<Nav>();

    const family = getCurrentFamily(user);
    const fallback = require("../../../../assets/logo/logo-coesya-transparent.png");

    // Edge case: per qualche motivo siamo qui senza famiglie
    useEffect(() => {
        if (!hasAnyFamily(user)) {
            navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
        }
    }, [user?.families?.length, navigation]);

    return (
        <AppShell>
            <View className="pt-6 gap-2">
                {family ? (
                    <>
                        <View className="w-full flex-row items-center justify-between">
                            {/* <Avatar
                                uri={family.profile_photo_url}
                                name={family.name}
                                size={70}
                            />

                            <AppText
                                className="text-xl"
                                weight="medium">
                                {family.name}
                            </AppText>

                            <Pressable
                                onPress={() => {
                                    if (!family) return;
                                    navigation.navigate("FamilyTabs", {
                                        screen: "Family",
                                    });
                                }}
                                className="px-2 py-2 rounded-full bg-brand-primary"
                                accessibilityRole="button"
                                accessibilityLabel="Dettaglio famiglia">
                                <Feather
                                    name="arrow-right"
                                    size={15}
                                    color="#FFFFFF"
                                />
                            </Pressable> */}
                        </View>

                        <View className="bg-auth-form rounded-xl p-5 my-10">
                            <AppText>La tua famiglia non ha ancora uno storico di impegni completati.</AppText>
                        </View>
                        <Button
                            variant="tertiary"
                            size="sm"
                            title="Gestione inviti"
                            onPress={() => {}}
                        />
                    </>
                ) : (
                    <AppText>Nessuna famiglia attiva trovata.</AppText>
                )}
            </View>
        </AppShell>
    );
}
