import { ActivityIndicator, Pressable, View } from "react-native";
import { AppIcon, type AppIconName } from "../../components/ui/AppIcon";

export function IconButton({ icon, bgClass = "bg-white", wClass = "w-10", hClass = "h-10", color = "#868686", onPress, isLoading = false }: { icon: AppIconName; bgClass?: string; wClass?: string; hClass?: string; color?: string; onPress: () => void; isLoading?: boolean }) {
    return (
        <Pressable
            onPress={onPress}
            className={`${wClass} ${hClass} rounded-full items-center justify-center ${bgClass}`}
            disabled={isLoading}
            hitSlop={10}>
            {isLoading ? (
                <ActivityIndicator size="small" />
            ) : (
                <AppIcon
                    name={icon}
                    size={20}
                    color={color}
                />
            )}
        </Pressable>
    );
}
