import type { NavigatorScreenParams } from "@react-navigation/native";
import type { FamilyTabsParamList } from "./FamilyTabs";

export type MainStackParamList = {
    FamilyWizardHome: undefined;
    CreateFamily: undefined;
    JoinFamily: undefined;

    FamilyTabs: NavigatorScreenParams<FamilyTabsParamList>;
    FamilyHome: undefined;
    FamilyDetail: { familyId: number };
    Profile: undefined;
    Notifications: undefined;
    Privacy: undefined;
    ResetData: undefined;
};
