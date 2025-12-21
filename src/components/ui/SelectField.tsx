import React, { useMemo, useState } from "react";
import { Modal, Pressable, View, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "./AppText";

export type SelectOption<T extends string> = {
    value: T;
    label: string;
};

type SelectFieldProps<T extends string> = {
    label: string;
    value: T;
    options: ReadonlyArray<SelectOption<T>>;
    onChange: (next: T) => void;

    placeholder?: string;
    error?: string;
};

export function SelectField<T extends string>({ label, value, options, onChange, placeholder = "Seleziona…", error }: SelectFieldProps<T>) {
    const [open, setOpen] = useState(false);

    const selectedLabel = useMemo(() => {
        const found = options.find((o) => o.value === value);
        return found?.label ?? "";
    }, [options, value]);

    return (
        <View className="mb-4">
            <AppText
                variant="placeholder"
                className="text-base mb-2">
                {label}
            </AppText>

            <Pressable
                onPress={() => setOpen(true)}
                className={`rounded-xl px-4 py-4 flex-row items-center justify-between bg-auth-form ${error ? "border border-red-500" : "border border-transparent"}`}
                accessibilityRole="button"
                accessibilityLabel={label}>
                <AppText className={selectedLabel ? "text-base" : "text-base text-white/60"}>{selectedLabel || placeholder}</AppText>

                <Feather
                    name="chevron-down"
                    size={18}
                    color="#121212"
                />
            </Pressable>

            {error ? <AppText className="text-red-200 mt-2">{error}</AppText> : null}

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}>
                {/* backdrop */}
                <Pressable
                    className="flex-1 bg-black/50"
                    onPress={() => setOpen(false)}
                />

                {/* sheet */}
                <View className="absolute left-6 right-6 bottom-8 rounded-3xl bg-auth-form overflow-hidden">
                    <View className="px-5 py-4 flex-row items-center justify-between">
                        <AppText
                            className="text-lg text-black"
                            weight="semibold">
                            {label}
                        </AppText>
                        <Pressable
                            onPress={() => setOpen(false)}
                            accessibilityRole="button">
                            <Feather
                                name="x"
                                size={20}
                                color="#111"
                            />
                        </Pressable>
                    </View>

                    <View className="h-px bg-black/10" />

                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => {
                            const isSelected = item.value === value;
                            return (
                                <Pressable
                                    onPress={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                    className={`px-5 py-4 flex-row items-center justify-between ${isSelected ? "bg-black/5" : ""}`}
                                    accessibilityRole="button">
                                    <AppText
                                        className="text-black"
                                        weight={isSelected ? "semibold" : "regular"}>
                                        {item.label}
                                    </AppText>
                                    {isSelected ? (
                                        <Feather
                                            name="check"
                                            size={18}
                                            color="#111"
                                        />
                                    ) : null}
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}
