namespace Mecca.API.Services;

public interface IEmailService
{
    Task SendEmailConfirmationAsync(string toEmail, string confirmationLink);
}
