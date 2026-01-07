import React, { useState } from "react";
import { View } from "react-native";

import { useAuthStore } from "../../auth/authStore";
import { AppShell } from "../../components/layout/AppShell";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { AppText } from "../../components/ui/AppText";
import { Button } from "../../components/ui/Button";
import { CodeInput } from "../../components/ui/CodeInput";
import { useFamilyStore } from "../../family/familyStore";
import { useNotificationStore } from "../../components/notifications/notificationStore";
import { ApiError } from "../../lib/api";

export function WizardJoinFamilyScreen() {
    const [code, setCode] = useState<string>("");

    const notify = useNotificationStore((s) => s.show);
    const joinFamily = useFamilyStore((s) => s.joinFamily);
    const isJoining = useFamilyStore((s) => s.isJoining);

    const refreshMe = useAuthStore((s) => s.refreshMe);

    const handleJoin = async () => {
        try {
            await joinFamily(code);
            await refreshMe();
            setCode("");

            notify({
                type: "success",
                title: "Risultato operazione:",
                message: "Ti sei unito alla famiglia con successo!",
            });
        } catch (e) {
            if (e instanceof ApiError) {
                let errorMessage: string;

                switch (e.status) {
                    case 422:
                        errorMessage = "Codice mancante o non valido";
                        break;
                    case 404:
                        errorMessage = "Famiglia non trovata o codice non valido";
                        break;
                    case 409:
                        errorMessage = "Sei già membro di questa famiglia";
                        break;
                    case 401:
                    case 403:
                        errorMessage = "Non hai i permessi per unirti a questa famiglia";
                        break;
                    default:
                        errorMessage = "Si è verificato un errore. Riprova tra poco.";
                }

                notify({
                    type: "error",
                    title: "Attenzione!",
                    message: errorMessage,
                });
            } else {
                notify({
                    type: "error",
                    title: "Attenzione!",
                    message: "Si è verificato un errore. Riprova tra poco.",
                });
            }
        }
    };

    const isCodeComplete = code.length === 5;

    return (
        <AppShell backgroundClassName="bg-transparent">
            <SectionTitle
                label="Unisciti a una famiglia"
                variant="light"
            />

            <AppText
                variant="light"
                className="mb-12">
                Hai un codice di invito? Inseriscilo qui per unirti alla tua famiglia e iniziare subito!
            </AppText>

            <View className="mb-4">
                <CodeInput
                    length={5}
                    value={code}
                    onChange={setCode}
                    disabled={isJoining}
                />
            </View>

            <View className="flex-1" />

            <View className="pb-8">
                <Button
                    disabled={!isCodeComplete || isJoining}
                    onPress={handleJoin}
                    title={isJoining ? "Unione in corso..." : "Unisciti"}
                    variant="secondary"
                />
            </View>
        </AppShell>
    );
}
