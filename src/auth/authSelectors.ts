import type { Family, User } from "./authTypes";

export function hasAnyFamily(user: User | null): boolean {
    return Boolean(user && user.families && user.families.length > 0);
}

export function getCurrentFamily(user: User | null): Family | null {
    if (!user?.families?.length) return null;
    return user.families.find((f) => f.pivot.current === 1) ?? user.families[0] ?? null;
}
