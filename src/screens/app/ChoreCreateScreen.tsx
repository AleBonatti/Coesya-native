import React, { useMemo, useState, useEffect } from "react";
import { Pressable, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useCategoryStore } from "../../categories/categoryStore";
import type { Chore } from "../../chores/choreTypes";
import type { ChoresStackParamList } from "../../navigation/ChoresStack";
import type { ChoreFrequency } from "../../chores/choreTypes";

import { AppShell } from "../../components/layout/AppShell";
import { AppIcon } from "../../components/ui/AppIcon";
import { AppText } from "../../components/ui/AppText";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox"; // il tuo checkbox con label clickabile
import { useChoresStore } from "../../chores/choreStore";
import { LinkText } from "../../components/ui/LinkText";
import { SelectField, type SelectOption } from "../../components/ui/SelectField";

type Nav = NativeStackNavigationProp<ChoresStackParamList>;
type Route = RouteProp<ChoresStackParamList, "ChoreCreate">;

const frequencyOptions: ReadonlyArray<SelectOption<ChoreFrequency>> = [
    { value: "daily", label: "Giornaliera" },
    { value: "weekly", label: "Settimanale" },
    { value: "monthly", label: "Mensile" },
    { value: "semiannual", label: "Semestrale" },
];

const confirmDelete = (onConfirm: () => void) => {
    if (Platform.OS === "web") {
        // eslint-disable-next-line no-alert
        const ok = window.confirm("Eliminare impegno? Questa azione è definitiva.");
        if (ok) onConfirm();
        return;
    }

    Alert.alert("Eliminare impegno?", "Questa azione è definitiva. Vuoi procedere?", [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", style: "destructive", onPress: onConfirm },
    ]);
};

