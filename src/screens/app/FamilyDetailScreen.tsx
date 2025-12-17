import React from "react";
import { Text, View } from "react-native";
import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";

export function FamilyDetailScreen() {
    return (
        <AppShell backgroundClassName="bg-transparent">
            <View className="pt-6">
                <AppText className="text-xl">Dettaglio Famiglia</AppText>
            </View>
        </AppShell>
    );
}
