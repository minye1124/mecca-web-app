import { API_BASE_PATH } from "../../../config";

//------------------Interfaces------------------
export interface LoginResponse {
    token: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null; // ISO datetime string
    phoneNumber: string | null;
    agreeMarketing: boolean;
}

//------------------functions------------------
export async function checkEmailExists(email: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_PATH}/auth/check-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to check email");
    }

    const data = (await response.json()) as { exists: boolean };
    return data.exists;
}

export function getGoogleLoginUrl(): string {
    return `${API_BASE_PATH}/auth/google-login`;
}

export async function login(payload:LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_PATH}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
}

export async function register(payload: RegisterPayload): Promise<void> {
    const response = await fetch(`${API_BASE_PATH}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Registration failed");
}

