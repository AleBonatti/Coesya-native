import React, { useState } from "react";
import { View, Image } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

import { Feather } from "@expo/vector-icons";
import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";
import { LinkText } from "../../components/ui/LinkText";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { useFamilyStore } from "../../family/familyStore";

const logo = require("../../../assets/upload.png");

type Props = NativeStackScreenProps<AppStackParamList, "CreateFamily">;

export function CreateFamilyScreen({ navigation }: Props) {
    const [name, setName] = useState<string>("");

    const createFamily = useFamilyStore((s) => s.createFamily);
    const isCreating = useFamilyStore((s) => s.isCreating);
    const formError = useFamilyStore((s) => s.formError);
    const fieldErrors = useFamilyStore((s) => s.fieldErrors);
    const clearFieldError = useFamilyStore((s) => s.clearFieldError);
    const clearFormError = useFamilyStore((s) => s.clearFormError);

    const handleSave = async () => {
        try {
            await createFamily({ name: name.trim() });
            navigation.navigate("Dashboard"); // oppure navigation.goBack();
        } catch {
            // errori già gestiti nello store
        }
    };

    return (
        <AppShell>
            <View className="flex-row items-center mb-6 mt-4 gap-3">
                <Feather
                    name="chevron-left"
                    size={24}
                    color="#FFFFFF"
                />
                <LinkText
                    onPress={() => {}}
                    className="text-lg font-medium">
                    Nuova famiglia
                </LinkText>
            </View>
            <AppText>Assegna un nome alla tua nuova famiglia. Può essere il cognome di famiglia o un titolo originale: lascia spazio alla tua creatività! Non preoccuparti, potrai cambiarlo in seguito.</AppText>

            <View className="items-center justify-center">
                <Image
                    source={logo}
                    resizeMode="contain"
                    className="w-32 h-32 my-10"
                />
            </View>

            {formError ? <AppText className="text-red-500 text-sm mb-3 text-center">{formError}</AppText> : null}

            <TextField
                size="md"
                value={name}
                onChangeText={(v) => {
                    setName(v);
                    clearFieldError("title");
                    clearFormError();
                }}
                placeholder="assegna un nome alla tua famiglia"
                error={fieldErrors.title}
            />

            <View className="flex-1" />

            <View className="pb-6">
                <Button
                    disabled={isCreating}
                    onPress={handleSave}
                    title="Salva"
                    variant="secondary"
                />
            </View>
        </AppShell>
    );
}
