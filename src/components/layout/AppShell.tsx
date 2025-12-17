import React from "react";
import { View } from "react-native";
import { Screen } from "./Screen";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
    children: React.ReactNode;
    backgroundClassName?: string;
}

export function AppShell({ children, backgroundClassName = "bg-white" }: AppShellProps) {
    return (
        <Screen backgroundClassName={backgroundClassName}>
            <View className="flex-1">
                <AppHeader />
                <View className="flex-1 px-6 pt-4">{children}</View>
            </View>
        </Screen>
    );
}
