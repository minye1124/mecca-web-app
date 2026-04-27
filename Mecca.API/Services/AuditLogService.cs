using Mecca.API.Data;
using Mecca.API.Models;

namespace Mecca.API.Services;

public interface IAuditLogService
{
    Task WriteAsync(
        string eventType,
        string? userId = null,
        string? email = null,
        string? reason = null,
        string? path = null,
        CancellationToken cancellationToken = default);
}

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AuditLogService> _logger;

    public AuditLogService( AppDbContext dbContext, IHttpContextAccessor httpContextAccessor, ILogger<AuditLogService> logger)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task WriteAsync(
        string eventType,
        string? userId = null,
        string? email = null,
        string? reason = null,
        string? path = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var httpContext = _httpContextAccessor.HttpContext;

            var ipAddress = httpContext?.Connection.RemoteIpAddress?.ToString();
            var userAgent = httpContext?.Request.Headers["User-Agent"].ToString();
            var requestPath = path ?? httpContext?.Request.Path.Value;

            var log = new AuditLog
            {
                EventType = Limit(eventType, 64)!,
                UserId = Limit(userId, 450),
                Email = NormalizeEmail(email),
                IpAddress = Limit(ipAddress, 45),
                UserAgent = Limit(userAgent, 512),
                Path = Limit(requestPath, 256),
                Reason = Limit(reason, 256),
                OccurredAtUtc = DateTime.UtcNow
            };

            _dbContext.AuditLogs.Add(log);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to write audit log for {EventType}", eventType);
        }
    }

    private static string? NormalizeEmail(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return value.Trim().ToLowerInvariant();
    }

    private static string? Limit(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var trimmed = value.Trim();
        return trimmed.Length <= maxLength ? trimmed : trimmed[..maxLength];
    }
}
