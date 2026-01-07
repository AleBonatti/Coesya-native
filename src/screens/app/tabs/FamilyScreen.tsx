import React, { useEffect, useRef, useState } from "react";
import { Modal, Animated, View, ImageBackground, ScrollView, ActivityIndicator, Pressable, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useDebounce } from "../../../hooks/useDebounce";
import * as ImagePicker from "expo-image-picker";
import { AppShell } from "../../../components/layout/AppShell";
import { useNotificationStore } from "../../../components/notifications/notificationStore";
import { useAuthStore } from "../../../auth/authStore";
import { useFamilyStore } from "../../../family/familyStore";
import { getCurrentFamily } from "../../../auth/authSelectors";
import { TextField } from "../../../components/ui/TextField";
import { IconButton } from "../../../components/ui/IconButton";
import { Button } from "../../../components/ui/Button";
import { AppText } from "../../../components/ui/AppText";
import { UserPill } from "../../../family/UserPill";

const confirmRemoveMember = (memberName: string, onConfirm: () => void) => {
    if (Platform.OS === "web") {
        const ok = window.confirm(`Rimuovere ${memberName} dalla famiglia? Questa azione è definitiva.`);
        if (ok) onConfirm();
        return;
    }

    Alert.alert("Rimuovere membro?", `Vuoi rimuovere ${memberName} dalla famiglia? Questa azione è definitiva.`, [
        { text: "Annulla", style: "cancel" },
        { text: "Rimuovi", style: "destructive", onPress: onConfirm },
    ]);
};

