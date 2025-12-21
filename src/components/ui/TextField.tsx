import React, { useState } from "react";
import { View, Text, Platform, TextInput, TextInputProps, ActivityIndicator } from "react-native";

export type InputVariant = "primary" | "dark";
type TextFieldSize = "sm" | "md" | "lg";

interface TextFieldProps extends TextInputProps {
    label?: string;
    size?: TextFieldSize;
    variant?: InputVariant;
    error?: string;
    isLoading?: boolean;
    className?: string;
}

const variantClasses: Record<InputVariant, string> = {
    primary: "bg-auth-bg",
    dark: "bg-auth-form",
};

export function TextField({ label, size = "md", variant = "primary", error, className = "", isLoading = false, ...props }: TextFieldProps) {
    const [isFocused, setIsFocused] = useState(false);

    const sizeStyles: Record<TextFieldSize, string> = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-4 text-base",
        lg: "px-7 py-5 text-lg",
    };

    const webNoOutlineStyle =
        Platform.OS === "web"
            ? ({
                  outlineStyle: "none",
                  outlineWidth: 0,
              } as any)
            : undefined;

    //const borderColorClass = error ? "border-red-500" : isFocused ? "border-brand-primary" : "border-transparent";

    return (
        <View className="mb-4">
            {label && <Text className="font-sans text-base font-medium text-text-light mb-2">{label}</Text>}

            <View className="relative">
                <TextInput
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    placeholderTextColor="#868686"
                    style={[webNoOutlineStyle, props.style]}
                    className={`
                        ${variantClasses[variant]}
                        font-sans rounded-xl text-text-main border
                        ${error ? "border-red-500" : "border-transparent"}
                        ${sizeStyles[size]}
                        ${isLoading ? "pr-12" : ""} 
                        ${className}
                    `}
                />
                {isLoading ? (
                    <View
                        pointerEvents="none"
                        className="absolute right-4 top-0 bottom-0 justify-center">
                        <ActivityIndicator size="small" />
                    </View>
                ) : null}
            </View>
            {error && <Text className="font-sans text-xs text-red-500 mt-1">{error}</Text>}
        </View>
        /* ${isFocused && !error ? "bg-brand-primary/10" : "bg-auth-bg"} */
    );
}
