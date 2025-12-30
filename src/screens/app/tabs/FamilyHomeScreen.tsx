import React, { useEffect } from "react";
import { View, Pressable, Image } from "react-native";
import { AppShell } from "../../../components/layout/AppShell";
import { AppText } from "../../../components/ui/AppText";
import { useAuthStore } from "../../../auth/authStore";
import { getCurrentFamily, hasAnyFamily } from "../../../auth/authSelectors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type MainStackParamList } from "../../../navigation/MainStackParamList";
import { LinkText } from "../../../components/ui/LinkText";
import { AppIcon, type AppIconName } from "../../../components/ui/AppIcon";
import { Avatar } from "../../../components/ui/Avatar";
import { IconButton } from "../../../components/ui/IconButton";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function FamilyHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const navigation = useNavigation<Nav>();

    const family = getCurrentFamily(user);
    const fallback = require("../../../../assets/logo/logo-coesya-transparent.png");

    // Edge case: per qualche motivo siamo qui senza famiglie
    useEffect(() => {
        if (!hasAnyFamily(user)) {
            navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
        }
    }, [user?.families?.length, navigation]);

    return (
        <AppShell>
            <View className="pt-6 gap-2">
                {family ? (
                    <>
                        <View className="w-full flex-row items-center justify-between">
                            <Avatar
                                uri={family.profile_photo_url}
                                name={family.name}
                                size={70}
                            />

                            <AppText
                                className="text-xl"
                                weight="medium">
                                {family.name}
                            </AppText>

                            <IconButton
                                icon="arrow-forward"
                                onPress={() => {}}
                                bgClass="bg-brand-primary"
                                color="#FFFFFF"
                                wClass="w-8"
                                hClass="h-8"
                            />
                            {/* </Pressable> */}
                        </View>

                        <View className="bg-auth-form rounded-xl p-5 mt-10">
                            <AppText>La tua famiglia non ha ancora impegni da completare. Sii il primo a dare inizio a momenti di collaborazione!</AppText>

                            <LinkText
                                onPress={() => {
                                    navigation.navigate("FamilyTabs", {
                                        screen: "Chores",
                                    });
                                }}
                                className="mt-10">
                                Clicca qui per creare il tuo primo impegno familiare.
                            </LinkText>
                        </View>
                    </>
                ) : (
                    <AppText>Nessuna famiglia attiva trovata.</AppText>
                )}
            </View>
        </AppShell>
    );
}
