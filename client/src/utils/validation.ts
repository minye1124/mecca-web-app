export type ValidationResult =
    | { ok: true }
    | { ok: false; code: RegisterFormErrorCode };

export type RegisterFormErrorCode =
    | "PASSWORD_MISMATCH"
    | "TERMS_NOT_ACCEPTED";

interface RegisterFormInput {
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
}

export function validateRegisterForm(input: RegisterFormInput): ValidationResult {
    if (input.password !== input.confirmPassword) {
        return { ok: false, code: "PASSWORD_MISMATCH" };
    }
    if (!input.termsAccepted) {
        return { ok: false, code: "TERMS_NOT_ACCEPTED" };
    }
    return { ok: true };
}