import React from "react";
import { Text, Pressable } from "react-native";

type LinkVariant = "primary" | "secondary" | "dark" | "muted";

interface LinkTextProps {
    children: string;
    onPress: () => void;
    variant?: LinkVariant;
    className?: string;
}

const variantClasses: Record<LinkVariant, string> = {
    primary: "text-brand-primary",
    dark: "text-text-main",
    secondary: "text-white",
    muted: "text-brand-darker",
};

export function LinkText({ children, onPress, variant = "primary", className = "" }: LinkTextProps) {
    return (
        <Pressable onPress={onPress}>
            <Text className={`font-sans ${variantClasses[variant]} ${className}`}>{children}</Text>
        </Pressable>
    );
}
