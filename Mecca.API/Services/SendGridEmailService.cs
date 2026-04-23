using SendGrid;
using SendGrid.Helpers.Mail;

namespace Mecca.API.Services;

public class SendGridEmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public SendGridEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailConfirmationAsync(string toEmail, string confirmationLink)
    {
        var apiKey = _configuration["SendGrid:ApiKey"];
        var fromEmail = _configuration["SendGrid:FromEmail"];
        var fromName = _configuration["SendGrid:FromName"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException("SendGrid API key is not configured.");
        }

        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("SendGrid from email is not configured.");
        }

        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(fromEmail, fromName);
        var to = new EmailAddress(toEmail);

        const string subject = "Confirm your email";
        var plainTextContent = $"Please confirm your email by visiting this link: {confirmationLink}";
        var htmlContent = $"""
            <p>Please confirm your email by clicking the link below:</p>
            <p><a href="{confirmationLink}">Confirm email</a></p>
            """;

        var message = MailHelper.CreateSingleEmail(
            from,
            to,
            subject,
            plainTextContent,
            htmlContent
        );

        var response = await client.SendEmailAsync(message);

        if ((int)response.StatusCode >= 400)
        {
            throw new InvalidOperationException("Failed to send confirmation email.");
        }
    }
}
