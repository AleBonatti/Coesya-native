import React from "react";
import { Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "dark" | "ghost" | "danger" | "white";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    disabled?: boolean;
}

export function Button({ title, onPress, variant = "primary", size = "md", className = "", disabled = false }: ButtonProps) {
    const baseStyles = "rounded-xl items-center justify-center flex-row";

    const sizeStyles: Record<ButtonSize, string> = {
        sm: "py-2 px-3",
        md: "py-4 px-4",
        lg: "py-5 px-5",
    };

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-brand-primary",
        secondary: "bg-brand-accent",
        tertiary: "bg-brand-tertiary",
        dark: "bg-brand-darker",
        ghost: "bg-transparent border border-white",
        danger: "bg-red-600",
        white: "bg-white",
    };

    const disabledStyles = disabled ? "opacity-50" : "";

    const textStyles: Record<ButtonVariant, string> = {
        primary: "primary text-white",
        secondary: "font-sansSemibold text-white",
        tertiary: "font-sansMedium text-white",
        dark: "text-white",
        ghost: "font-sansSemibold text-white",
        danger: "text-white",
        white: "text-brand-tertiary",
    };

    const textSize = "text-base";

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabledStyles}
        ${className}
      `}>
            <Text className={`${textSize} ${textStyles[variant]}`}>{title}</Text>
        </Pressable>
    );
}
