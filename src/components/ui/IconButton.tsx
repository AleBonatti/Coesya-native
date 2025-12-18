import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export function IconButton({ icon, onPress }: { icon: React.ComponentProps<typeof Feather>["name"]; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            hitSlop={10}>
            <Feather
                name={icon}
                size={20}
                color="#868686"
            />
        </Pressable>
    );
}
