import React from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";

export function NotificationsScreen() {
    return (
        <AppShell>
            <View className="pt-6">
                <Text className="text-xl font-sans text-text-main">Notifications</Text>
            </View>
        </AppShell>
    );
}
