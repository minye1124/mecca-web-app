import { API_URL } from "../config";

//------------------Interfaces------------------
export interface LoginResult {
    token: string;
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
}

//------------------functions------------------
export async function checkEmailExists(email: string): Promise<boolean> {
    const url = new URL(`${API_URL}/api/auth/check-email`);
    url.searchParams.set("email", email);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to check email");
    }

    const data = (await response.json()) as { exists: boolean };
    return data.exists;
}

export function getGoogleLoginUrl(): string {
    return `${API_URL}/api/auth/google-login`;
}

export async function login(payload:LoginPayload): Promise<LoginResult> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
}

export async function register(payload: RegisterPayload): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Registration failed");
}

