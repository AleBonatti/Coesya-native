import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { AppIcon, type AppIconName } from "../../../components/ui/AppIcon";
import { AppIcon, type AppIconName } from "../components/ui/AppIcon";

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { FamilyStackParamList } from "./FamilyStack";
import type { ChoresStackParamList } from "./ChoresStack";

import { FamilyStack } from "./FamilyStack";
import { ChoresStack } from "./ChoresStack";
import { FamilyHomeScreen } from "../screens/app/tabs/FamilyHomeScreen";
import { GoalsScreen } from "../screens/app/tabs/GoalsScreen";

export type FamilyTabsParamList = {
    Home: undefined;
    Family: NavigatorScreenParams<FamilyStackParamList> | undefined;
    Chores: NavigatorScreenParams<ChoresStackParamList> | undefined;
    Goals: undefined;
};

const Tab = createBottomTabNavigator<FamilyTabsParamList>();

export function FamilyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                sceneStyle: { backgroundColor: "#F7F7F7" },

                tabBarStyle: {
                    position: "absolute",
                    left: 30,
                    right: 30,
                    bottom: 30,

                    height: 62,
                    borderRadius: 999,
                    borderTopWidth: 0,
                    backgroundColor: "#A76D99",

                    flexDirection: "row", // ✅ row
                    alignItems: "center", // ✅ centro verticale
                    justifyContent: "space-between", // ✅ distribuzione orizzontale
                    paddingHorizontal: 18, // ✅ respiro laterale
                },
                tabBarItemStyle: {
                    flex: 1, // ✅ ogni item stesso spazio
                    alignItems: "center",
                    justifyContent: "center",
                },
                tabBarIconStyle: {
                    width: 44,
                    height: 44,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={FamilyHomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="home-outline"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Family"
                component={FamilyStack}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // forza sempre la root della sezione Family
                        e.preventDefault();
                        navigation.navigate("Family", { screen: "FamilyRoot" });
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="people-outline"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Chores"
                component={ChoresStack}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // forza sempre la root della sezione Chores
                        e.preventDefault();
                        navigation.navigate("Chores", { screen: "ChoresRoot" });
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="list-outline"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="trophy-outline"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function TabIcon({ focused, icon }: { focused: boolean; icon: AppIconName }) {
    return (
        <View
            style={{
                width: 90,
                height: 48,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#5E134C" : "transparent",
            }}>
            <AppIcon
                name={icon}
                size={22}
                color={focused ? "#FFA500" : "#FFFFFF"}
            />
        </View>
    );
}
