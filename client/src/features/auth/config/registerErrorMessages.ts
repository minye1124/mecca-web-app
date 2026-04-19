import type { RegisterFormErrorCode } from "../../../utils/validation";

export const registerErrorMessages: Record<RegisterFormErrorCode, string> = {
    "EMAIL_INVALID": "Please enter a valid email address.",
    "FIRST_NAME_REQUIRED": "Please enter your first name.",
    "LAST_NAME_REQUIRED": "Please enter your last name.",
    "PASSWORD_CONTAINS_WHITESPACE": "Password cannot contain spaces or other whitespace characters.",
    "PASSWORD_TOO_SHORT": "Password must be at least 8 characters long.",
    "PASSWORD_MISSING_UPPER": "Password must include at least one uppercase letter.",
    "PASSWORD_MISSING_LOWER": "Password must include at least one lowercase letter.",
    "PASSWORD_MISSING_DIGIT": "Password must include at least one number.",
    "PASSWORD_MISSING_SPECIAL": "Password must include at least one special character.",
    "PASSWORD_MISMATCH": "Passwords do not match. Please try again.",
    "TERMS_NOT_ACCEPTED": "Please confirm that you have read and accepted the terms and conditions."
};
