import { useEffect, useState } from "react";

/**
 * Restituisce un valore "debounced":
 * viene aggiornato solo dopo che il valore originale
 * non cambia per `delay` millisecondi.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
