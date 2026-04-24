export type ValidationResult =
    | { ok: true }
    | { ok: false; code: RegisterFormErrorCode };

export type RegisterFormErrorCode =
    | "EMAIL_INVALID"
    | "FIRST_NAME_REQUIRED"
    | "LAST_NAME_REQUIRED"
    | "TERMS_NOT_ACCEPTED"
    | PasswordFieldErrorCode;

export type PasswordFieldErrorCode =
    | "PASSWORD_CONTAINS_WHITESPACE"
    | "PASSWORD_TOO_SHORT"
    | "PASSWORD_MISSING_UPPER"
    | "PASSWORD_MISSING_LOWER"
    | "PASSWORD_MISSING_DIGIT"
    | "PASSWORD_MISSING_SPECIAL"
    | "PASSWORD_MISMATCH";

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

export function validatePasswordFields(password: string, confirmPassword: string):
    | { ok: true }
    | { ok: false; code: PasswordFieldErrorCode } {
    if (/\s/.test(password)) {
        return { ok: false, code: "PASSWORD_CONTAINS_WHITESPACE" };
    }
    if (password.length < 8) {
        return { ok: false, code: "PASSWORD_TOO_SHORT" };
    }
    if (!/[A-Z]/.test(password)) {
        return { ok: false, code: "PASSWORD_MISSING_UPPER" };
    }
    if (!/[a-z]/.test(password)) {
        return { ok: false, code: "PASSWORD_MISSING_LOWER" };
    }
    if (!/[0-9]/.test(password)) {
        return { ok: false, code: "PASSWORD_MISSING_DIGIT" };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { ok: false, code: "PASSWORD_MISSING_SPECIAL" };
    }
    if (password !== confirmPassword) {
        return { ok: false, code: "PASSWORD_MISMATCH" };
    }

    return { ok: true };
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

    const passwordValidation = validatePasswordFields(input.password, input.confirmPassword);
    if (passwordValidation.ok === false) {
        return passwordValidation;
    }

    if (!input.termsAccepted) {
        return { ok: false, code: "TERMS_NOT_ACCEPTED" };
    }
    return { ok: true };
}
