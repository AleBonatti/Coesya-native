import React, { useEffect, useCallback } from "react";
import { View, ActivityIndicator, FlatList, Pressable } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useAuthStore } from "../../../auth/authStore";
import { useChoresStore } from "../../../chores/choreStore";
import { type MainStackParamList } from "../../../navigation/MainStackParamList";

import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";
import { getCurrentFamily, hasAnyFamily } from "../../../auth/authSelectors";
import { Avatar } from "../../../components/ui/Avatar";
import { IconButton } from "../../../components/ui/IconButton";
import { ChorePill } from "../../../components/chores/ChorePill";
import { ChoreCompletedPill } from "../../../components/chores/ChoreCompletedPill";
import { LinkText } from "../../../components/ui/LinkText";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function FamilyHomeScreen() {
    const tabBarHeight = useBottomTabBarHeight();
    const user = useAuthStore((s) => s.user);
    const navigation = useNavigation<Nav>();

    const pending = useChoresStore((s) => s.pending);
    const completions = useChoresStore((s) => s.completions);
    const isLoading = useChoresStore((s) => s.isLoading);
    const error = useChoresStore((s) => s.error);

    const fetchActive = useChoresStore((s) => s.fetchActive);
    const clearError = useChoresStore((s) => s.clearError);

    useFocusEffect(
        useCallback(() => {
            void fetchActive();
        }, [fetchActive])
    );

    const family = getCurrentFamily(user);
    //const fallback = require("../../../../assets/logo/logo-coesya-transparent.png");

    // Edge case: per qualche motivo siamo qui senza famiglie
    useEffect(() => {
        if (!hasAnyFamily(user)) {
            navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
        }
    }, [user?.families?.length, navigation]);

    return (
        <AppShell>
            {family ? (
                isLoading ? (
                    <View className="py-10 items-center justify-center">
                        <ActivityIndicator />
                        <AppText className="mt-3 text-text-main">Caricamento…</AppText>
                    </View>
                ) : (
                    <>
                        <View className="w-full flex-row items-center justify-between pt-4 pb-8">
                            <Avatar
                                uri={family.profile_photo_url}
                                name={family.name}
                                size={70}
                            />

                            <AppText
                                className="text-xl"
                                weight="medium">
                                {family.name}
                            </AppText>

                            <IconButton
                                icon="arrow-forward"
                                onPress={() => {}}
                                bgClass="bg-brand-primary"
                                color="#FFFFFF"
                                wClass="w-8"
                                hClass="h-8"
                            />
                        </View>

                        {error ? (
                            <Pressable
                                onPress={() => clearError()}
                                className="mb-4 rounded-xl bg-red-500 px-4 py-3">
                                <AppText className="text-white">An error occurred: {error}</AppText>
                                <AppText className="text-white">x</AppText>
                            </Pressable>
                        ) : null}

                        <FlatList
                            data={pending}
                            keyExtractor={(item) => String(item.id)}
                            ItemSeparatorComponent={() => <View className="h-3" />}
                            contentContainerStyle={{
                                paddingBottom: tabBarHeight + 48, // 24 = margine extra “comodo”
                            }}
                            renderItem={({ item }) => {
                                return <ChorePill item={item} />;
                            }}
                            ListEmptyComponent={
                                <View className="bg-auth-form rounded-xl p-5 mt-10">
                                    <AppText>La tua famiglia non ha ancora impegni da completare. Sii il primo a dare inizio a momenti di collaborazione!</AppText>
                                    <LinkText
                                        onPress={() => {
                                            navigation.navigate("FamilyTabs", {
                                                screen: "Chores",
                                            });
                                        }}
                                        className="mt-10">
                                        Clicca qui per creare il tuo primo impegno familiare.
                                    </LinkText>
                                </View>
                            }
                            ListFooterComponent={
                                <View className="mt-8 gap-3">
                                    <AppText
                                        weight="medium"
                                        className="text-base">
                                        Ultimi completati
                                    </AppText>
                                    {completions.length === 0 ? (
                                        <View className="bg-auth-form rounded-xl p-5 mt-2 items-center">
                                            <AppText variant="placeholder">Nessun impegno completato</AppText>
                                        </View>
                                    ) : (
                                        <View className="gap-3">
                                            {completions.map((c) => (
                                                <ChoreCompletedPill
                                                    key={c.id}
                                                    item={c}
                                                />
                                            ))}
                                        </View>
                                    )}
                                </View>
                            }
                        />
                    </>
                )
            ) : (
                <AppText>Nessuna famiglia attiva trovata.</AppText>
            )}
        </AppShell>
    );
}
