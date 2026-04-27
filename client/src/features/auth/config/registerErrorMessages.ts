import type { RegisterFormErrorCode } from "../../../utils/validation";

export const registerErrorMessages: Record<RegisterFormErrorCode, string> = {
    "EMAIL_INVALID": "Please enter a valid email address.",
    "FIRST_NAME_REQUIRED": "Please enter your first name.",
    "FIRST_NAME_TOO_SHORT": "First name must be at least 2 characters.",
    "FIRST_NAME_TOO_LONG": "First name must be 50 characters or fewer.",
    "FIRST_NAME_INVALID": "First name can only contain letters, spaces, hyphens, and apostrophes.",
    "LAST_NAME_REQUIRED": "Please enter your last name.",
    "LAST_NAME_TOO_SHORT": "Last name must be at least 2 characters.",
    "LAST_NAME_TOO_LONG": "Last name must be 50 characters or fewer.",
    "LAST_NAME_INVALID": "Last name can only contain letters, spaces, hyphens, and apostrophes.",
    "PASSWORD_CONTAINS_WHITESPACE": "Password cannot contain spaces or other whitespace characters.",
    "PASSWORD_TOO_SHORT": "Password must be at least 8 characters long.",
    "PASSWORD_MISSING_UPPER": "Password must include at least one uppercase letter.",
    "PASSWORD_MISSING_LOWER": "Password must include at least one lowercase letter.",
    "PASSWORD_MISSING_DIGIT": "Password must include at least one number.",
    "PASSWORD_MISSING_SPECIAL": "Password must include at least one special character.",
    "PASSWORD_MISMATCH": "Passwords do not match. Please try again.",
    "TERMS_NOT_ACCEPTED": "Please confirm that you have read and accepted the terms and conditions."
};
