import React from "react";
import { View } from "react-native";
import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";

export function ChoresScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <AppText
                    weight="semibold"
                    className="text-2xl"
                    variant="primary">
                    Chores
                </AppText>
            </View>
        </AppShell>
    );
}
