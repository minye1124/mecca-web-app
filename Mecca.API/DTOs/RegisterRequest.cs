using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    
    [Required]
    public string Password { get; set; } = "";
    
    [Required]
    public string FirstName { get; set; } = "";
    
    [Required]
    public string LastName { get; set; } = "";
    public DateTime? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public bool AgreeMarketing { get; set; }
}