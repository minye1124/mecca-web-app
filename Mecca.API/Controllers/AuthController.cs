using Mecca.API.Models;
using Mecca.API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Mecca.API.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Mecca.API.Contracts;
using System.Text;

namespace Mecca.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly GoogleAuthService _googleAuthService;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, GoogleAuthService googleAuthService, IConfiguration configuration, IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _googleAuthService = googleAuthService;
        _configuration = configuration;
        _emailService = emailService;
    }

    private static (string Code, string Message) MapIdentityError(IdentityError error)
    {
        return error.Code switch
        {
            "DuplicateUserName" => (AuthErrorCodes.EmailTaken, "An account with this email already exists."),
            "DuplicateEmail" => (AuthErrorCodes.EmailTaken, "An account with this email already exists."),
            "PasswordTooShort" => (AuthErrorCodes.PasswordTooShort, "Password must be at least 8 characters."),
            "PasswordRequiresDigit" => (AuthErrorCodes.PasswordMissingDigit, "Password must include at least one number."),
            "PasswordRequiresUpper" => (AuthErrorCodes.PasswordMissingUpper, "Password must include at least one uppercase letter."),
            "PasswordRequiresLower" => (AuthErrorCodes.PasswordMissingLower, "Password must include at least one lowercase letter."),
            "PasswordRequiresNonAlphanumeric" => (AuthErrorCodes.PasswordMissingSpecial, "Password must include at least one special character."),
            _ => (AuthErrorCodes.RegistrationFailed, "We couldn't create your account. Please check your details and try again.")
        };
    }

    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return Ok(new { exists = user != null });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth,
            PhoneNumber = request.PhoneNumber,
            AgreeMarketing = request.AgreeMarketing
        };

        if (request.Password.Any(char.IsWhiteSpace))
        {
            return BadRequest(new
            {
                code = AuthErrorCodes.PasswordContainsWhitespace,
                message = "Password cannot contain spaces."
            });
        }

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var firstError = result.Errors.First();
            var mapped = MapIdentityError(firstError);

            return BadRequest(new
            {
                code = mapped.Code,
                message = mapped.Message
            });
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        var confirmationLink = $"{_configuration["ClientUrl"]}/confirm-email?userId={user.Id}&token={encodedToken}";
        await _emailService.SendEmailConfirmationAsync(user.Email!, confirmationLink);

        return Ok(new
        {
            requiresEmailConfirmation = true,
            email = user.Email,
            message = "Registration successful. Please check your email to verify your account.",
            confirmationLink
        });
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            return BadRequest(new
            {
                code = AuthErrorCodes.ValidationFailed,
                message = "Invalid confirmation link."
            });
        }
        if (user.EmailConfirmed)
        {
            return Ok(new
            {
                message = "Your email is already confirmed. You can now log in."
            });
        }
        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
        {
            var refreshedUser = await _userManager.FindByIdAsync(request.UserId);

            if (refreshedUser?.EmailConfirmed == true)
            {
                return Ok(new
                {
                    message = "Your email is already confirmed. You can now log in."
                });
            }
            
            return BadRequest(new
            {
                code = AuthErrorCodes.ValidationFailed,
                message = "Invalid or expired confirmation link."
            });
        }

        return Ok(new
        {
            message = "Email confirmed successfully."
        });
    }

    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user != null && !user.EmailConfirmed)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var confirmationLink = $"{_configuration["ClientUrl"]}/confirm-email?userId={user.Id}&token={encodedToken}";

            await _emailService.SendEmailConfirmationAsync(user.Email!, confirmationLink);

            return Ok(new
            {
                message = "If your account requires email verification, a confirmation email has been sent.",
            });
        }

        return Ok(new
        {
            message = "If your account requires email verification, a confirmation email has been sent."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized(new
            {
                code = AuthErrorCodes.InvalidCredentials,
                message = "Invalid email or password"
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!user.EmailConfirmed)
        {
            return Unauthorized(new
            {
                code = AuthErrorCodes.EmailNotConfirmed,
                message = "Please verify your email before logging in."
            });
        }

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                code = AuthErrorCodes.InvalidCredentials,
                message = "Invalid email or password"
            });
        }

        await _signInManager.SignInAsync(user, isPersistent: true);
        return Ok(new
        {
            user = new
            {
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
            }
        });
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth", null, Request.Scheme)!;
        var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
        return Challenge(properties, "Google");
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await _googleAuthService.HandleGoogleCallBackAsync();
        if (result.Error != null)
        {
            return RedirectWithError(result.Error);
        }
        if (result.User == null)
        {
            return RedirectWithError("google-user-not-found");
        }

        await _signInManager.SignInAsync(result.User, isPersistent: true);
        return Redirect(_configuration["ClientUrl"]!);
    }

    private IActionResult RedirectWithError(string error)
    {
        var url = QueryHelpers.AddQueryString(
            _configuration["ClientUrl"]!,
            "error",
            error
        );

        return Redirect(url);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            user = new
            {
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email
            }
        });
    }
}
