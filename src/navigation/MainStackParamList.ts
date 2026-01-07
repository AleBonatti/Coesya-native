import type { NavigatorScreenParams } from "@react-navigation/native";
import type { FamilyTabsParamList } from "./FamilyTabs";

export type MainStackParamList = {
    WizardHome: undefined;
    WizardCreateFamily: undefined;
    WizardJoinFamily: undefined;

    FamilyTabs: NavigatorScreenParams<FamilyTabsParamList>;
    FamilyHome: undefined;
    FamilyDetail: { familyId: number };
};
