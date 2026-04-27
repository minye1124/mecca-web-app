using Microsoft.AspNetCore.Antiforgery;

namespace Mecca.API.Middleware;

public class AntiforgeryValidationMiddleware
{
    private readonly RequestDelegate _next;

    public AntiforgeryValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IAntiforgery antiforgery)
    {
        if (IsSafeMethod(context.Request.Method) || IsCsrfTokenEndpoint(context.Request.Path))
        {
            await _next(context);
            return;
        }

        try
        {
            await antiforgery.ValidateRequestAsync(context);
            await _next(context);
        }
        catch (AntiforgeryValidationException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                code = "CSRF_INVALID",
                message = "Missing or invalid CSRF token."
            });
        }
    }

    private static bool IsSafeMethod(string method)
    {
        return HttpMethods.IsGet(method)
            || HttpMethods.IsHead(method)
            || HttpMethods.IsOptions(method)
            || HttpMethods.IsTrace(method);
    }

    private static bool IsCsrfTokenEndpoint(PathString path)
    {
        return path.StartsWithSegments("/api/auth/csrf-token");
    }
}
