// components/chores/ChorePill.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../ui/AppText";
import { ChoreCompletion } from "../../chores/choreTypes";
import { useChoresStore } from "../../chores/choreStore";
import { CategoryIcon } from "./CategoryIcon";

interface ChorePillProps {
    item: ChoreCompletion;
}

export function ChoreCompletedPill({ item }: ChorePillProps) {
    const toggleComplete = useChoresStore((s) => s.toggleComplete);

    return (
        <Pressable
            onPress={() => void toggleComplete(item.id)}
            className="px-3 py-2 border rounded-2xl border-text-light"
            accessibilityRole="button"
            /* accessibilityLabel={item.is_completed ? "Segna come non completato" : "Segna come completato"} */
        >
            <View className="flex-row items-center">
                <CategoryIcon
                    category={item.chore.category}
                    is_completed={true}
                />

                <View className="flex-1">
                    <View className="flex-row items-center gap-1">
                        <AppIcon
                            name="checkmark-circle"
                            color="#868686"
                        />
                        <AppText
                            variant="placeholder"
                            weight="medium">
                            {item.chore.title}
                        </AppText>
                    </View>
                    <AppText variant="placeholder">{formatDue(item.completed_at)}</AppText>
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
