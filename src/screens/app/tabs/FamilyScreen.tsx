import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Animated, Dimensions, View, ImageBackground, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useDebounce } from "../../../hooks/useDebounce";
import * as ImagePicker from "expo-image-picker";
import { AppShell } from "../../../components/layout/AppShell";
import { useAuthStore } from "../../../auth/authStore";
import { useFamilyStore } from "../../../family/familyStore";
import { getCurrentFamily } from "../../../auth/authSelectors";
import { TextField } from "../../../components/ui/TextField";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { AppText } from "../../../components/ui/AppText";
import { Avatar } from "../../../components/ui/Avatar";

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

    const uploadFamilyPhoto = useFamilyStore((s) => s.uploadFamilyPhoto);
    const isUploadingPhoto = useFamilyStore((s) => s.isUploadingPhoto);

    const members = useFamilyStore((s) => s.members);
    const isLoadingMembers = useFamilyStore((s) => s.isLoadingMembers);
    const membersError = useFamilyStore((s) => s.membersError);
    const fetchMembers = useFamilyStore((s) => s.fetchMembers);
    const clearMembersError = useFamilyStore((s) => s.clearMembersError);

    // layer codice
    const [isReadyToShowSheet, setIsReadyToShowSheet] = useState(false);
    const didAnimateOpenRef = useRef(false);
    const [sheetHeight, setSheetHeight] = useState(0);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState<string>("");
    const slideY = useRef(new Animated.Value(0)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const isSavingInviteCode = useFamilyStore((s) => s.isSavingInviteCode);
    const inviteCodeError = useFamilyStore((s) => s.inviteCodeError);
    const saveInviteCode = useFamilyStore((s) => s.saveInviteCode);
    const clearInviteCodeError = useFamilyStore((s) => s.clearInviteCodeError);

    function generate5Digits(): string {
        const n = Math.floor(10000 + Math.random() * 90000);
        return String(n);
    }

    const openInvite = () => {
        if (!familyId) return;

        clearInviteCodeError();
        const newCode = generate5Digits();
        setInviteCode(newCode);

        // reset gating
        setSheetHeight(0);
        setIsReadyToShowSheet(false);
        didAnimateOpenRef.current = false;

        setInviteOpen(true);

        void saveInviteCode(familyId, newCode);
    };

    const closeInvite = () => {
        const endY = sheetHeight > 0 ? sheetHeight : 300;

        Animated.parallel([
            Animated.timing(slideY, {
                toValue: endY,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) setInviteOpen(false);
        });
    };

    useEffect(() => {
        if (!inviteOpen) return;
        if (!isReadyToShowSheet) return;
        if (didAnimateOpenRef.current) return;

        didAnimateOpenRef.current = true;

        slideY.setValue(sheetHeight);
        backdropOpacity.setValue(0);

        Animated.parallel([Animated.timing(slideY, { toValue: 0, duration: 220, useNativeDriver: true }), Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true })]).start();
    }, [inviteOpen, isReadyToShowSheet, sheetHeight, slideY, backdropOpacity]);

    useEffect(() => {
        if (!inviteOpen) return;
        if (sheetHeight <= 0) return;

        setIsReadyToShowSheet(true);
    }, [inviteOpen, sheetHeight]);

    const copyInviteCode = async () => {
        if (!inviteCode) return;
        await Clipboard.setStringAsync(inviteCode);
        // opzionale: toast/snackbar in futuro
    };

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

    const handlePickPhoto = async () => {
        if (!familyId) return;

        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        if (!asset) return;

        try {
            await uploadFamilyPhoto(familyId, asset);

            // riallinea user/family nel tuo authStore (così profile_photo_url si aggiorna)
            await refreshMe();
        } catch {
            alert("error!");
            // errore già nello store (formError)
        }
    };

    useEffect(() => {
        if (!familyId) return;
        void fetchMembers(familyId);
    }, [familyId, fetchMembers]);

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
                                onPress={() => handlePickPhoto()}
                                isLoading={isUploadingPhoto}
                            />
                            <IconButton
                                icon="ellipsis-horizontal"
                                onPress={() => {}}
                            />
                        </View>
                    </ImageBackground>
                </View>

                {/* BOTTOM — sheet */}
                <View className="flex-[3] bg-auth-bg rounded-t-3xl pt-6">
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 24 }}
                        showsVerticalScrollIndicator={false}>
                        <View className="px-6">
                            <TextField
                                variant="dark"
                                label="Nome famiglia"
                                value={name}
                                onChangeText={setName}
                                placeholder="Nome famiglia"
                                isLoading={showNameSpinner}
                                error={fieldErrors.name}
                            />
                            <TextField
                                variant="dark"
                                label="Codice famiglia vicina"
                                value={code}
                                editable={false}
                                placeholder="—"
                            />
                        </View>
                        {/* ✅ MEMBRI */}
                        <View className="mb-6">
                            {membersError ? (
                                <Pressable
                                    onPress={() => clearMembersError()}
                                    className="mt-3 rounded-xl bg-red-500/15 px-4 py-3">
                                    <AppText
                                        weight="semibold"
                                        className="text-text-main">
                                        Errore
                                    </AppText>
                                    <AppText className="text-text-main/80 mt-1">{membersError}</AppText>
                                    <AppText className="text-text-main/60 mt-2">Tocca per chiudere</AppText>
                                </Pressable>
                            ) : null}

                            {isLoadingMembers ? (
                                <View className="py-6 items-center">
                                    <ActivityIndicator />
                                    <AppText className="mt-2 text-text-main/70">Caricamento membri…</AppText>
                                </View>
                            ) : members.length === 0 ? (
                                <View className="mt-3 rounded-xl px-4 py-4">
                                    <AppText>Nessun membro trovato.</AppText>
                                </View>
                            ) : (
                                <View className="mt-3 gap-2">
                                    {members.map((m) => (
                                        <View
                                            key={m.id}
                                            className="flex-row items-center justify-between border-b border-auth-form px-6 py-3">
                                            <View className="flex-row items-center gap-3 flex-1 pr-3">
                                                <Avatar
                                                    uri={m.profile_photo_url ?? undefined}
                                                    name={`${m.firstname} ${m.lastname}`}
                                                    size={40}
                                                />
                                                <View className="flex-1">
                                                    <AppText
                                                        weight="medium"
                                                        className="text-text-main">
                                                        {`${m.firstname} ${m.lastname}`}
                                                    </AppText>
                                                    {m.email ? <AppText className="text-text-main/60">{m.email}</AppText> : null}
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                        {/* ✅ PULSANTE GENERAZIONE CODICE */}
                        <View className="px-6">
                            <Button
                                variant="tertiary"
                                size="sm"
                                title="Genera codice invito"
                                onPress={openInvite}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>

            <Modal
                visible={inviteOpen}
                transparent
                animationType="none"
                onRequestClose={closeInvite}>
                {/* Backdrop */}
                <Pressable
                    onPress={closeInvite}
                    style={{ flex: 1 }}>
                    <Animated.View
                        style={{
                            flex: 1,
                            opacity: backdropOpacity,
                            backgroundColor: "rgba(0,0,0,0.35)",
                        }}
                    />
                </Pressable>

                {/* 1) MISURATORE INVISIBILE (solo per calcolare altezza) */}
                {sheetHeight === 0 ? (
                    <View
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0, // invisibile
                        }}
                        onLayout={(e) => {
                            const h = e.nativeEvent.layout.height;
                            if (h > 0) setSheetHeight(h);
                        }}>
                        <InviteSheetContent
                            inviteCode={inviteCode}
                            isSavingInviteCode={isSavingInviteCode}
                            inviteCodeError={inviteCodeError}
                            clearInviteCodeError={clearInviteCodeError}
                            copyInviteCode={copyInviteCode}
                        />
                    </View>
                ) : null}

                {/* 2) SHEET REALE (solo quando ready) */}
                {isReadyToShowSheet ? (
                    <Animated.View
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transform: [{ translateY: slideY }],
                        }}>
                        <InviteSheetContent
                            inviteCode={inviteCode}
                            isSavingInviteCode={isSavingInviteCode}
                            inviteCodeError={inviteCodeError}
                            clearInviteCodeError={clearInviteCodeError}
                            copyInviteCode={copyInviteCode}
                        />
                    </Animated.View>
                ) : null}
            </Modal>
        </AppShell>
    );
}

