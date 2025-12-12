import React from "react";
import { View, Text, Image } from "react-native";

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

            <Text className="text-xl font-medium my-4 text-center text-text-main">Benvenuto in Coesya</Text>

            <Text className="text-sm text-text-main text-center max-w-md">Sei pronto a semplificare la gestione familiare?</Text>
            <Text className="text-sm text-text-main text-center max-w-md">Accedi o crea un account e scopri come!</Text>
        </View>
    );
}
