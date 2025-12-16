import React from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";

export function ProfileScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <Text className="text-xl font-semibold text-white">Profile</Text>
            </View>
        </AppShell>
    );
}
