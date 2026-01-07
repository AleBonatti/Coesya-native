import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppIcon } from "./AppIcon";
import { LinkText } from "./LinkText";

interface SectionTitleProps {
    label: string;
    variant?: "light" | "dark";
    onPress?: () => void;
}

export function SectionTitle({ label, variant = "dark", onPress }: SectionTitleProps) {
    const navigation = useNavigation();

    const iconColor = variant === "dark" ? "#121212" : "#FFFFFF";
    const linkVariant = variant === "dark" ? "dark" : "secondary";

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View className="flex-row items-center mb-6 mt-4 gap-3">
            <AppIcon
                name="chevron-back"
                size={24}
                color={iconColor}
            />
            <LinkText
                variant={linkVariant}
                weight="medium"
                onPress={handlePress}
                className="text-xl font-medium">
                {label}
            </LinkText>
        </View>
    );
}
