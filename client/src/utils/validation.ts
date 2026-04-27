export type ValidationResult =
    | { ok: true }
    | { ok: false; code: RegisterFormErrorCode };

export type RegisterFormErrorCode =
    | "EMAIL_INVALID"
    | "FIRST_NAME_REQUIRED"
    | "FIRST_NAME_TOO_SHORT"
    | "FIRST_NAME_TOO_LONG"
    | "FIRST_NAME_INVALID"
    | "LAST_NAME_REQUIRED"
    | "LAST_NAME_TOO_SHORT"
    | "LAST_NAME_TOO_LONG"
    | "LAST_NAME_INVALID"
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

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

export function validateEmailFormat(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(value: string, field: "firstName" | "lastName"):
    | { ok: true }
    | {
        ok: false;
        code:
        | "FIRST_NAME_REQUIRED"
        | "FIRST_NAME_TOO_SHORT"
        | "FIRST_NAME_TOO_LONG"
        | "FIRST_NAME_INVALID"
        | "LAST_NAME_REQUIRED"
        | "LAST_NAME_TOO_SHORT"
        | "LAST_NAME_TOO_LONG"
        | "LAST_NAME_INVALID";
    } {
    const trimmed = value.trim();

    if (!trimmed) {
        return {
            ok: false,
            code: field === "firstName" ? "FIRST_NAME_REQUIRED" : "LAST_NAME_REQUIRED",
        };
    }
    if (trimmed.length < NAME_MIN_LENGTH) {
        return {
            ok: false,
            code: field === "firstName" ? "FIRST_NAME_TOO_SHORT" : "LAST_NAME_TOO_SHORT",
        };
    }
    if (trimmed.length > NAME_MAX_LENGTH) {
        return {
            ok: false,
            code: field === "firstName" ? "FIRST_NAME_TOO_LONG" : "LAST_NAME_TOO_LONG",
        };
    }
    if (!NAME_REGEX.test(trimmed)) {
        return {
            ok: false,
            code: field === "firstName" ? "FIRST_NAME_INVALID" : "LAST_NAME_INVALID",
        };
    }

    return { ok: true };
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
    const firstNameValidation = validateName(input.firstName, "firstName");
    if (firstNameValidation.ok === false) {
        return firstNameValidation;
    }

    const lastNameValidation = validateName(input.lastName, "lastName");
    if (lastNameValidation.ok === false) {
        return lastNameValidation;
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
