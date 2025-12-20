import React from "react";
import { View } from "react-native";
import { Screen } from "./Screen";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
    children: React.ReactNode;
    backgroundClassName?: string;
    showHeader?: boolean;
    padded?: boolean;
}

export function AppShell({ children, backgroundClassName = "bg-transparent", showHeader = true, padded = true }: AppShellProps) {
    return (
        <Screen backgroundClassName={backgroundClassName}>
            <View className="flex-1">
                {showHeader ? <AppHeader /> : null}
                <View className={`flex-1 ${padded ? "px-6 pt-4" : ""}`}>{children}</View>
            </View>
        </Screen>
    );
}
