import React from "react";
import { View } from "react-native";
import { Screen } from "./Screen";
import { AppHeader } from "./AppHeader";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <Screen backgroundClassName="bg-transparent">
            <View className="flex-1">
                <AppHeader />
                <View className="flex-1 px-6 pt-4">{children}</View>
            </View>
        </Screen>
    );
}
