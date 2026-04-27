using System.Security.Claims;
using Mecca.API.Contracts;
using Mecca.API.Services;

namespace Mecca.API.Middleware;

public class AuditRateLimitMiddleware
{
    private readonly RequestDelegate _next;

    public AuditRateLimitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IAuditLogService auditLogService)
    {
        await _next(context);

        if (context.Response.StatusCode != StatusCodes.Status429TooManyRequests)
        {
            return;
        }

        if (!context.Request.Path.StartsWithSegments("/api/auth"))
        {
            return;
        }

        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = context.User.FindFirstValue(ClaimTypes.Email);

        await auditLogService.WriteAsync(
            AuditEventTypes.RateLimitViolation,
            userId: userId,
            email: email,
            reason: $"{context.Request.Method} {context.Request.Path}");
    }
}
