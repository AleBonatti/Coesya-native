import React from "react";
import { Text, TextProps } from "react-native";

export type TextVariant = "primary" | "secondary" | "light" | "placeholder";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
interface AppTextProps extends TextProps {
    className?: string;
    variant?: TextVariant;
    weight?: TextWeight;
}

const variantClasses: Record<TextVariant, string> = {
    primary: "text-text-main",
    secondary: "text-brand-darker",
    light: "text-white",
    placeholder: "text-text-light",
};

const weightClass: Record<TextWeight, string> = {
    regular: "font-sans",
    medium: "font-sansMedium",
    semibold: "font-sansSemibold",
    bold: "font-sansBold",
};

export function AppText({ className = "", variant = "primary", weight = "regular", ...props }: AppTextProps) {
    return (
        <Text
            {...props}
            className={`${weightClass[weight]} ${variantClasses[variant]} ${className}`}
        />
    );
}
