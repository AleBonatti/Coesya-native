import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ImageBackground, Pressable } from "react-native";
import { useDebounce } from "../../../hooks/useDebounce";
import * as ImagePicker from "expo-image-picker";
import { AppShell } from "../../../components/layout/AppShell";
import { useAuthStore } from "../../../auth/authStore";
import { useFamilyStore } from "../../../family/familyStore";
import { getCurrentFamily } from "../../../auth/authSelectors";
import { TextField } from "../../../components/ui/TextField";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";

export function FamilyScreen() {
    const user = useAuthStore((s) => s.user);
    const family = getCurrentFamily(user);
    const familyId = family?.id;

    const refreshMe = useAuthStore((s) => s.refreshMe);

    const updateFamily = useFamilyStore((s) => s.updateFamily);
    const fieldErrors = useFamilyStore((s) => s.fieldErrors);
    const clearFieldError = useFamilyStore((s) => s.clearFieldError);

    // stato form
    const [name, setName] = useState<string>(family?.name ?? "");
    const [code, setCode] = useState<string>(""); // verrà valorizzato da API o da family se ce l’hai

    const [showNameSpinner, setShowNameSpinner] = useState(false);

    // sync quando cambia family (es. refreshMe)
    useEffect(() => {
        if (!family) return;
        setName(family.name);
        setCode(family.code ?? "");
    }, [family]);

    // debounce di 1s sul nome
    const debouncedName = useDebounce(name, 1000);

    // evita chiamata al primo render
    const didMountRef = useRef(false);

    // evita doppie chiamate se stai rimandando sempre lo stesso valore
    const lastSentNameRef = useRef<string>("");

    // gestisce risposte “in ritardo” (race condition)
    const requestSeqRef = useRef(0);

    // Update titolo / codice
    useEffect(() => {
        if (!familyId) return;

        if (!didMountRef.current) {
            didMountRef.current = true;
            lastSentNameRef.current = debouncedName.trim();
            return;
        }

        const trimmed = debouncedName.trim();
        if (!trimmed) return;

        if (trimmed === lastSentNameRef.current) return;

        const seq = ++requestSeqRef.current;

        setShowNameSpinner(true);

        setTimeout(() => {
            void (async () => {
                try {
                    lastSentNameRef.current = trimmed;

                    const updated = await updateFamily(familyId, { name: trimmed });

                    if (seq !== requestSeqRef.current) return;

                    setCode(updated.code); // ✅ aggiorna codice/slug
                    await refreshMe(); // opzionale ma ok se vuoi riallineare user/families
                } catch {
                    // errori già nello store (fieldErrors/formError)
                } finally {
                    /* if (spinnerTimerRef.current) {
                        clearTimeout(spinnerTimerRef.current);
                        spinnerTimerRef.current = null;
                    } */
                    setShowNameSpinner(false);
                }
            })();
        }, 1000);
    }, [debouncedName, familyId, updateFamily, refreshMe]);

    /* function carica() {
        const asset = await pickFamilyImage();
        if (!asset || !familyId) return;

        setLocalPhotoUri(asset.uri); // preview immediata
        setUploading(true);

        try {
            const updatedFamily = await uploadFamilyPhoto(familyId, asset);
            await refreshMe(); // oppure aggiorna direttamente lo store user/family
        } finally {
            setUploading(false);
        }
    } */

    // Updload immagine
    async function pickFamilyImage(): Promise<ImagePicker.ImagePickerAsset | null> {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") return null;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // crop
            aspect: [1, 1], // avatar quadrato
            quality: 0.85,
        });

        if (result.canceled) return null;
        return result.assets[0] ?? null;
    }

    return (
        <AppShell
            padded={false}
            showHeader={false}>
            <View className="flex-1 bg-brand-primary">
                {/* TOP — immagine */}
                <View className="flex-[2]">
                    <ImageBackground
                        source={{ uri: family?.profile_photo_url }}
                        resizeMode="cover"
                        className="flex-1 justify-end">
                        {/* opzionale: overlay scuro */}
                        <View className="absolute inset-0" />

                        {/* Overlay scuro (se già lo usi) */}
                        <View className="absolute inset-0" />

                        {/* ✅ ICON BAR */}
                        <View className="absolute top-0 right-0 pt-8 px-6 flex-row items-center gap-3">
                            <IconButton
                                icon="settings"
                                onPress={() => {}}
                            />
                            <IconButton
                                icon="camera"
                                onPress={() => pickFamilyImage}
                            />
                            <IconButton
                                icon="more-horizontal"
                                onPress={() => {}}
                            />
                        </View>
                    </ImageBackground>
                </View>

                {/* BOTTOM — sheet */}
                <View className="flex-[3] bg-white rounded-t-3xl px-6 pt-6">
                    <View>
                        <TextField
                            label="Nome famiglia"
                            value={name}
                            onChangeText={setName}
                            placeholder="Nome famiglia"
                            isLoading={showNameSpinner}
                            error={fieldErrors.name}
                        />
                        <TextField
                            label="Codice famiglia vicina"
                            value={code}
                            editable={false}
                            placeholder="—"
                        />
                    </View>
                    <Button
                        variant="tertiary"
                        size="sm"
                        title="Genera codice invito"
                        onPress={() => {}}
                    />
                </View>
            </View>
        </AppShell>
    );
}
