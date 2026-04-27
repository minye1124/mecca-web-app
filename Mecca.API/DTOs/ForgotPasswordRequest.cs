using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
}
