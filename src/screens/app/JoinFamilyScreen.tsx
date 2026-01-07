import React from "react";
import { View } from "react-native";

import { AppShell } from "../../components/layout/AppShell";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";

export function JoinFamilyScreen() {
    return (
        <AppShell backgroundClassName="bg-transparent">
            <SectionTitle
                label="Unisciti a una famiglia"
                variant="light"
            />

            <AppText
                variant="light"
                className="text-sm">
                Hai un codice di invito? Inseriscilo qui per unirti alla tua famiglia e iniziare subito!{" "}
            </AppText>

            <View className="flex-1" />

            <View className="pb-8">
                <Button
                    onPress={() => {}}
                    title="Salva"
                    variant="secondary"
                />
            </View>
        </AppShell>
    );
}
