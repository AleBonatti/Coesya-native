import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
    children: ReactNode;
    backgroundClassName?: string;
    contentClassName?: string;
}

export function Screen({ children, backgroundClassName = "bg-auth-bg", contentClassName = "pt-10 pb-6" }: ScreenProps) {
    return (
        <SafeAreaView className={`flex-1 ${backgroundClassName}`}>
            <View className={`flex-1 ${contentClassName}`}>{children}</View>
        </SafeAreaView>
    );
}
