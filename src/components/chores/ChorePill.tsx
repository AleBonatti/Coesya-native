// components/chores/ChorePill.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ActivityIndicator, Animated, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../ui/AppText";
import { ActiveChore, Chore } from "../../chores/choreTypes";
import { useChoresStore } from "../../chores/choreStore";
import { CategoryIcon } from "./CategoryIcon";
import { MainStackParamList } from "../../navigation/MainStackParamList";
interface ChorePillProps {
    item: ActiveChore;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function ChorePill({ item, isOpen, onToggle, onClose }: ChorePillProps) {
    const navigation = useNavigation<Nav>();

    const toggleComplete = useChoresStore((s) => s.toggleComplete);
    const togglingIds = useChoresStore((s) => s.togglingIds);
    const isToggling = Boolean(togglingIds[item.id]);

    // progress 0..1: 0 overlay fuori, 1 overlay visibile
    const progress = useRef(new Animated.Value(0)).current;

    // overlay width: 50% pill (usiamo translateX per farlo entrare)
    // (numeric value fissa in px, così non dipendiamo da percentuali in Animated)
    const OVERLAY_W = 170; // puoi aumentare/diminuire in base al look

    useEffect(() => {
        Animated.timing(progress, {
            toValue: isOpen ? 1 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [isOpen, progress]);

    const overlayTranslateX = useMemo(() => {
        // da +OVERLAY_W (fuori a destra) a 0 (in posizione)
        return progress.interpolate({
            inputRange: [0, 1],
            outputRange: [OVERLAY_W, 0],
        });
    }, [progress]);

    const handlePillPress = () => {
        if (isToggling) return;
        // primo tap: apri/chiudi menu, non completare direttamente
        onToggle(); // 👈 apre questa e chiude le altre (gestito dal parent)
    };

    const handleComplete = async () => {
        if (isToggling) return;
        onClose();
        await toggleComplete(item.id);
    };

    const handleEdit = () => {
        if (isToggling) return;
        onClose();
        navigation.navigate("FamilyTabs", {
            screen: "Chores",
            params: {
                screen: "ChoreCreate",
                params: { choreId: item.id },
            },
        });
    };

    return (
        <View className="border rounded-2xl border-text-light overflow-hidden">
            {/* ✅ MAIN TAP AREA */}
            <Pressable
                onPress={handlePillPress}
                className="px-3 py-2"
                accessibilityRole="button"
                accessibilityLabel="Azioni impegno">
                <View className="flex-row items-center">
                    {/* ICONA CATEGORIA */}
                    <CategoryIcon
                        category={item.category}
                        is_completed={item.is_completed}
                    />

                    {/* TESTI */}
                    <View className="flex-1 pr-3">
                        <AppText
                            variant="placeholder"
                            weight="medium"
                            className="text-base">
                            {item.title}
                        </AppText>
                        <View className="flex-row flex-wrap gap-1 items-center">
                            <AppIcon
                                name="time-outline"
                                color="#868686"
                                size={14}
                            />
                            <AppText
                                variant="placeholder"
                                className="text-sm">
                                {formatDue(item.due_at)}
                            </AppText>
                            {/* <AppText
                            variant="placeholder"
                            className="text-sm">
                            - P{item.priority} · W{item.weight}
                        </AppText> */}
                        </View>
                    </View>
                </View>
            </Pressable>
            {/* OVERLAY AZIONI (entra da destra, copre ~50%) */}
            <Animated.View
                pointerEvents={isOpen ? "auto" : "none"}
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: OVERLAY_W,
                    transform: [{ translateX: overlayTranslateX }],
                }}>
                {/* layer */}
                <View className="flex-1 bg-brand-primary flex-row">
                    {/* Completa */}
                    <Pressable
                        onPress={() => void handleComplete()}
                        disabled={isToggling}
                        className="flex-1 items-center justify-center bg-brand-darker active:opacity-90"
                        accessibilityRole="button"
                        accessibilityLabel="Completa">
                        <AppText className="text-white">Completa</AppText>
                    </Pressable>
                    {/* Edit */}
                    <Pressable
                        onPress={handleEdit}
                        disabled={isToggling}
                        className="w-14 items-center justify-center"
                        accessibilityRole="button"
                        accessibilityLabel="Modifica">
                        <AppIcon
                            name="settings-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}

function formatDue(dueIso: string): string {
    const d = new Date(dueIso);

    return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
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
