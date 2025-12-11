import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { Screen } from "../../components/layout/Screen";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { LinkText } from "../../components/ui/LinkText";

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

            <TextField
                size="md"
                label="Username o email"
                value={loginEmail}
                onChangeText={setLoginEmail}
                placeholder="tuo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextField
                size="md"
                label="Password"
                secureTextEntry
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholder="••••••••"
            />

            <View className="mb-6">
                <LinkText onPress={() => {}}>Password dimenticata?</LinkText>
            </View>

            <Button
                onPress={handleLogin}
                title="Accedi"
            />

            <Text className="text-center text-sm mt-4 font-medium text-text-main">Accedendo, accetti la nostra Informativa sulla Privacy</Text>
        </View>
    );

    const renderRegisterForm = () => (
        <View>
            <TextField
                size="md"
                label="Nome"
                value={registerName}
                onChangeText={setRegisterName}
                placeholder="il tuo nome"
            />

            <TextField
                size="md"
                label="Cognome"
                value={registerName}
                onChangeText={setRegisterName}
                placeholder="il tuo cognome"
            />

            <TextField
                size="md"
                label="Email"
                value={registerEmail}
                onChangeText={setRegisterEmail}
                placeholder="insersici la tua email"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextField
                size="md"
                label="Password"
                value={registerPassword}
                onChangeText={setRegisterPassword}
                placeholder="inserisci la tua password"
                secureTextEntry
            />

            <TextField
                size="md"
                label="Conferma password"
                value={registerPassword}
                onChangeText={setRegisterPassword}
                placeholder="conferma tua password"
                secureTextEntry
            />

            <Button
                onPress={handleLogin}
                title="Crea account"
                variant="secondary"
            />
            {/* <Pressable
                onPress={handleRegister}
                className="bg-emerald-500 rounded-xl py-3.5 items-center justify-center">
                <Text className="text-white font-semibold text-base">Crea account</Text>
            </Pressable> */}
        </View>
    );

    return (
        <Screen backgroundClassName="bg-auth-bg">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled">
                    <View className="flex-1 pt-8">
                        {/* Top: logo + testi */}
                        <AuthHeader />

                        {/* Tab: Accedi / Registrati */}
                        <View className="flex-row">
                            <Pressable
                                onPress={() => setActiveTab("login")}
                                className={`flex-1 py-2.5 items-center ${activeTab === "login" ? "border-b-2 border-brand-primary" : ""}`}>
                                <Text className={`text-sm ${activeTab === "login" ? "text-brand-primary font-semibold" : "text-text-light font-medium"}`}>Accedi</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setActiveTab("register")}
                                className={`flex-1 py-2.5 items-center ${activeTab === "register" ? "border-b-2 border-brand-primary" : ""}`}>
                                <Text className={`text-sm ${activeTab === "register" ? "text-brand-primary font-semibold" : "text-text-light font-medium"}`}>Registrati</Text>
                            </Pressable>
                        </View>

                        {/* Contenuto tab */}
                        <View className="px-6 bg-auth-form py-12">{activeTab === "login" ? renderLoginForm() : renderRegisterForm()}</View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
