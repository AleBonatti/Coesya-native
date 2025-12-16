import React, { useState } from "react";
import { View, Text, Platform, TextInput, TextInputProps } from "react-native";

type TextFieldSize = "sm" | "md" | "lg";

interface TextFieldProps extends TextInputProps {
    label?: string;
    size?: TextFieldSize;
    error?: string;
    className?: string;
}

export function TextField({ label, size = "md", error, className = "", ...props }: TextFieldProps) {
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

    const borderColorClass = error ? "border-red-500" : isFocused ? "border-brand-primary" : "border-transparent";

    return (
        <View className="mb-4">
            {label && <Text className="font-sans text-base font-medium text-text-light mb-2">{label}</Text>}
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
                    font-sans rounded-xl text-text-main border bg-auth-bg
                    ${error ? "border-red-500" : "border-transparent"}
                    ${sizeStyles[size]}
                    ${className}
                `}
            />
            {error && <Text className="font-sans text-xs text-red-500 mt-1">{error}</Text>}
        </View>
        /* ${isFocused && !error ? "bg-brand-primary/10" : "bg-auth-bg"} */
    );
}
