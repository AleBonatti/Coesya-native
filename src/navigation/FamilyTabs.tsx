import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { FamilyStackParamList } from "./FamilyStack";

import { FamilyHomeScreen } from "../screens/app/FamilyHomeScreen";
import { FamilyStack } from "./FamilyStack";
import { ChoresScreen } from "../screens/app/tabs/ChoresScreen";
import { GoalsScreen } from "../screens/app/tabs/GoalsScreen";

export type FamilyTabsParamList = {
    Home: undefined;
    Family: NavigatorScreenParams<FamilyStackParamList>;
    Chores: undefined;
    Goals: undefined;
};

const Tab = createBottomTabNavigator<FamilyTabsParamList>();

export function FamilyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                sceneStyle: { backgroundColor: "#FFFFFF" },

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
                            icon="home"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Family"
                component={FamilyStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="users"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Chores"
                component={ChoresScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="command"
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
                            icon="gift"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function TabIcon({ focused, icon }: { focused: boolean; icon: React.ComponentProps<typeof Feather>["name"] }) {
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
            <Feather
                name={icon}
                size={22}
                color={focused ? "#FFA500" : "#FFFFFF"}
            />
        </View>
    );
}
