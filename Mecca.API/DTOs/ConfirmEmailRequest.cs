using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class ConfirmEmailRequest
{
    [Required]
    public string UserId { get; set; } = "";

    [Required]
    public string Token { get; set; } = "";
}
