using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class ResendConfirmationEmailRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
}
