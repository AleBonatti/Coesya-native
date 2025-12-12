import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "coesya_token";

function canUseLocalStorage(): boolean {
    try {
        return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    } catch {
        return false;
    }
}

export async function getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        if (!canUseLocalStorage()) return null;
        return window.localStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
        if (!canUseLocalStorage()) return;
        window.localStorage.setItem(TOKEN_KEY, token);
        return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
    if (Platform.OS === "web") {
        if (!canUseLocalStorage()) return;
        window.localStorage.removeItem(TOKEN_KEY);
        return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}
