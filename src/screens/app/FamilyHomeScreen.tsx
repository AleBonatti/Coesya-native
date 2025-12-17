import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";
import { useAuthStore } from "../../auth/authStore";
import { getCurrentFamily, hasAnyFamily } from "../../auth/authSelectors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type MainStackParamList } from "../../navigation/MainStackParamList";
import { LinkText } from "../../components/ui/LinkText";
import { Feather } from "@expo/vector-icons";

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
                {family ? (
                    <>
                        <View className="w-full flex-row items-center justify-between">
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
                                        params: {
                                            screen: "FamilyDetail",
                                            params: { familyId: family.id },
                                        },
                                    });
                                }}
                                className="p-2 rounded-full active:bg-black/5"
                                accessibilityRole="button"
                                accessibilityLabel="Dettaglio famiglia">
                                <Feather
                                    name="chevron-right"
                                    size={22}
                                    color="#121212"
                                />
                            </Pressable>
                        </View>

                        <View className="bg-auth-form rounded-lg p-5">
                            <AppText>La tua famiglia non ha ancora impegni da completare. Sii il primo a dare inizio a momenti di collaborazione!</AppText>

                            <LinkText
                                onPress={() => {}}
                                className="mt-10">
                                Clicca qui per creare il tuo primo impegno familiare.
                            </LinkText>
                        </View>
                    </>
                ) : (
                    <AppText>Nessuna famiglia attiva trovata.</AppText>
                )}
            </View>
        </AppShell>
    );
}
