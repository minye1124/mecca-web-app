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
using Microsoft.AspNetCore.Antiforgery;

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
    private readonly IAuditLogService _auditLogService;
    private readonly IAntiforgery _antiforgery;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, GoogleAuthService googleAuthService, IConfiguration configuration, IEmailService emailService, IAuditLogService auditLogService, IAntiforgery antiforgery)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _googleAuthService = googleAuthService;
        _configuration = configuration;
        _emailService = emailService;
        _auditLogService = auditLogService;
        _antiforgery = antiforgery;
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

    [AllowAnonymous]
    [HttpGet("csrf-token")]
    public IActionResult GetCsrfToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

        return Ok(new
        {
            csrfToken = tokens.RequestToken
        });
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

        await _auditLogService.WriteAsync(AuditEventTypes.AccountCreated, userId: user.Id, email: user.Email, reason: "email_password_registration");

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
        }

        return Ok(new
        {
            message = "If your account requires email verification, a confirmation email has been sent."
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user != null && user.EmailConfirmed)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var resetLink = $"{_configuration["ClientUrl"]}/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={encodedToken}";

            await _emailService.SendPasswordResetAsync(user.Email!, resetLink);
        }

        return Ok(new
        {
            message = "If an account exists for this email, password reset instructions have been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest(new
            {
                code = AuthErrorCodes.ValidationFailed,
                message = "Invalid or expired password reset link."
            });
        }

        if (request.NewPassword.Any(char.IsWhiteSpace))
        {
            return BadRequest(new
            {
                code = AuthErrorCodes.PasswordContainsWhitespace,
                message = "Password cannot contain spaces."
            });
        }

        var isSameAsCurrentPassword = await _userManager.CheckPasswordAsync(user, request.NewPassword);
        if (isSameAsCurrentPassword)
        {
            return BadRequest(new
            {
                code = AuthErrorCodes.PasswordSameAsCurrent,
                message = "New password must be different from your current password."
            });
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
        var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

        if (!result.Succeeded)
        {
            var firstError = result.Errors.First();
            var mapped = MapIdentityError(firstError);

            return BadRequest(new
            {
                code = mapped.Code,
                message = mapped.Message == "We couldn't create your account. Please check your details and try again."
                    ? "Invalid or expired password reset link."
                    : mapped.Message
            });
        }

        await _auditLogService.WriteAsync(AuditEventTypes.PasswordChanged, userId: user.Id, email: user.Email, reason: "password_reset");

        return Ok(new
        {
            message = "Your password has been reset successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            await _auditLogService.WriteAsync(AuditEventTypes.FailedLogin, email: email, reason: "user_not_found");
            return Unauthorized(new
            {
                code = AuthErrorCodes.InvalidCredentials,
                message = "Invalid email or password"
            });
        }

        if (!user.EmailConfirmed)
        {
            await _auditLogService.WriteAsync(AuditEventTypes.FailedLogin, userId: user.Id, email: user.Email, reason: "email_not_confirmed");

            return Unauthorized(new
            {
                code = AuthErrorCodes.EmailNotConfirmed,
                message = "Please verify your email before logging in."
            });
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            return StatusCode(StatusCodes.Status423Locked, new
            {
                code = AuthErrorCodes.AccountLocked,
                message = "Your account is temporarily locked due to too many failed login attempts. Please try again later."
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
        {
            await _auditLogService.WriteAsync(AuditEventTypes.FailedLogin, userId: user.Id, email: user.Email, reason: "invalid_password");
            await _auditLogService.WriteAsync(AuditEventTypes.AccountLocked, userId: user.Id, email: user.Email, reason: "failed_login_threshold_reached");

            return StatusCode(StatusCodes.Status423Locked, new
            {
                code = AuthErrorCodes.AccountLocked,
                message = "Your account is temporarily locked due to too many failed login attempts. Please try again later."
            });
        }

        if (!result.Succeeded)
        {
            await _auditLogService.WriteAsync(AuditEventTypes.FailedLogin, userId: user.Id, email: user.Email, reason: "invalid_password");

            return Unauthorized(new
            {
                code = AuthErrorCodes.InvalidCredentials,
                message = "Invalid email or password"
            });
        }

        await _signInManager.SignInAsync(user, isPersistent: true);

        await _auditLogService.WriteAsync(AuditEventTypes.SuccessfulLogin, userId: user.Id, email: user.Email, reason: "email_password");

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
        await _auditLogService.WriteAsync(AuditEventTypes.SuccessfulLogin, userId: result.User.Id, email: result.User.Email, reason: "google_oauth");

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
