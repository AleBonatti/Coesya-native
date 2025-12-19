import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";
import { useChoresStore } from "../../../chores/choreStore";
import type { ActiveChore } from "../../../chores/choreTypes";

function formatDue(dueIso: string): string {
    const d = new Date(dueIso);
    // NB: se due_at è end-exclusive (es. lun 00:00), UI può dire "entro dom"
    return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short" }).format(d);
}

function frequencyLabel(freq: ActiveChore["frequency"]): string {
    switch (freq) {
        case "daily":
            return "Giornaliero";
        case "weekly":
            return "Settimanale";
        case "monthly":
            return "Mensile";
        case "semiannual":
            return "Semestrale";
    }
}

export function ChoresScreen() {
    const chores = useChoresStore((s) => s.chores);
    const isLoading = useChoresStore((s) => s.isLoading);
    const error = useChoresStore((s) => s.error);
    const togglingIds = useChoresStore((s) => s.togglingIds);

    const fetchActive = useChoresStore((s) => s.fetchActive);
    const toggleComplete = useChoresStore((s) => s.toggleComplete);
    const clearError = useChoresStore((s) => s.clearError);

    useEffect(() => {
        void fetchActive();
    }, [fetchActive]);

    const activeCount = chores.length;
    const doneCount = useMemo(() => chores.filter((c) => c.is_completed).length, [chores]);

    return (
        <AppShell>
            <View className="pt-4">
                <View className="flex-row items-end justify-between mb-4">
                    <View>
                        <AppText
                            className="text-2xl"
                            weight="semibold">
                            Impegni
                        </AppText>
                        <AppText className="text-white/80 mt-1">
                            {doneCount}/{activeCount} completati nel periodo corrente
                        </AppText>
                    </View>

                    <Pressable
                        onPress={() => void fetchActive()}
                        className="px-3 py-2 rounded-xl bg-white/15 active:bg-white/25"
                        accessibilityRole="button"
                        accessibilityLabel="Aggiorna lista">
                        <AppText weight="semibold">Aggiorna</AppText>
                    </Pressable>
                </View>

                {error ? (
                    <Pressable
                        onPress={() => clearError()}
                        className="mb-4 rounded-xl bg-red-500/20 px-4 py-3">
                        <AppText weight="semibold">Errore</AppText>
                        <AppText className="text-white/80 mt-1">{error}</AppText>
                        <AppText className="text-white/60 mt-2">Tocca per chiudere</AppText>
                    </Pressable>
                ) : null}

                {isLoading ? (
                    <View className="py-10 items-center justify-center">
                        <ActivityIndicator />
                        <AppText className="mt-3 text-white/80">Caricamento…</AppText>
                    </View>
                ) : (
                    <FlatList
                        data={chores}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ paddingBottom: 110 }}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                        renderItem={({ item }) => {
                            const isToggling = Boolean(togglingIds[item.id]);

                            return (
                                <Pressable
                                    onPress={() => void toggleComplete(item.id)}
                                    className="rounded-2xl bg-white/15 px-4 py-4 active:bg-white/20"
                                    accessibilityRole="button"
                                    accessibilityLabel={item.is_completed ? "Segna come non completato" : "Segna come completato"}>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1 pr-3">
                                            <AppText
                                                weight="semibold"
                                                className="text-lg">
                                                {item.title}
                                            </AppText>

                                            <View className="flex-row flex-wrap gap-2 mt-2">
                                                <View className="rounded-full bg-white/15 px-3 py-1">
                                                    <AppText className="text-white/85">{item.category}</AppText>
                                                </View>

                                                <View className="rounded-full bg-white/15 px-3 py-1">
                                                    <AppText className="text-white/85">{frequencyLabel(item.frequency)}</AppText>
                                                </View>

                                                <View className="rounded-full bg-white/15 px-3 py-1">
                                                    <AppText className="text-white/85">Entro {formatDue(item.due_at)}</AppText>
                                                </View>

                                                <View className="rounded-full bg-white/15 px-3 py-1">
                                                    <AppText className="text-white/85">
                                                        P {item.priority} · W {item.weight}
                                                    </AppText>
                                                </View>
                                            </View>
                                        </View>

                                        <View className="w-10 h-10 rounded-full items-center justify-center bg-white/10">
                                            {isToggling ? (
                                                <ActivityIndicator />
                                            ) : (
                                                <Feather
                                                    name={item.is_completed ? "check" : "circle"}
                                                    size={20}
                                                    color={item.is_completed ? "#FFA500" : "#FFFFFF"}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={
                            <View className="mt-10 rounded-2xl bg-white/10 px-5 py-6">
                                <AppText
                                    weight="semibold"
                                    className="text-lg">
                                    Nessun impegno attivo
                                </AppText>
                                <AppText className="text-white/80 mt-2">Crea un nuovo impegno dalla sezione di gestione.</AppText>
                            </View>
                        }
                    />
                )}
            </View>
        </AppShell>
    );
}
