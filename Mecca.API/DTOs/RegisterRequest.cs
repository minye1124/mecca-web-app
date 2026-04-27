using System.ComponentModel.DataAnnotations;

namespace Mecca.API.DTOs;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    
    [Required]
    public string Password { get; set; } = "";
    
    [Required(ErrorMessage = "First name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters.")]
    [RegularExpression(@"^[A-Za-z]+(?:[ '-][A-Za-z]+)*$", ErrorMessage = "First name can only contain letters, spaces, hyphens, and apostrophes.")]
    public string FirstName { get; set; } = "";
    
    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters.")]
    [RegularExpression(@"^[A-Za-z]+(?:[ '-][A-Za-z]+)*$", ErrorMessage = "Last name can only contain letters, spaces, hyphens, and apostrophes.")]
    public string LastName { get; set; } = "";
    public DateTime? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public bool AgreeMarketing { get; set; }
}