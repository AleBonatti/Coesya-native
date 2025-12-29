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
import { CategoryIcon } from "../../components/chores/CategoryIcon";

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

/* function categoryIcon(category: string): React.ComponentProps<typeof Feather>["name"] {
    // mapping semplice (poi lo raffiniamo)
    const c = category.toLowerCase();
    if (c.includes("pul")) return "droplet";
    if (c.includes("bur")) return "file-text";
    if (c.includes("spes")) return "shopping-cart";
    return "tag";
} */

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
        <AppShell
            showHeader={false}
            padded={false}>
            <View className="mt-4">
                <View className="flex-row items-center mb-6 mt-4 gap-3 px-4">
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
                {isLoadingAll ? (
                    <View className="py-10 items-center">
                        <ActivityIndicator />
                        <AppText className="mt-3">Caricamento…</AppText>
                    </View>
                ) : (
                    <FlatList
                        data={allChores}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        ItemSeparatorComponent={() => <View className="" />}
                        renderItem={({ item }) => (
                            <Pressable className="rounded-2xl">
                                <View className="flex-row items-center justify-between border-b border-text-light px-6 py-4">
                                    <View className="flex-row items-center flex-1">
                                        <CategoryIcon
                                            category={item.category}
                                            is_completed={false}
                                        />

                                        <View className="flex-1">
                                            <AppText
                                                weight="medium"
                                                className="text-base">
                                                {item.title}
                                            </AppText>
                                            <AppText>{freqLabel(item.frequency)}</AppText>
                                        </View>
                                    </View>

                                    <View className="flex-row items-end">
                                        <AppText>{item.weight}</AppText>
                                        <AppText>{item.priority}</AppText>
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
                            <View className="mt-6 px-6">
                                <Button
                                    variant="dark"
                                    title="Crea nuovo impegno"
                                    onPress={() => {
                                        navigation.navigate("ChoreCreate");
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
