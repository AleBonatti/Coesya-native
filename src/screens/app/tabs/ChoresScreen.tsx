import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { ChoreCompletedPill } from "../../../components/chores/ChoreCompletedPill";
import { ChoresStackParamList } from "../../../navigation/ChoresStack";
import { useChoresStore } from "../../../chores/choreStore";
import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";
import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";

type Nav = NativeStackNavigationProp<ChoresStackParamList>;

export function ChoresScreen() {
    const navigation = useNavigation<Nav>();
    const completions = useChoresStore((s) => s.completedCompletions);
    const isLoading = useChoresStore((s) => s.isLoadingCompleted);
    const error = useChoresStore((s) => s.completedError);

    const fetchCompleted = useChoresStore((s) => s.fetchCompleted);
    const clearError = useChoresStore((s) => s.clearError);

    useFocusEffect(
        useCallback(() => {
            void fetchCompleted();
        }, [fetchCompleted])
    );

    return (
        <AppShell showHeader={false}>
            <View className="pt-4">
                <View className="flex-row items-end justify-between mb-4">
                    <IconButton
                        icon="filter"
                        onPress={() => {}}
                    />
                    <View className="flex-row gap-1">
                        <IconButton
                            icon="search"
                            onPress={() => {}}
                        />
                        <IconButton
                            icon="calendar"
                            onPress={() => {}}
                        />
                        <IconButton
                            icon="list"
                            onPress={() => void fetchCompleted()}
                        />
                        <IconButton
                            icon="refresh"
                            onPress={() => {}}
                        />
                    </View>
                </View>

                {error ? (
                    <Pressable
                        onPress={() => clearError()}
                        className="mb-4 rounded-xl bg-red-500 px-4 py-3">
                        <AppText className="text-white">An error occurred: {error}</AppText>
                        <AppText className="text-white">x</AppText>
                    </Pressable>
                ) : null}

                {isLoading ? (
                    <View className="py-10 items-center justify-center">
                        <ActivityIndicator />
                        <AppText className="mt-3 text-white/80">Caricamento…</AppText>
                    </View>
                ) : (
                    <FlatList
                        data={completions}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ paddingBottom: 110 }}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                        ListFooterComponent={
                            <Button
                                variant="tertiary"
                                size="sm"
                                title="Gestione impegni"
                                onPress={() => navigation.navigate("ChoresList")}
                                className="mt-4"
                            />
                        }
                        renderItem={({ item }) => {
                            return <ChoreCompletedPill item={item} />;
                        }}
                        ListEmptyComponent={
                            <View>
                                <View className="bg-auth-form rounded-xl p-5 mb-6 mt-10">
                                    <AppText>La tua famiglia non ha ancora impegni da completare.</AppText>
                                </View>
                            </View>
                        }
                    />
                )}
            </View>
        </AppShell>
    );
}
