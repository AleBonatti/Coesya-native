import React from "react";
import { View, Image } from "react-native";
import { AppText } from "./AppText";

interface AvatarProps {
    uri?: string | null;
    name?: string; // es: "Ghiratti 2" o "Alessandro Bonatti"
    size?: number; // px (default 128)
    backgroundColor?: string;
}

function getInitials(name?: string): string {
    if (!name) return "?";

    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";

    return (parts[0][0] ?? "").toUpperCase() + (parts[1][0] ?? "").toUpperCase();
}

export function Avatar({
    uri,
    name,
    size = 128,
    backgroundColor = "#FFA500", // gray-200
}: AvatarProps) {
    const initials = getInitials(name);

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor,
            }}>
            {uri ? (
                <Image
                    source={{ uri }}
                    resizeMode="cover"
                    style={{ width: size, height: size }}
                />
            ) : (
                <AppText
                    weight="semibold"
                    className="text-3xl text-white">
                    {initials}
                </AppText>
            )}
        </View>
    );
}
