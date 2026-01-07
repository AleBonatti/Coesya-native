import React from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/ui/Button";
import { AppText } from "../../components/ui/AppText";
import { MainStackParamList } from "../../navigation/MainStackParamList";

type Props = NativeStackScreenProps<MainStackParamList, "WizardHome">;

export function WizardHomeScreen({ navigation }: Props) {
    return (
        <AppShell backgroundClassName="bg-transparent">
            <View className="flex-1 justify-end pb-6">
                <View className="gap-8">
                    <AppText
                        variant="light"
                        className="text-xl">
                        Crea la tua famiglia
                    </AppText>

                    <AppText
                        variant="light"
                        className="text-sm">
                        Benvenuto! Per iniziare, scegli se creare una nuova famiglia o unirti a una esistente. Potrai organizzare i tuoi impegni e collaborare facilmente con gli altri membri.
                    </AppText>

                    <AppText
                        variant="light"
                        className="text-base"
                        weight="medium">
                        Unisciti a una famiglia esistente.
                    </AppText>

                    <AppText
                        variant="light"
                        className="text-sm">
                        Se hai ricevuto un invito, puoi unirti direttamente a una famiglia esistente usando il codice di invito. Assicurati di averlo a portata di mano per procedere senza creare una nuova famiglia.
                    </AppText>

                    <View className="gap-3">
                        <Button
                            onPress={() => navigation.navigate("WizardCreateFamily")}
                            title="Nuova famiglia"
                            variant="secondary"
                        />

                        <Button
                            onPress={() => navigation.navigate("WizardJoinFamily")}
                            title="Unisciti con codice"
                        />
                    </View>
                </View>
            </View>
        </AppShell>
    );
}
