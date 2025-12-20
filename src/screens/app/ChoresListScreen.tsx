import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ChoresStackParamList } from "../../navigation/ChoresStack";
import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { LinkText } from "../../components/ui/LinkText";
import { useChoresStore } from "../../chores/choreStore";
import type { Chore } from "../../chores/choreTypes";

type Nav = NativeStackNavigationProp<ChoresStackParamList>;

function freqLabel(f: Chore["frequency"]): string {
    switch (f) {
        case "daily":
            return "Giornaliera";
        case "weekly":
            return "Settimanale";
        case "monthly":
            return "Mensile";
        case "semiannual":
            return "Semestrale";
    }
}

function categoryIcon(category: string): React.ComponentProps<typeof Feather>["name"] {
    // mapping semplice (poi lo raffiniamo)
    const c = category.toLowerCase();
    if (c.includes("pul")) return "droplet";
    if (c.includes("bur")) return "file-text";
    if (c.includes("spes")) return "shopping-cart";
    return "tag";
}

export function ChoresListScreen() {
    const navigation = useNavigation<Nav>();
    const allChores = useChoresStore((s) => s.allChores);
    const isLoadingAll = useChoresStore((s) => s.isLoadingAll);
    const error = useChoresStore((s) => s.error);

    const fetchAll = useChoresStore((s) => s.fetchAll);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    return (
        <AppShell showHeader={false}>
            <View className="mt-4">
                <View className="flex-row items-center mb-6 mt-4 gap-3">
                    <Feather
                        name="chevron-left"
                        size={24}
                    />
                    <LinkText
                        variant="dark"
                        weight="medium"
                        onPress={() => navigation.goBack()}
                        className="text-xl font-medium">
                        Gestione impegni
                    </LinkText>
                </View>
                <AppText className="text-white/75 mt-1">Elenco degli impegni salvati per la famiglia</AppText>

                {isLoadingAll ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator />
                        <AppText className="mt-3 text-white/80">Caricamento…</AppText>
                    </View>
                ) : (
                    <FlatList
                        className="mt-6"
                        data={allChores}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                        renderItem={({ item }) => (
                            <Pressable className="rounded-2xl bg-white/15 px-4 py-4 active:bg-white/20">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-3 flex-1 pr-3">
                                        <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center">
                                            <Feather
                                                name={categoryIcon(item.category)}
                                                size={18}
                                                color="#FFFFFF"
                                            />
                                        </View>

                                        <View className="flex-1">
                                            <AppText
                                                weight="semibold"
                                                className="text-lg">
                                                {item.title}
                                            </AppText>
                                            <AppText className="text-white/70 mt-1">
                                                {item.category} · {freqLabel(item.frequency)}
                                            </AppText>
                                        </View>
                                    </View>

                                    <View className="items-end">
                                        <AppText className="text-white/70">{item.is_active ? "Attivo" : "Disattivo"}</AppText>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={
                            <View className="rounded-2xl bg-white/10">
                                <View className="bg-auth-form rounded-xl p-5 mb-6">
                                    <AppText>La tua famiglia non ha ancora impegni salvati.</AppText>
                                </View>
                            </View>
                        }
                        ListFooterComponent={
                            <View className="mt-6">
                                <Button
                                    variant="dark"
                                    title="Crea nuovo impegno"
                                    onPress={() => {
                                        // next step: navigation.navigate("ChoreCreate")
                                    }}
                                />
                                {error ? <AppText className="text-red-200 mt-3">{error}</AppText> : null}
                            </View>
                        }
                    />
                )}
            </View>
        </AppShell>
    );
}
