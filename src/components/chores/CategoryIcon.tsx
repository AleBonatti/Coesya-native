import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ActiveChore } from "../../chores/choreTypes";
import { Category } from "../../categories/categoryTypes";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface CategoryIconProps {
    category: Category | null | undefined;
    is_completed: boolean;
    size?: number;
}

/**
 * Whitelist delle icone consentite (sicura).
 * Key = valore che arriva in category.ico
 * Value = nome icona Feather
 */
const ICO_MAP: Readonly<Record<string, FeatherIconName>> = {
    home: "home",
    book: "book",
    tool: "tool",
    anchor: "anchor",
    default: "tag",
};

/**
 * Colori per la bolla quando NON è completato.
 * Key = valore che arriva in category.ico
 */
const COLOR_MAP: Readonly<Record<string, string>> = {
    pulizia: "bg-brand-accent",
    burocrazia: "bg-brand-primary",
    spesa: "bg-red-500",
    default: "bg-text-light", // fallback
};

function getIconName(category: Category | null | undefined): FeatherIconName {
    const icoKey = category?.ico ?? "default";
    return ICO_MAP[icoKey] ?? ICO_MAP.default;
}

function getBgClass(category: Category | null | undefined, isCompleted: boolean): string {
    if (isCompleted) {
        return "bg-text-light"; // grigio (slate-500 circa) -> “completato”
    }

    const icoKey = category?.ico ?? "default";
    return COLOR_MAP[icoKey] ?? COLOR_MAP.default;
}

export function CategoryIcon({ category, is_completed, size = 18 }: CategoryIconProps) {
    const bgClass = getBgClass(category, is_completed);
    const iconName = getIconName(category);

    return (
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgClass}`}>
            <Feather
                name={iconName}
                size={size}
                color="#FFFFFF"
            />
        </View>
    );
}
