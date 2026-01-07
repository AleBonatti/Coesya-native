import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { useNotificationStore } from "./notificationStore";

export function NotificationHost() {
    const insets = useSafeAreaInsets();
    const current = useNotificationStore((s) => s.current);
    const hide = useNotificationStore((s) => s.hide);

    const y = useRef(new Animated.Value(-30)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!current) return;

        y.setValue(-30);
        opacity.setValue(0);

        Animated.parallel([Animated.timing(y, { toValue: 0, duration: 180, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true })]).start();
    }, [current, y, opacity]);

    if (!current) return null;

    const bg = current.type === "success" ? "bg-brand-accent" : current.type === "error" ? "bg-red-500" : "bg-white";

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: insets.top + 10,
                alignItems: "center",
                zIndex: 9999,
            }}>
            <Animated.View style={{ transform: [{ translateY: y }], opacity }}>
                <Pressable
                    onPress={hide}
                    className={`mx-4 rounded-2xl px-4 py-3 ${bg}`}
                    style={{ minWidth: 280, maxWidth: 420 }}>
                    <AppText
                        weight="semibold"
                        className="text-white">
                        {current.title}
                    </AppText>
                    {current.message ? <AppText className="text-white mt-1">{current.message}</AppText> : null}
                </Pressable>
            </Animated.View>
        </View>
    );
}
