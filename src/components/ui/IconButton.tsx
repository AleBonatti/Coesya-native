import { ActivityIndicator, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export function IconButton({ icon, onPress, isLoading = false }: { icon: React.ComponentProps<typeof Feather>["name"]; onPress: () => void; isLoading?: boolean }) {
    return (
        <Pressable
            onPress={onPress}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            disabled={isLoading}
            hitSlop={10}>
            {isLoading ? (
                <ActivityIndicator size="small" />
            ) : (
                <Feather
                    name={icon}
                    size={20}
                    color="#868686"
                />
            )}
        </Pressable>
    );
}
