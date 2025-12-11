import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

type TextFieldSize = "sm" | "md" | "lg";

interface TextFieldProps extends TextInputProps {
    label?: string;
    size?: TextFieldSize;
    error?: string;
    className?: string;
}

export function TextField({ label, size = "md", error, className = "", ...props }: TextFieldProps) {
    const sizeStyles: Record<TextFieldSize, string> = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
    };

    return (
        <View className="mb-4">
            {label && <Text className="text-base font-medium text-text-light mb-2">{label}</Text>}

            <TextInput
                {...props}
                placeholderTextColor="#868686"
                className={`
          bg-auth-bg rounded-xl text-text-main
          ${sizeStyles[size]}
          ${error ? "border-red-500" : ""}
          ${className}
        `}
            />

            {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
        </View>
    );
}
