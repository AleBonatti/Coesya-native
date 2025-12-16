import React from "react";
import { Text, Pressable } from "react-native";

type LinkVariant = "primary" | "muted";

interface LinkTextProps {
    children: string;
    onPress: () => void;
    variant?: LinkVariant;
    className?: string;
}

// TODO impostare le variant

export function LinkText({ children, onPress, variant = "primary", className = "" }: LinkTextProps) {
    const variantClass = variant === "primary" ? "text-white" : "text-brand-primary";

    return (
        <Pressable onPress={onPress}>
            <Text className={`font-sans ${variantClass} ${className}`}>{children}</Text>
        </Pressable>
    );
}
