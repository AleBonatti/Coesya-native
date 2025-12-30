import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../categories/categoryTypes";

type FeatherIconName = React.ComponentProps<typeof Ionicons>["name"];

interface CategoryIconProps {
    category: Category | null | undefined;
    is_completed: boolean;
    size?: number;
}

/**
 * Whitelist delle icone consentite (sicura).
 * Key = valore che arriva in category.ico
 * Value = nome icona
 */
const ICO_MAP: Readonly<Record<string, FeatherIconName>> = {
    home: "home",
    bureaucracy: "book",
    pets: "paw",
    "do-it-yourself": "hammer",
    shopping: "bag",
    default: "pricetag-outline",
};

/**
 * Colori per la bolla quando NON è completato.
 * Key = valore che arriva in category.ico
 */
const COLOR_MAP: Readonly<Record<string, string>> = {
    home: "bg-brand-tertiary",
    bureaucracy: "bg-brand-primary",
    pets: "bg-brand-accent",
    shopping: "bg-brand-darker",
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
            <Ionicons
                name={iconName}
                size={size}
                color="#FFFFFF"
            />
        </View>
    );
}
