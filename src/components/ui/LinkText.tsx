import React from "react";
import { Text, Pressable } from "react-native";

type LinkVariant = "primary" | "secondary" | "dark" | "muted";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

interface LinkTextProps {
    children: string;
    onPress: () => void;
    variant?: LinkVariant;
    className?: string;
    weight?: TextWeight;
}

const variantClasses: Record<LinkVariant, string> = {
    primary: "text-brand-primary",
    dark: "text-text-main",
    secondary: "text-white",
    muted: "text-brand-darker",
};

const weightClass: Record<TextWeight, string> = {
    regular: "font-sans",
    medium: "font-sansMedium",
    semibold: "font-sansSemibold",
    bold: "font-sansBold",
};

export function LinkText({ children, onPress, variant = "primary", weight = "regular", className = "" }: LinkTextProps) {
    return (
        <Pressable onPress={onPress}>
            <Text className={`${weightClass[weight]} ${variantClasses[variant]} ${className}`}>{children}</Text>
        </Pressable>
    );
}
