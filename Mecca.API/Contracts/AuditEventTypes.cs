namespace Mecca.API.Contracts;

public static class AuditEventTypes
{
    public const string FailedLogin = "FAILED_LOGIN";
    public const string SuccessfulLogin = "SUCCESSFUL_LOGIN";
    public const string AccountCreated = "ACCOUNT_CREATED";
    public const string PasswordChanged = "PASSWORD_CHANGED";
    public const string AccountLocked = "ACCOUNT_LOCKED";
    public const string RateLimitViolation = "RATE_LIMIT_VIOLATION";
}
