import React from "react";
import { View, Image } from "react-native";
import { AppText } from "../ui/AppText";

const logo = require("../../../assets/logo/logo-coesya.png");

interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export function AuthHeader({ className = "" }: AuthHeaderProps) {
    return (
        <View className={`items-center mb-10 px-8 ${className}`}>
            <Image
                source={logo}
                resizeMode="contain"
                className="w-28 h-28 mb-4"
            />

            <AppText
                className="text-xl font-medium my-4 text-center text-text-main"
                variant="dark"
                weight="medium">
                Benvenuto in Coesya
            </AppText>

            <AppText
                variant="dark"
                className="text-sm text-center max-w-md">
                Sei pronto a semplificare la gestione familiare?
            </AppText>

            <AppText
                variant="dark"
                className="text-sm text-center max-w-md">
                Accedi o crea un account e scopri come!
            </AppText>
        </View>
    );
}
