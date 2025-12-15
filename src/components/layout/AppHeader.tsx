import React from "react";
import { Image, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import type { AppStackParamList } from "../../navigation/AppNavigator";

const logo = require("../../../assets/logo/logo-coesya-transparent.png");

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function AppHeader() {
    const navigation = useNavigation<Nav>();

    return (
        <View className="w-full flex-row px-6 pt-4 items-center justify-between">
            <Image
                source={logo}
                resizeMode="contain"
                className="w-8 h-8"
            />

            <Pressable
                onPress={() => navigation.navigate("Settings")}
                className="p-2"
                accessibilityRole="button"
                accessibilityLabel="Impostazioni">
                <Feather
                    name="settings"
                    size={22}
                    color="#FFFFFF"
                />
            </Pressable>
        </View>
    );
}
