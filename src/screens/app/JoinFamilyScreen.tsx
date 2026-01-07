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

export function JoinFamilyScreen() {
    const notify = useNotificationStore((s) => s.show);
    const [code, setCode] = useState<string>("");

    const joinFamily = useFamilyStore((s) => s.joinFamily);
    const isJoining = useFamilyStore((s) => s.isJoining);
    const joinError = useFamilyStore((s) => s.joinError);
    const joinSuccess = useFamilyStore((s) => s.joinSuccess);
    const clearJoinError = useFamilyStore((s) => s.clearJoinError);
    const clearJoinSuccess = useFamilyStore((s) => s.clearJoinSuccess);

    const refreshMe = useAuthStore((s) => s.refreshMe);

    React.useEffect(() => {
        if (joinSuccess) {
            notify({
                type: "success",
                title: joinSuccess,
            });
            clearJoinSuccess();
        }
    }, [joinSuccess, notify, clearJoinSuccess]);

    React.useEffect(() => {
        if (joinError) {
            notify({
                type: "error",
                title: joinError,
            });
            clearJoinError();
        }
    }, [joinError, notify, clearJoinError]);

    const handleJoin = async () => {
        try {
            await joinFamily(code);
            await refreshMe();
            // Reset code after success
            setCode("");
        } catch {
            // errori già gestiti nello store
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
                    onChange={(newCode) => {
                        setCode(newCode);
                    }}
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
