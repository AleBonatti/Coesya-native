// components/chores/ChorePill.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Pressable } from "react-native";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../ui/AppText";
import { ActiveChore, Chore } from "../../chores/choreTypes";
import { useChoresStore } from "../../chores/choreStore";
import { CategoryIcon } from "./CategoryIcon";

interface ChorePillProps {
    item: ActiveChore;
}

export function ChorePill({ item }: ChorePillProps) {
    const toggleComplete = useChoresStore((s) => s.toggleComplete);
    const togglingIds = useChoresStore((s) => s.togglingIds);
    const isToggling = Boolean(togglingIds[item.id]);

    return (
        <Pressable
            onPress={() => void toggleComplete(item.id)}
            className="px-3 py-2 border rounded-2xl border-text-light"
            accessibilityRole="button"
            accessibilityLabel={item.is_completed ? "Segna come non completato" : "Segna come completato"}>
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
                        {/* <AppText variant="placeholder">{item.category.title}</AppText> */}
                        {/* <AppText variant="placeholder">•</AppText> */}
                        {/* <View className="rounded-full bg-white/15 px-3 py-1">
                            <AppText>{frequencyLabel(item.frequency)}</AppText>
                        </View> */}
                        <AppText
                            variant="placeholder"
                            className="text-sm">
                            {formatDue(item.due_at)}
                        </AppText>
                        <AppText
                            variant="placeholder"
                            className="text-sm">
                            - P{item.priority} · W{item.weight}
                        </AppText>
                    </View>
                </View>

                {/* STATO */}
                <View className="w-10 h-10 rounded-full items-center justify-center bg-auth-form">
                    {isToggling ? (
                        <ActivityIndicator />
                    ) : (
                        <AppIcon
                            name={item.is_completed ? "checkmark" : "ellipse-outline"}
                            size={20}
                            color="#121212"
                        />
                    )}
                </View>
            </View>
        </Pressable>
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
