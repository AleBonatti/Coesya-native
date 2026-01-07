import React, { useEffect, useMemo, useRef } from "react";
import { View, Animated, Pressable } from "react-native";
import { Avatar } from "../components/ui/Avatar";
import { AppText } from "../components/ui/AppText";
import { AppIcon } from "../components/ui/AppIcon";
import type { FamilyMember } from "./familyTypes";

interface UserPillProps {
    member: FamilyMember;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onRemove: () => void;
    isRemoving: boolean;
}

export function UserPill({ member, isOpen, onToggle, onClose, onRemove, isRemoving }: UserPillProps) {
    // progress 0..1: 0 overlay fuori, 1 overlay visibile
    const progress = useRef(new Animated.Value(0)).current;

    // overlay width
    const OVERLAY_W = 170;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: isOpen ? 1 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [isOpen, progress]);

    const overlayTranslateX = useMemo(() => {
        // da +OVERLAY_W (fuori a destra) a 0 (in posizione)
        return progress.interpolate({
            inputRange: [0, 1],
            outputRange: [OVERLAY_W, 0],
        });
    }, [progress]);

    const handlePillPress = () => {
        if (isRemoving) return;
        onToggle();
    };

    const handleRemove = () => {
        if (isRemoving) return;
        onClose();
        onRemove();
    };

    return (
        <View className="border-b border-auth-form overflow-hidden">
            {/* MAIN TAP AREA */}
            <Pressable
                onPress={handlePillPress}
                className="px-6 py-3"
                accessibilityRole="button"
                accessibilityLabel="Azioni membro">
                <View className="flex-row items-center gap-3">
                    <Avatar
                        uri={member.profile_photo_url ?? undefined}
                        name={`${member.firstname} ${member.lastname}`}
                        size={40}
                    />
                    <View className="flex-1">
                        <AppText
                            weight="medium"
                            className="text-text-main">
                            {`${member.firstname} ${member.lastname}`}
                        </AppText>
                        {member.nickname ? (
                            <View className="flex-row flex-wrap gap-1 items-center">
                                <AppIcon
                                    name="information-circle-outline"
                                    color="#868686"
                                />
                                <AppText
                                    variant="placeholder"
                                    className="text-xs"
                                    weight="medium">
                                    {member.nickname}
                                </AppText>
                            </View>
                        ) : null}
                    </View>
                </View>
            </Pressable>

            {/* OVERLAY AZIONI (entra da destra) */}
            <Animated.View
                pointerEvents={isOpen ? "auto" : "none"}
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: OVERLAY_W,
                    transform: [{ translateX: overlayTranslateX }],
                }}>
                <View className="flex-1 bg-brand-primary">
                    <Pressable
                        onPress={handleRemove}
                        disabled={isRemoving}
                        className="flex-1 items-center justify-center active:opacity-90"
                        accessibilityRole="button"
                        accessibilityLabel="Rimuovi membro">
                        <AppText className="text-white">{isRemoving ? "Rimozione..." : "Rimuovi membro"}</AppText>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}
