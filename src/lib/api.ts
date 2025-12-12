import { getToken } from "./secureStore";

const API_BASE_URL = "http://api.coesya.test/api";

export type ValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
    public status: number;
    public validationErrors?: ValidationErrors;

    constructor(message: string, status: number, validationErrors?: ValidationErrors) {
        super(message);
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

function isValidationErrorPayload(value: unknown): value is { message?: string; errors?: ValidationErrors } {
    if (!value || typeof value !== "object") return false;
    const v = value as Record<string, unknown>;
    if (!("errors" in v)) return false;
    const errors = v.errors;
    return !!errors && typeof errors === "object";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
            const data: unknown = await res.json().catch(() => null);

            if (res.status === 422 && isValidationErrorPayload(data)) {
                const message = typeof data?.message === "string" ? data.message : "Validation error";
                const errors = (data as { errors?: ValidationErrors }).errors;
                throw new ApiError(message, 422, errors);
            }

            const message = data && typeof data === "object" && "message" in (data as Record<string, unknown>) && typeof (data as Record<string, unknown>).message === "string" ? ((data as Record<string, unknown>).message as string) : res.statusText;

            throw new ApiError(message, res.status);
        }

        const text = await res.text().catch(() => "");
        throw new ApiError(text || res.statusText, res.status);
    }

    return (await res.json()) as T;
}

export const api = {
    post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    get: <T>(path: string) => request<T>(path),
};
