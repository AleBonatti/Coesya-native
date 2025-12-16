import React from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";

export function ResetDataScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <Text className="text-xl font-semibold text-white">Reset Data</Text>
            </View>
        </AppShell>
    );
}
