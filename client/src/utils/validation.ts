export type ValidationResult =
    | { ok: true }
    | { ok: false; code: RegisterFormErrorCode };

export type RegisterFormErrorCode =
    | "EMAIL_INVALID"
    | "FIRST_NAME_REQUIRED"
    | "LAST_NAME_REQUIRED"
    | "PASSWORD_CONTAINS_WHITESPACE"
    | "PASSWORD_TOO_SHORT"
    | "PASSWORD_MISSING_UPPER"
    | "PASSWORD_MISSING_LOWER"
    | "PASSWORD_MISSING_DIGIT"
    | "PASSWORD_MISSING_SPECIAL"    
    | "PASSWORD_MISMATCH"
    | "TERMS_NOT_ACCEPTED";

interface RegisterFormInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
}

export function validateEmailFormat(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRegisterForm(input: RegisterFormInput): ValidationResult {
    if (!input.firstName.trim()) {
        return { ok: false, code: "FIRST_NAME_REQUIRED" };
    }
    if (!input.lastName.trim()) {
        return { ok: false, code: "LAST_NAME_REQUIRED" };
    }
    if (!validateEmailFormat(input.email)) {
        return { ok: false, code: "EMAIL_INVALID" };
    }
    if (/\s/.test(input.password)) {
        return { ok: false, code: "PASSWORD_CONTAINS_WHITESPACE" };
    }
    if (input.password.length < 8) {
        return { ok: false, code: "PASSWORD_TOO_SHORT" };
    }
    if (!/[A-Z]/.test(input.password)) {
        return { ok: false, code: "PASSWORD_MISSING_UPPER" };
    }
    if (!/[a-z]/.test(input.password)) {
        return { ok: false, code: "PASSWORD_MISSING_LOWER" };
    }
    if (!/[0-9]/.test(input.password)) {
        return { ok: false, code: "PASSWORD_MISSING_DIGIT" };
    }
    if (!/[^A-Za-z0-9]/.test(input.password)) {
        return { ok: false, code: "PASSWORD_MISSING_SPECIAL" };
    }
    if (input.password !== input.confirmPassword) {
        return { ok: false, code: "PASSWORD_MISMATCH" };
    }
    if (!input.termsAccepted) {
        return { ok: false, code: "TERMS_NOT_ACCEPTED" };
    }
    return { ok: true };
}