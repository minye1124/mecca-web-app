using Mecca.API.Models;
using Mecca.API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Mecca.API.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Claims;

namespace Mecca.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly GoogleAuthService _googleAuthService;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService, GoogleAuthService googleAuthService,IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _googleAuthService = googleAuthService;
        _configuration = configuration;
    }

    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return Ok(new { exists = user != null});
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

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(new { message = "Registration successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password"});
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new 
        { 
            token,
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

        return RedirectWithToken(result.User);
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

    private IActionResult RedirectWithToken(AppUser user)
    {
        var token = _tokenService.CreateToken(user);
        var url = QueryHelpers.AddQueryString(
            _configuration["ClientUrl"]!,
            new Dictionary<string, string?>
            {
                ["token"] = token,
                ["firstName"] = user.FirstName,
                ["lastName"] = user.LastName,
                ["email"] = user.Email
            }
        );

        return Redirect(url);
    }

}
