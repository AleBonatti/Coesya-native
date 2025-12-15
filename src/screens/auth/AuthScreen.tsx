import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useAuthStore } from "../../auth/authStore";
import { Screen } from "../../components/layout/Screen";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import { LinkText } from "../../components/ui/LinkText";
import { Checkbox, InlineLink } from "../../components/ui/Checkbox";

type AuthTab = "login" | "register";

export function AuthScreen() {
    const [activeTab, setActiveTab] = useState<AuthTab>("login");

    const login = useAuthStore((s) => s.login);
    const isLoggingIn = useAuthStore((s) => s.isLoggingIn);
    const register = useAuthStore((s) => s.register);
    const isRegistering = useAuthStore((s) => s.isRegistering);
    const error = useAuthStore((s) => s.error);
    const fieldErrors = useAuthStore((s) => s.fieldErrors);
    const formError = useAuthStore((s) => s.formError);
    const clearFormError = useAuthStore((s) => s.clearFormError);
    const clearFieldError = useAuthStore((s) => s.clearFieldError);

    // stato login
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");

    // stato registrazione (base, poi lo affiniamo)
    const [registerFirstname, setRegisterFirstname] = useState<string>("");
    const [registerLastname, setRegisterLastname] = useState<string>("");
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState<string>("");
    const [registerPrivacy, setPrivacy] = useState(false);

    const handleLogin = async () => {
        try {
            await login({ email: loginEmail, password: loginPassword });
        } catch {
            // l'errore è già nello store (error)
        }
    };

    const handleRegister = async () => {
        await register({
            firstname: registerFirstname,
            lastname: registerLastname,
            email: registerEmail,
            password: registerPassword,
            password_confirmation: registerPasswordConfirm,
            privacy: registerPrivacy,
        });
    };

    const renderSocialButtons = () => (
        <View>
            <Pressable
                onPress={() => {
                    console.log("Login con Apple");
                }}
                className="flex-row items-center justify-center bg-white rounded-xl py-4 mb-3">
                {/* Placeholder icona Apple */}
                <View className="w-5 h-5 rounded-full bg-black mr-2" />
                <Text className="text-slate-900 font-semibold">Accedi con Apple</Text>
            </Pressable>

            <Pressable
                onPress={() => {
                    console.log("Login con Google");
                }}
                className="flex-row items-center justify-center bg-white rounded-xl py-4">
                {/* Placeholder icona Google */}
                <View className="w-5 h-5 rounded-sm bg-red-500 mr-2" />
                <Text className="text-slate-900 font-semibold">Accedi con Google</Text>
            </Pressable>
        </View>
    );

    const renderLoginForm = () => (
        <View>
            {renderSocialButtons()}

            <Text className="text-center text-text-main my-8">oppure procedi tramite email</Text>

            <TextField
                size="md"
                label="Email"
                value={loginEmail}
                onChangeText={(value) => {
                    setLoginEmail(value);
                    clearFieldError("email");
                    clearFormError();
                }}
                placeholder="Inserisci la tua email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email}
            />

            <TextField
                size="md"
                label="Password"
                secureTextEntry
                value={loginPassword}
                onChangeText={(value) => {
                    setLoginPassword(value);
                    clearFieldError("password");
                    clearFormError();
                }}
                placeholder="••••••••"
                error={fieldErrors.password}
            />

            <View className="mb-6">
                <LinkText onPress={() => {}}>Password dimenticata?</LinkText>
            </View>

            <Button
                disabled={isLoggingIn}
                onPress={handleLogin}
                title={isLoggingIn ? "Accesso..." : "Accedi"}
            />

            {formError ? <Text className="text-red-500 text-sm my-3 text-center">{formError}</Text> : null}
            {error ? <Text className="text-red-500 text-sm mt-3 text-center">{error}</Text> : null}

            <Text className="text-center text-sm mt-4 font-medium text-text-main">
                Accedendo, accetti la nostra{" "}
                <Text
                    onPress={() => {}}
                    className="text-brand-primary underline">
                    informativa sulla Privacy
                </Text>
            </Text>
        </View>
    );

    const renderRegisterForm = () => (
        <View>
            {formError ? <Text className="text-red-500 text-sm mb-3 text-center">{formError}</Text> : null}
            <TextField
                size="md"
                label="Nome"
                value={registerFirstname}
                onChangeText={(v) => {
                    setRegisterFirstname(v);
                    clearFieldError("firstname");
                    clearFormError();
                }}
                placeholder="il tuo nome"
                error={fieldErrors.firstname}
            />
            <TextField
                size="md"
                label="Cognome"
                value={registerLastname}
                onChangeText={(v) => {
                    setRegisterLastname(v);
                    clearFieldError("lastname");
                    clearFormError();
                }}
                placeholder="il tuo cognome"
                error={fieldErrors.lastname}
            />
            <TextField
                size="md"
                label="Email"
                value={registerEmail}
                onChangeText={(v) => {
                    setRegisterEmail(v);
                    clearFieldError("email");
                    clearFormError();
                }}
                placeholder="insersici la tua email"
                autoCapitalize="none"
                keyboardType="email-address"
                error={fieldErrors.email}
            />
            <TextField
                size="md"
                label="Password"
                value={registerPassword}
                onChangeText={(v) => {
                    setRegisterPassword(v);
                    clearFieldError("password");
                    clearFormError();
                }}
                placeholder="inserisci la tua password"
                error={fieldErrors.password}
                secureTextEntry
            />
            <TextField
                size="md"
                label="Conferma password"
                value={registerPasswordConfirm}
                onChangeText={(v) => {
                    setRegisterPasswordConfirm(v);
                    clearFieldError("password_confirmation");
                    clearFormError();
                }}
                placeholder="conferma tua password"
                error={fieldErrors.password_confirmation}
                secureTextEntry
            />
            <Checkbox
                checked={registerPrivacy}
                onChange={setPrivacy}
                className="mb-8"
                error={fieldErrors.privacy}
                labelNode={
                    <Text className="text-sm text-text-main">
                        Accettando, confermi di aver letto e compreso la nostra <InlineLink onPress={() => console.log("Apri privacy")}>Informativa sulla Privacy</InlineLink>. I tuoi dati saranno trattati in modo sicuro e riservato.
                    </Text>
                }
                size="md"
            />
            <Button
                disabled={isLoggingIn}
                onPress={handleRegister}
                title="Crea account"
                variant="secondary"
            />
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
                        <View className="px-8 bg-auth-form py-10">{activeTab === "login" ? renderLoginForm() : renderRegisterForm()}</View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
