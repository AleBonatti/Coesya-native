import type { NavigatorScreenParams } from "@react-navigation/native";
import type { FamilyTabsParamList } from "./FamilyTabs";

export type MainStackParamList = {
    // Onboarding (no family)
    Dashboard: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;

    // family (con bottom menu)
    FamilyTabs: NavigatorScreenParams<FamilyTabsParamList>;
    FamilyDetail: { familyId: number };

    // Account (sempre accessibili)
    Profile: undefined;
    Notifications: undefined;
    //Theme: undefined;
    Privacy: undefined;
    ResetData: undefined;
};
