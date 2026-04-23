namespace Mecca.API.Contracts;

public static class AuthErrorCodes
{
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string EmailNotConfirmed = "EMAIL_NOT_CONFIRMED";
    public const string EmailTaken = "EMAIL_TAKEN";
    public const string EmailInvalid = "EMAIL_INVALID";
    public const string PasswordContainsWhitespace = "PASSWORD_CONTAINS_WHITESPACE";
    public const string PasswordTooShort = "PASSWORD_TOO_SHORT";
    public const string PasswordMissingDigit = "PASSWORD_MISSING_DIGIT";
    public const string PasswordMissingUpper = "PASSWORD_MISSING_UPPER";
    public const string PasswordMissingLower = "PASSWORD_MISSING_LOWER";
    public const string PasswordMissingSpecial = "PASSWORD_MISSING_SPECIAL";

    public const string ValidationFailed = "VALIDATION_FAILED";
    public const string RegistrationFailed = "REGISTRATION_FAILED";
    public const string RateLimited = "RATE_LIMITED";
}
