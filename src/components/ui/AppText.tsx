import React from "react";
import { Text, TextProps } from "react-native";

interface AppTextProps extends TextProps {
    className?: string;
}

export function AppText({ className = "", ...props }: AppTextProps) {
    return (
        <Text
            {...props}
            className={`font-sans text-white ${className}`}
        />
    );
}
