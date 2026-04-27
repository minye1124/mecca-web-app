namespace Mecca.API.Models;

public class AuditLog
{
    public long Id { get; set; }
    public string EventType { get; set; } = "";
    public string? UserId { get; set; }
    public string? Email { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Path { get; set; }
    public string? Reason { get; set; }
    public DateTime OccurredAtUtc { get; set; }
}
