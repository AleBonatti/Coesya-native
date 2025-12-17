import React from "react";
import { View } from "react-native";
import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";

export function GoalsScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <AppText
                    weight="semibold"
                    className="text-2xl"
                    variant="primary">
                    Goals
                </AppText>
            </View>
        </AppShell>
    );
}
