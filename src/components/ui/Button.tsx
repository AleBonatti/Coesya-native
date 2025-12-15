import React from "react";
import { Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost";
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
        ghost: "bg-transparent border border-brand-primary",
    };

    const disabledStyles = disabled ? "opacity-50" : "";
    const textVariant = variant === "primary" ? "font-semibold text-white" : variant === "secondary" ? "font-semibold text-brand-darker" : "font-semibold";

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
            <Text className={`font-sans ${textSize} ${textVariant}`}>{title}</Text>
        </Pressable>
    );
}
