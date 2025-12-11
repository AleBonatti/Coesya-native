import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, Pressable } from "react-native";

type AuthTab = "login" | "register";

export function AuthScreen() {
    const [activeTab, setActiveTab] = useState<AuthTab>("login");

    // stato login
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");

    // stato registrazione (base, poi lo affiniamo)
    const [registerName, setRegisterName] = useState<string>("");
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState<string>("");

    const handleLogin = () => {
        console.log("Login:", { loginEmail, loginPassword });
        // qui più avanti collegheremo lo store auth o backend
    };

    const handleRegister = () => {
        console.log("Register:", {
            registerName,
            registerEmail,
            registerPassword,
            registerPasswordConfirm,
        });
        // qui più avanti collegheremo la logica reale di registrazione
    };

    const renderSocialButtons = () => (
        <View className="mb-6">
            <Pressable
                onPress={() => {
                    console.log("Login con Apple");
                }}
                className="flex-row items-center justify-center bg-white rounded-xl py-3 mb-3">
                {/* Placeholder icona Apple */}
                <View className="w-5 h-5 rounded-full bg-black mr-2" />
                <Text className="text-slate-900 font-semibold">Accedi con Apple</Text>
            </Pressable>

            <Pressable
                onPress={() => {
                    console.log("Login con Google");
                }}
                className="flex-row items-center justify-center bg-white rounded-xl py-3">
                {/* Placeholder icona Google */}
                <View className="w-5 h-5 rounded-sm bg-red-500 mr-2" />
                <Text className="text-slate-900 font-semibold">Accedi con Google</Text>
            </Pressable>
        </View>
    );

    const renderLoginForm = () => (
        <View>
            {renderSocialButtons()}

            <View className="mb-4">
                <Text className="text-sm font-medium text-slate-200 mb-2">Username o email</Text>
                <TextInput
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    placeholder="tuo@email.com"
                    placeholderTextColor="#64748b"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <View className="mb-2">
                <Text className="text-sm font-medium text-slate-200 mb-2">Password</Text>
                <TextInput
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <View className="items-end mb-6">
                <Pressable onPress={() => {}}>
                    <Text className="text-xs text-sky-400">Hai dimenticato la password?</Text>
                </Pressable>
            </View>

            <Pressable
                onPress={handleLogin}
                className="bg-sky-500 rounded-xl py-3.5 items-center justify-center">
                <Text className="text-white font-semibold text-base">Accedi</Text>
            </Pressable>
        </View>
    );

    const renderRegisterForm = () => (
        <View>
            <View className="mb-4">
                <Text className="text-sm font-medium text-slate-200 mb-2">Nome</Text>
                <TextInput
                    value={registerName}
                    onChangeText={setRegisterName}
                    placeholder="Come ti chiami?"
                    placeholderTextColor="#64748b"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-slate-200 mb-2">Email</Text>
                <TextInput
                    value={registerEmail}
                    onChangeText={setRegisterEmail}
                    placeholder="tuo@email.com"
                    placeholderTextColor="#64748b"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-slate-200 mb-2">Password</Text>
                <TextInput
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-slate-200 mb-2">Conferma password</Text>
                <TextInput
                    value={registerPasswordConfirm}
                    onChangeText={setRegisterPasswordConfirm}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
                />
            </View>

            <Pressable
                onPress={handleRegister}
                className="bg-emerald-500 rounded-xl py-3.5 items-center justify-center">
                <Text className="text-white font-semibold text-base">Crea account</Text>
            </Pressable>
        </View>
    );

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-950"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                <View className="flex-1 pt-16 pb-10 bg-auth-bg">
                    {/* Top: logo + testi */}
                    <View className="items-center mb-10 px-6">
                        {/* Logo placeholder: per ora testo, poi ci mettiamo l’SVG */}
                        <Text className="text-3xl font-bold text-white mb-2">Coesya</Text>
                        <Text className="text-xl font-medium mb-1 text-center">Benvenuto in Coesya</Text>
                        <Text className="text-sm text-slate-300 text-center max-w-md">Sei pronto a semplificare la gestione familiare? Accedi o crea un account e scopri come!</Text>
                    </View>

                    {/* Tab: Accedi / Registrati */}
                    <View className="flex-row py-6 rounded-xl p-1">
                        <Pressable
                            onPress={() => setActiveTab("login")}
                            className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === "login" ? "bg-slate-800" : ""}`}>
                            <Text className={`text-sm font-semibold ${activeTab === "login" ? "text-white" : "text-slate-400"}`}>Accedi</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setActiveTab("register")}
                            className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === "register" ? "bg-slate-800" : ""}`}>
                            <Text className={`text-sm font-semibold ${activeTab === "register" ? "text-white" : "text-slate-400"}`}>Registrati</Text>
                        </Pressable>
                    </View>

                    {/* Contenuto tab */}
                    <View className="mt-2 px-6 bg-auth-form">{activeTab === "login" ? renderLoginForm() : renderRegisterForm()}</View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
