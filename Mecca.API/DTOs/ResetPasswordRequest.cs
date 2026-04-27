using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class ResetPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Token { get; set; } = "";

    [Required]
    public string NewPassword { get; set; } = "";
}