export function ChoreCreateScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();

    const choreId = route.params?.choreId;
    const isEdit = typeof choreId === "number";

    const isCreating = useChoresStore((s) => s.isCreating);
    const createError = useChoresStore((s) => s.createError);
    const fieldErrors = useChoresStore((s) => s.createFieldErrors);
    const clearFieldError = useChoresStore((s) => s.clearCreateFieldError);
    const clearError = useChoresStore((s) => s.clearCreateError);

    const createChore = useChoresStore((s) => s.createChore);
    const allChores = useChoresStore((s) => s.allChores);
    const fetchAll = useChoresStore((s) => s.fetchAll);

    const deleteChore = useChoresStore((s) => s.deleteChore);
    const isDeleting = useChoresStore((s) => s.isDeleting);
    const deleteError = useChoresStore((s) => s.deleteError);
    const clearDeleteError = useChoresStore((s) => s.clearDeleteError);

    const choreToEdit = useMemo<Chore | undefined>(() => {
        if (!isEdit) return undefined;
        return allChores.find((c) => c.id === choreId);
    }, [allChores, choreId, isEdit]);

    const [title, setTitle] = useState<string>("");
    const [frequency, setFrequency] = useState<ChoreFrequency>("weekly");

    const fetchCategories = useCategoryStore((s) => s.fetchCategories);
    const categories = useCategoryStore((s) => s.categories);
    const catLoading = useCategoryStore((s) => s.isLoading);

    const activeCategories = useMemo(() => categories.filter((c) => c.active === 1), [categories]);

    const categoryOptions = useMemo(() => activeCategories.map((c) => ({ value: c.id, label: c.title })), [activeCategories]);

    const [categoryId, setCategoryId] = useState<number | null>(null);

    useEffect(() => {
        if (categories.length === 0) void fetchCategories();
    }, [fetchCategories, categories.length]);

    // quando arrivano categorie, set default se manca
    useEffect(() => {
        if (categoryId !== null) return;
        if (categoryOptions.length > 0) setCategoryId(categoryOptions[0].value);
    }, [categoryId, categoryOptions]);

    useEffect(() => {
        if (!isEdit) return;

        // ✅ carica solo se non ho già una lista
        if (allChores.length === 0) {
            void fetchAll();
        }
    }, [isEdit, allChores.length, fetchAll]);

    const [weight, setWeight] = useState<number>(3);
    const [priority, setPriority] = useState<number>(3);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [alreadyDone, setAlreadyDone] = useState<boolean>(false);

    useEffect(() => {
        if (!isEdit || !choreToEdit) return;

        setTitle(choreToEdit.title);
        setFrequency(choreToEdit.frequency);
        setCategoryId(choreToEdit.category_id);
        setWeight(choreToEdit.weight);
        setPriority(choreToEdit.priority);
        setIsActive(choreToEdit.is_active);
        setAlreadyDone(false); // in edit: di default no (o puoi anche nasconderlo)
    }, [isEdit, choreToEdit]);

    const updateChore = useChoresStore((s) => s.updateChore);

    const canSubmit = useMemo(() => {
        return title.trim().length > 0 && categoryId !== null && !isCreating;
    }, [title, categoryId, isCreating]);

    const handleSave = async () => {
        if (!canSubmit) return;

        const payload = {
            title: title.trim(),
            frequency,
            category_id: categoryId!,
            weight,
            priority,
            is_active: isActive,
            completed_current_period: alreadyDone,
        };

        try {
            if (isEdit && choreId) {
                await updateChore(choreId, payload);
            } else {
                await createChore(payload);
                // se con la patch precedente createChore già aggiorna store+fetchActive, questo fetchAll qui puoi anche rimuoverlo.
                await fetchAll();
            }

            // torna alla gestione
            navigation.goBack();
        } catch {
            // errori già nello store
        }
    };

    const handleDelete = () => {
        if (!isEdit || !choreId) return;

        confirmDelete(async () => {
            try {
                await deleteChore(choreId);
                navigation.goBack();
            } catch {
                // errori già nello store
            }
        });
    };

    return (
        <AppShell showHeader={false}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
                    keyboardShouldPersistTaps="handled">
                    <View className="flex-row items-center justify-between pt-2 mb-4">
                        <Pressable className="flex-row items-center gap-2 py-2">
                            <AppIcon
                                name="chevron-back"
                                size={22}
                                color="#121212"
                            />
                            <LinkText
                                onPress={() => navigation.goBack()}
                                variant="dark"
                                weight="medium"
                                className="text-xl font-medium">
                                Elenco impegni
                            </LinkText>
                        </Pressable>
                    </View>

                    {createError ? (
                        <Pressable
                            onPress={() => clearError()}
                            className="mt-4 rounded-xl bg-red-500/20 px-4 py-3">
                            <AppText weight="semibold">Errore</AppText>
                            <AppText className="text-white/80 mt-1">{createError}</AppText>
                            <AppText className="text-white/60 mt-2">Tocca per chiudere</AppText>
                        </Pressable>
                    ) : null}

                    <View className="gap-4">
                        <TextField
                            label="Titolo"
                            placeholder="Es. Lavare pavimento"
                            variant="dark"
                            value={title}
                            onChangeText={(v) => {
                                if (fieldErrors.title) clearFieldError("title");
                                setTitle(v);
                            }}
                            error={fieldErrors.title}
                        />
                        {/* Frequenza: per ora “segmented” semplice */}
                        <SelectField
                            label="Frequenza"
                            value={frequency}
                            options={frequencyOptions}
                            onChange={(v) => {
                                if (fieldErrors.frequency) clearFieldError("frequency");
                                setFrequency(v);
                            }}
                            error={fieldErrors.frequency}
                        />
                        <SelectField
                            label="Categoria"
                            value={categoryId ?? categoryOptions[0]?.value ?? 0}
                            options={categoryOptions}
                            onChange={(v) => setCategoryId(v)}
                            placeholder={catLoading ? "Caricamento…" : "Seleziona…"}
                        />
                        {/* Weight/Priority (stepper semplice) */}
                        <View className="flex-row gap-3">
                            <Stepper
                                label="Peso"
                                value={weight}
                                onChange={(v) => {
                                    if (fieldErrors.weight) clearFieldError("weight");
                                    setWeight(v);
                                }}
                            />
                            <Stepper
                                label="Priorità"
                                value={priority}
                                onChange={(v) => {
                                    if (fieldErrors.priority) clearFieldError("priority");
                                    setPriority(v);
                                }}
                            />
                        </View>
                        {/* Toggles */}
                        <Checkbox
                            checked={isActive}
                            onChange={setIsActive}
                            label="Impegno attivo"
                        />
                        {!isEdit ? (
                            <Checkbox
                                checked={alreadyDone}
                                onChange={setAlreadyDone}
                                label="Ho già svolto questa attività nel periodo corrente"
                            />
                        ) : null}
                        <View className="mt-2">
                            <Button
                                title={isEdit ? "Salva modifiche" : "Crea impegno"}
                                onPress={handleSave}
                                disabled={!canSubmit}
                                variant="secondary"
                            />
                        </View>

                        {isEdit ? (
                            <View>
                                <Button
                                    title={isDeleting ? "Eliminazione..." : "Elimina impegno"}
                                    onPress={handleDelete}
                                    disabled={isDeleting || isCreating}
                                    variant="danger" // se non esiste, usa dark + text red o tertiary
                                />
                            </View>
                        ) : null}

                        {deleteError ? (
                            <Pressable
                                onPress={() => clearDeleteError()}
                                className="mt-4 rounded-xl bg-red-500/20 px-4 py-3">
                                <AppText weight="semibold">Errore eliminazione</AppText>
                                <AppText className="text-white/80 mt-1">{deleteError}</AppText>
                                <AppText className="text-white/60 mt-2">Tocca per chiudere</AppText>
                            </Pressable>
                        ) : null}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppShell>
    );
}

function Stepper(props: { label: string; value: number; onChange: (value: number) => void }) {
    const { label, value, onChange } = props;

    const dec = () => onChange(Math.max(1, value - 1));
    const inc = () => onChange(Math.min(5, value + 1));

    return (
        <View className="flex-1">
            <AppText
                variant="placeholder"
                className="text-base">
                {label}
            </AppText>

            <View className="flex-row items-center justify-between mt-3">
                <Pressable
                    onPress={dec}
                    className="w-10 h-10 rounded-xl bg-black/15 items-center justify-center active:bg-white/25">
                    <AppIcon
                        name="remove"
                        size={18}
                        color="#121212"
                    />
                </Pressable>

                <AppText
                    className="text-xl"
                    weight="bold">
                    {value}
                </AppText>

                <Pressable
                    onPress={inc}
                    className="w-10 h-10 rounded-xl bg-black/15 items-center justify-center active:bg-white/25">
                    <AppIcon
                        name="add"
                        size={18}
                        color="#121212"
                    />
                </Pressable>
            </View>

            <AppText className="text-text-main mt-2">1–5</AppText>
        </View>
    );
}
