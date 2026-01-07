import React, { useRef } from "react";
import { View, TextInput, Pressable } from "react-native";

interface CodeInputProps {
    length: number;
    value: string;
    onChange: (code: string) => void;
    disabled?: boolean;
}

export function CodeInput({ length, value, onChange, disabled = false }: CodeInputProps) {
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChangeText = (text: string, index: number) => {
        // Solo caratteri alfanumerici maiuscoli
        const sanitized = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

        if (sanitized.length === 0) {
            // Backspace - rimuovi carattere corrente
            const newValue = value.split("");
            newValue[index] = "";
            onChange(newValue.join(""));

            // Focus sul campo precedente
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            return;
        }

        // Prendi solo il primo carattere
        const char = sanitized[0];
        const newValue = value.split("");
        newValue[index] = char;
        onChange(newValue.join(""));

        // Focus automatico sul prossimo campo
        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
            // Se campo vuoto e backspace, vai al precedente
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePress = (index: number) => {
        if (!disabled) {
            inputRefs.current[index]?.focus();
        }
    };

    return (
        <View className="flex-row justify-between">
            {Array.from({ length }).map((_, index) => {
                return (
                    <Pressable
                        key={index}
                        onPress={() => handlePress(index)}>
                        <View className="w-14 h-14 rounded-xl overflow-hidden">
                            <TextInput
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                value={value[index] || ""}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                maxLength={1}
                                selectTextOnFocus
                                keyboardType="default"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                editable={!disabled}
                                className="w-full h-full bg-auth-form text-center text-2xl font-sansMedium"
                            />
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}
