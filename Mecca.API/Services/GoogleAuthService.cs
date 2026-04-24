using System.Security.Claims;
using Mecca.API.Models;
using Mecca.API.Contracts;
using Microsoft.AspNetCore.Identity;

namespace Mecca.API.Services;
public class GoogleAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IAuditLogService _auditLogService;

    public GoogleAuthService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IAuditLogService auditLogService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _auditLogService = auditLogService;
    }

    public sealed record GoogleAuthResult(AppUser? User, string? Error);
    private sealed record GoogleProfile(string Email, string FirstName, string LastName);

    public async Task<GoogleAuthResult> HandleGoogleCallBackAsync()
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null) return new GoogleAuthResult(null, "google-login-failed");

        // Sign in the user already binded with google account
        var (exsitingUser, signInError) = await TrySignInExistingGoogleUserAsync(info);
        if (signInError != null) return new GoogleAuthResult(null, signInError);
        if (exsitingUser != null) return new GoogleAuthResult(exsitingUser, null);

        var googleProfile = ReadGoogleProfile(info);
        if (googleProfile == null) return new GoogleAuthResult(null, "google-email-not-found");

        // Check if there's an existing user with the same email
        var (user, userError) = await FindOrCreateUserAsync(googleProfile);
        if (userError != null) return new GoogleAuthResult(null, userError);
        if (user == null) return new GoogleAuthResult(null, "user-not-found");

        // Bind the google account with the found or created user
        var BindError = await BindGoogleAccountAsync(user, info);
        if (BindError != null) return new GoogleAuthResult(null, BindError);

        return new GoogleAuthResult(user, null);
    }

        private async Task<(AppUser? User, string? Error)> TrySignInExistingGoogleUserAsync(ExternalLoginInfo info)
    {
        var signInResult = await _signInManager.ExternalLoginSignInAsync(
            info.LoginProvider, 
            info.ProviderKey, 
            isPersistent: false,
            bypassTwoFactor: true
        );

        if (!signInResult.Succeeded) return (null, null);

        var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (user == null) return (null, "google-user-not-found");
        return (user, null);
    }

    private GoogleProfile? ReadGoogleProfile(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email)) return null;

        var firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName) ?? "";
        var lastName = info.Principal.FindFirstValue(ClaimTypes.Surname) ?? "";

        return new GoogleProfile(email, firstName, lastName);
    }

    private async Task<(AppUser? User, string? Error)> FindOrCreateUserAsync(GoogleProfile profile)
    {
        var user = await _userManager.FindByEmailAsync(profile.Email);
        if (user != null) return (user, null);

        user = new AppUser
        {
            UserName = profile.Email,
            Email = profile.Email,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            EmailConfirmed = true
        };

        var creatResult = await _userManager.CreateAsync(user);
        if (!creatResult.Succeeded) return (null, "user-creation-failed");

        await _auditLogService.WriteAsync( AuditEventTypes.AccountCreated, userId: user.Id, email: user.Email, reason: "google_oauth_registration");

        return (user, null);
    }

    private async Task<string?> BindGoogleAccountAsync(AppUser user, ExternalLoginInfo info)
    {
        var existingBind = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (existingBind != null) 
        {
            if (existingBind.Id == user.Id) return null; // Already Binded to this user
            return "google-account-already-binded-to-another-user";
        }

        var BindResult = await _userManager.AddLoginAsync(user, info);
        if (!BindResult.Succeeded) return "google-account-bind-failed";

        return null;
    }
}