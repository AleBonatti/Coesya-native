import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
    children: ReactNode;
    backgroundClassName?: string;
    contentClassName?: string;
}

export function Screen({ children, backgroundClassName = "bg-auth-bg", contentClassName = "" }: ScreenProps) {
    return (
        <SafeAreaView className={`flex-1 w-full ${backgroundClassName}`}>
            <View className={`flex-1 w-full ${contentClassName}`}>{children}</View>
        </SafeAreaView>
    );
}
