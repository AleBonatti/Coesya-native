import { ActivityIndicator, Pressable, View } from "react-native";
import { AppIcon, type AppIconName } from "../../components/ui/AppIcon";

export function IconButton({ icon, onPress, isLoading = false }: { icon: AppIconName; onPress: () => void; isLoading?: boolean }) {
    return (
        <Pressable
            onPress={onPress}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            disabled={isLoading}
            hitSlop={10}>
            {isLoading ? (
                <ActivityIndicator size="small" />
            ) : (
                <AppIcon
                    name={icon}
                    size={20}
                    color="#868686"
                />
            )}
        </Pressable>
    );
}
