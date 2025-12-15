import React from "react";
import { Pressable, Text, View, type GestureResponderEvent } from "react-native";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxProps {
    checked: boolean;
    onChange: (next: boolean) => void;

    /** Usa una di queste due */
    label?: string;
    labelNode?: React.ReactNode;

    size?: CheckboxSize;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    error?: string;
}

export function Checkbox({ checked, onChange, label, labelNode, size = "md", disabled = false, className = "", labelClassName = "", error }: CheckboxProps) {
    const boxSizeClass: Record<CheckboxSize, string> = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const labelSizeClass: Record<CheckboxSize, string> = {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
    };

    const boxBase = "rounded-md border border-[1px] items-center justify-center";
    const boxState = checked ? "bg-brand-primary border-brand-primary" : "bg-transparent border-text-light";

    const opacity = disabled ? "opacity-50" : "";

    const handleToggle = () => {
        if (disabled) return;
        onChange(!checked);
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={handleToggle}
            className={`flex-row items-center ${opacity} ${className}`}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}>
            <View className={`${boxBase} ${boxSizeClass[size]} ${boxState}`}>{checked ? <View className="w-2.5 h-2.5 bg-white rounded-sm" /> : null}</View>

            <View className="ml-3 flex-1">
                {labelNode ? (
                    // ✅ label “rich”: deve essere un <Text> con eventuali <Text> annidati
                    labelNode
                ) : (
                    <Text className={`text-text-main ${labelSizeClass[size]} ${labelClassName}`}>{label ?? ""}</Text>
                )}
                {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
            </View>
        </Pressable>
    );
}

/**
 * Piccolo helper opzionale per link inline dentro una frase.
 * Usa <Text> (non Pressable) così resta inline e centrabile.
 */
interface InlineLinkProps {
    children: string;
    onPress: () => void;
    className?: string;
    disabled?: boolean;
}

export function InlineLink({ children, onPress, className = "text-brand-primary underline", disabled = false }: InlineLinkProps) {
    const handlePress = (e?: GestureResponderEvent) => {
        // evita che il tap sul link toggli anche la checkbox (soprattutto su web)
        e?.stopPropagation?.();
        if (!disabled) onPress();
    };

    return (
        <Text
            onPress={handlePress}
            className={`${className} ${disabled ? "opacity-50" : ""}`}
            accessibilityRole="link">
            {children}
        </Text>
    );
}
