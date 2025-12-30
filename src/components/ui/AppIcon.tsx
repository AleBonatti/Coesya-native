import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type AppIconName = React.ComponentProps<typeof Ionicons>["name"];

type AppIconProps = {
    name: AppIconName;
    size?: number;
    color?: string;
};

export function AppIcon({ name, size = 20, color = "#FFFFFF" }: AppIconProps) {
    return (
        <Ionicons
            name={name}
            size={size}
            color={color}
        />
    );
}
