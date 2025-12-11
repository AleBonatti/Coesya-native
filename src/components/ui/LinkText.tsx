import React from "react";
import { Text, Pressable } from "react-native";

type LinkVariant = "primary" | "muted";

interface LinkTextProps {
    children: string;
    onPress: () => void;
    variant?: LinkVariant;
    className?: string;
}

export function LinkText({ children, onPress, variant = "primary", className = "" }: LinkTextProps) {
    const variantClass = variant === "primary" ? "text-brand-primary" : "text-text-light";

    return (
        <Pressable onPress={onPress}>
            <Text className={`${variantClass} ${className}`}>{children}</Text>
        </Pressable>
    );
}