export function FamilyScreen() {
    const notify = useNotificationStore((s) => s.show);
    const user = useAuthStore((s) => s.user);
    const family = getCurrentFamily(user);
    const familyId = family?.id;

    const refreshMe = useAuthStore((s) => s.refreshMe);

    const updateFamily = useFamilyStore((s) => s.updateFamily);
    const fieldErrors = useFamilyStore((s) => s.fieldErrors);
    // stato form
    const [name, setName] = useState<string>(family?.name ?? "");
    const [slug, setSlug] = useState<string>(family?.slug ?? "");

    const [showNameSpinner, setShowNameSpinner] = useState(false);

    const uploadFamilyPhoto = useFamilyStore((s) => s.uploadFamilyPhoto);
    const isUploadingPhoto = useFamilyStore((s) => s.isUploadingPhoto);

    const members = useFamilyStore((s) => s.members);
    const isLoadingMembers = useFamilyStore((s) => s.isLoadingMembers);
    const membersError = useFamilyStore((s) => s.membersError);
    const fetchMembers = useFamilyStore((s) => s.fetchMembers);
    const clearMembersError = useFamilyStore((s) => s.clearMembersError);
    const removeMember = useFamilyStore((s) => s.removeMember);
    const removingMemberId = useFamilyStore((s) => s.removingMemberId);

    // state for open member pill
    const [openMemberId, setOpenMemberId] = useState<number | null>(null);

    // layer codice
    const [isReadyToShowSheet, setIsReadyToShowSheet] = useState(false);
    const didAnimateOpenRef = useRef(false);
    const [sheetHeight, setSheetHeight] = useState(0);
    const [inviteOpen, setInviteOpen] = useState(false);
    const slideY = useRef(new Animated.Value(0)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const saveInviteCode = useFamilyStore((s) => s.saveInviteCode);

    const [sharing, setSharing] = useState(false);
    const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openInvite = () => {
        if (!familyId) return;

        clearShareTimer();
        setSharing(false);

        // ... il tuo gating sheet
        setSheetHeight(0);
        setIsReadyToShowSheet(false);
        didAnimateOpenRef.current = false;
        setInviteOpen(true);
    };

    const closeInvite = () => {
        const endY = sheetHeight > 0 ? sheetHeight : 300;

        clearShareTimer();
        setSharing(false);

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

    const clearShareTimer = () => {
        if (shareTimerRef.current) {
            clearTimeout(shareTimerRef.current);
            shareTimerRef.current = null;
        }
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

    // close all member pills when members list changes
    useEffect(() => {
        setOpenMemberId(null);
    }, [members.length]);

    const copyInviteCode = async () => {
        if (!family?.code) return;
        await Clipboard.setStringAsync(family.code);
        // opzionale: toast/snackbar in futuro
        notify({
            type: "success",
            title: "Copiato",
            message: "Codice copiato negli appunti.",
        });
    };

    const handleShareInviteCode = () => {
        if (!familyId || sharing) return;

        clearShareTimer();
        setSharing(true);

        shareTimerRef.current = setTimeout(() => {
            void (async () => {
                try {
                    await saveInviteCode(familyId);

                    // qui notifichi successo (toast/snackbar)
                    notify({
                        type: "success",
                        title: "Codice salvato",
                        message: `Codice famiglia inviato con successo.`,
                    });
                } catch {
                    notify({
                        type: "error",
                        title: "Errore",
                        message: "Non è stato possibile inviare il codice. Riprova.",
                    });
                } finally {
                    setSharing(false);
                    shareTimerRef.current = null;
                }
            })();
        }, 650);
    };

    const handleRemoveMember = (userId: number, memberName: string) => {
        if (!familyId) return;

        confirmRemoveMember(memberName, async () => {
            try {
                await removeMember(familyId, userId);
                notify({
                    type: "success",
                    title: "Membro rimosso",
                    message: "Il membro è stato rimosso dalla famiglia.",
                });
            } catch {
                notify({
                    type: "error",
                    title: "Errore",
                    message: "Non è stato possibile rimuovere il membro. Riprova.",
                });
            }
        });
    };

    // sync quando cambia family (es. refreshMe)
    useEffect(() => {
        if (!family) return;
        setName(family.name);
        setSlug(family.slug);
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
        void (async () => {
            try {
                lastSentNameRef.current = trimmed;

                const updated = await updateFamily(familyId, { name: trimmed });

                if (seq !== requestSeqRef.current) return;

                setSlug(updated.slug);
                await refreshMe();
            } finally {
                setShowNameSpinner(false);
            }
        })();
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

    useEffect(() => {
        return () => {
            if (shareTimerRef.current) {
                clearTimeout(shareTimerRef.current);
                shareTimerRef.current = null;
            }
        };
    }, []);

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
                        contentContainerStyle={{ paddingBottom: 110 }}
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
                                label="Codice vicina"
                                value={`#${slug}`}
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
                                        <UserPill
                                            key={m.id}
                                            member={m}
                                            isOpen={openMemberId === m.id}
                                            onToggle={() => setOpenMemberId((prev) => (prev === m.id ? null : m.id))}
                                            onClose={() => setOpenMemberId(null)}
                                            onRemove={() => handleRemoveMember(m.id, `${m.firstname} ${m.lastname}`)}
                                            isRemoving={removingMemberId === m.id}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                        {/* ✅ PULSANTE CONDIVISIONE CODICE */}
                        <View className="px-6">
                            <Button
                                variant="tertiary"
                                size="sm"
                                title="Mostra codice invito"
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
                            inviteCode={family?.code}
                            copyInviteCode={copyInviteCode}
                            shareInviteCode={handleShareInviteCode}
                            sharing={sharing}
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
                            inviteCode={family?.code}
                            copyInviteCode={copyInviteCode}
                            shareInviteCode={handleShareInviteCode}
                            sharing={sharing}
                        />
                    </Animated.View>
                ) : null}
            </Modal>
        </AppShell>
    );
}

function InviteSheetContent(props: { inviteCode: string | undefined; copyInviteCode: () => Promise<void>; shareInviteCode: () => void; sharing: boolean }) {
    const { inviteCode, copyInviteCode, shareInviteCode, sharing } = props;

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
            </View>

            <View className="mt-5 gap-3">
                <Button
                    variant="white"
                    title="Copia codice"
                    onPress={() => void copyInviteCode()}
                    disabled={!inviteCode || sharing}
                />
                <Button
                    variant="ghost"
                    title={sharing ? "Salvataggio…" : "Condividi codice"}
                    onPress={shareInviteCode}
                    disabled={!inviteCode || sharing}
                />
            </View>
        </LinearGradient>
    );
}
