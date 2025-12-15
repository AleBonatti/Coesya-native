import React from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";

export function JoinFamilyScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <Text className="text-xl font-semibold text-text-main">Join famiglia</Text>
            </View>
        </AppShell>
    );
}
