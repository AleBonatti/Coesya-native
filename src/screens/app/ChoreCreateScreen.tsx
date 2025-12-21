import React, { useMemo, useState } from "react";
import { Pressable, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppShell } from "../../components/layout/AppShell";
import { AppText } from "../../components/ui/AppText";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox"; // il tuo checkbox con label clickabile
import { useChoresStore } from "../../chores/choreStore";
import { LinkText } from "../../components/ui/LinkText";
import { SelectField, type SelectOption } from "../../components/ui/SelectField";
import type { ChoresStackParamList } from "../../navigation/ChoresStack";
import type { ChoreFrequency } from "../../chores/choreTypes";

type Nav = NativeStackNavigationProp<ChoresStackParamList>;

const frequencies: Array<{ value: ChoreFrequency; label: string }> = [
    { value: "daily", label: "Giornaliera" },
    { value: "weekly", label: "Settimanale" },
    { value: "monthly", label: "Mensile" },
    { value: "semiannual", label: "Semestrale" },
];

const frequencyOptions: ReadonlyArray<SelectOption<ChoreFrequency>> = [
    { value: "daily", label: "Giornaliera" },
    { value: "weekly", label: "Settimanale" },
    { value: "monthly", label: "Mensile" },
    { value: "semiannual", label: "Semestrale" },
];

// per ora categorie stringa libera; se vuoi la renderemo select con icone
type ChoreCategory = "Pulizia" | "Burocrazia" | "Spesa" | "Altro";

const categoryOptions: ReadonlyArray<SelectOption<ChoreCategory>> = [
    { value: "Pulizia", label: "Pulizia" },
    { value: "Burocrazia", label: "Burocrazia" },
    { value: "Spesa", label: "Spesa" },
    { value: "Altro", label: "Altro" },
];

export function ChoreCreateScreen() {
    const navigation = useNavigation<Nav>();

    const isCreating = useChoresStore((s) => s.isCreating);
    const createError = useChoresStore((s) => s.createError);
    const fieldErrors = useChoresStore((s) => s.createFieldErrors);
    const clearFieldError = useChoresStore((s) => s.clearCreateFieldError);
    const clearError = useChoresStore((s) => s.clearCreateError);

    const createChore = useChoresStore((s) => s.createChore);
    const fetchAll = useChoresStore((s) => s.fetchAll);

    const [title, setTitle] = useState<string>("");
    const [frequency, setFrequency] = useState<ChoreFrequency>("weekly");
    const [category, setCategory] = useState<ChoreCategory[number]>("Pulizia");

    const [weight, setWeight] = useState<number>(3);
    const [priority, setPriority] = useState<number>(3);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [alreadyDone, setAlreadyDone] = useState<boolean>(false);

    const canSubmit = useMemo(() => title.trim().length > 0 && !isCreating, [title, isCreating]);

    const handleSave = async () => {
        if (!canSubmit) return;

        try {
            await createChore({
                title: title.trim(),
                frequency,
                category,
                weight,
                priority,
                is_active: isActive,
                completed_current_period: alreadyDone,
            });

            // riallinea lista gestione
            await fetchAll();

            // torna alla gestione
            navigation.goBack();
        } catch {
            // errori già nello store
        }
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
                        <Pressable
                            onPress={() => navigation.goBack()}
                            className="flex-row items-center gap-2 py-2">
                            <Feather
                                name="chevron-left"
                                size={22}
                            />
                            <LinkText
                                variant="dark"
                                weight="medium"
                                onPress={() => navigation.goBack()}
                                className="text-xl font-medium">
                                Elenco impegni
                            </LinkText>
                        </Pressable>
                    </View>

                    <AppText
                        className="text-2xl"
                        weight="semibold">
                        Crea nuovo impegno
                    </AppText>
                    <AppText className="mt-1">Definisci un’attività ricorrente per la famiglia.</AppText>

                    {createError ? (
                        <Pressable
                            onPress={() => clearError()}
                            className="mt-4 rounded-xl bg-red-500/20 px-4 py-3">
                            <AppText weight="semibold">Errore</AppText>
                            <AppText className="text-white/80 mt-1">{createError}</AppText>
                            <AppText className="text-white/60 mt-2">Tocca per chiudere</AppText>
                        </Pressable>
                    ) : null}

                    <View className="mt-6 gap-4">
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
                            value={category}
                            options={categoryOptions}
                            onChange={(v) => {
                                if (fieldErrors.category) clearFieldError("category");
                                setCategory(v);
                            }}
                            error={fieldErrors.category}
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

                        <Checkbox
                            checked={alreadyDone}
                            onChange={setAlreadyDone}
                            label="Ho già svolto questa attività nel periodo corrente"
                        />

                        <View className="mt-2">
                            <Button
                                title="Crea impegno"
                                onPress={handleSave}
                                disabled={!canSubmit}
                                variant="secondary"
                            />
                        </View>
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
                    <Feather
                        name="minus"
                        size={18}
                        color="#FFFFFF"
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
                    <Feather
                        name="plus"
                        size={18}
                        color="#FFFFFF"
                    />
                </Pressable>
            </View>

            <AppText className="text-text-main mt-2">1–5</AppText>
        </View>
    );
}
