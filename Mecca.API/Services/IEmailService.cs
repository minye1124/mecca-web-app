namespace Mecca.API.Services;

public interface IEmailService
{
    Task SendEmailConfirmationAsync(string toEmail, string confirmationLink);
    Task SendPasswordResetAsync(string toEmail, string resetLink);
}