function InviteSheetContent(props: { inviteCode: string; isSavingInviteCode: boolean; inviteCodeError: string | null; clearInviteCodeError: () => void; copyInviteCode: () => Promise<void> }) {
    const { inviteCode, isSavingInviteCode, inviteCodeError, clearInviteCodeError, copyInviteCode } = props;

    return (
        <LinearGradient
            colors={["#FFA500", "#F06000"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 24,
            }}>
            <View className="items-center mb-4">
                <View className="w-12 h-1.5 rounded-full bg-white/30" />
            </View>

            <AppText
                weight="medium"
                className="text-xl text-white">
                Codice invito
            </AppText>

            <AppText className="mt-2 text-text-main">Condividi questo codice con chi vuoi invitare a unirsi alla tua famiglia Coesya.</AppText>

            <View className="mt-4 rounded-2xl py-4 items-center">
                <AppText className="text-4xl text-text-main">{inviteCode || "— — — — —"}</AppText>

                {isSavingInviteCode ? (
                    <View className="mt-3 flex-row items-center gap-2">
                        <ActivityIndicator />
                        <AppText className="text-text-main/60">Salvataggio…</AppText>
                    </View>
                ) : null}

                {inviteCodeError ? (
                    <Pressable
                        onPress={clearInviteCodeError}
                        className="mt-3">
                        <AppText className="text-red-300">{inviteCodeError} (tocca per chiudere)</AppText>
                    </Pressable>
                ) : null}
            </View>

            <View className="mt-5 gap-3">
                <Button
                    variant="white"
                    title="Copia codice"
                    onPress={() => void copyInviteCode()}
                    disabled={!inviteCode}
                />
                <Button
                    variant="ghost"
                    title="Condividi codice"
                    onPress={() => {}}
                />
            </View>
        </LinearGradient>
    );
}
