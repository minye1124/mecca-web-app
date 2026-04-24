import { API_BASE_PATH } from "../../../config";

//------------------Interfaces------------------
export interface AuthUserResponse {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface ConfirmEmailPayload {
    userId: string;
    token: string;
}

export interface ResendConfirmationEmailPayload {
    email: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    token: string;
    newPassword: string;
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

type ErrorResponseBody = {
    code?: string;
    message?: string;
}

export class AuthApiError extends Error {
    code: string;
    retryAfterSeconds?: number;

    constructor(message: string, code: string, retryAfterSeconds?: number) {
        super(message);
        this.name = "AuthApiError";
        this.code = code;
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

//------------------helpers------------------
async function parseErrorResponse(response: Response): Promise<AuthApiError> {
    if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfterSeconds =
            retryAfterHeader !== null && isFinite(Number(retryAfterHeader))
                ? Number(retryAfterHeader)
                : undefined;

        return new AuthApiError(
            "Too many requests. Please try again later.",
            "RATE_LIMITED",
            retryAfterSeconds
        );
    }

    let errorBody: ErrorResponseBody | null = null;
    try {
        errorBody = (await response.json()) as ErrorResponseBody;
    } catch {
        errorBody = null;
    }

    return new AuthApiError(
        errorBody?.message ?? "Something went wrong. Please try again.",
        errorBody?.code ?? "UNKNOWN"
    );
}

//------------------functions------------------
export async function checkEmailExists(email: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_PATH}/auth/check-email?email=${encodeURIComponent(email)}`, {
        credentials: "include",
    });

    if (!response.ok) throw await parseErrorResponse(response);

    const data = (await response.json()) as { exists: boolean };
    return data.exists;
}

export function getGoogleLoginUrl(): string {
    return `${API_BASE_PATH}/auth/google-login`;
}

export async function confirmEmail(payload: ConfirmEmailPayload): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_PATH}/auth/confirm-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function resendConfirmationEmail( payload: ResendConfirmationEmailPayload ): Promise<{ message: string; confirmationLink?: string }> {
    const response = await fetch(`${API_BASE_PATH}/auth/resend-confirmation-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function forgotPassword( payload: ForgotPasswordPayload ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_PATH}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function resetPassword( payload: ResetPasswordPayload ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_PATH}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function login(payload: LoginPayload): Promise<AuthUserResponse> {
    const response = await fetch(`${API_BASE_PATH}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function register(payload: RegisterPayload): Promise<AuthUserResponse> {
    const response = await fetch(`${API_BASE_PATH}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

export async function logout(): Promise<void> {
    const response = await fetch(`${API_BASE_PATH}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) throw await parseErrorResponse(response);

}

export async function getCurrentUser(): Promise<AuthUserResponse> {
    const response = await fetch(`${API_BASE_PATH}/auth/me`, {
        credentials: "include",
    });

    if (!response.ok) throw await parseErrorResponse(response);

    return response.json();
}

