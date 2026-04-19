using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Distributed;

namespace Mecca.API.Services;

public class DistributedCacheTicketStore : ITicketStore
{
    private readonly IDistributedCache _cache;
    private readonly TimeSpan _expiration = TimeSpan.FromDays(7);
    private const string KeyPrefix = "";
    private static readonly TicketSerializer _ticketSerializer = TicketSerializer.Default;

    private static string CreateCacheKey()
    {
        return KeyPrefix + Guid.NewGuid().ToString("N");
    }

    private DistributedCacheEntryOptions CreateCacheOptions(AuthenticationTicket ticket)
    {
        var options = new DistributedCacheEntryOptions();
        if (ticket.Properties.ExpiresUtc.HasValue)
        {
            options.AbsoluteExpiration = ticket.Properties.ExpiresUtc;
        }
        else
        {
            options.AbsoluteExpirationRelativeToNow = _expiration;
        }

        return options;
    }

    public DistributedCacheTicketStore(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<string> StoreAsync(AuthenticationTicket ticket)
    {
        var key = CreateCacheKey();
        var options = CreateCacheOptions(ticket);
        var data = _ticketSerializer.Serialize(ticket);
        await _cache.SetAsync(key, data, options);
        return key;
    }

    public async Task RenewAsync(string key, AuthenticationTicket ticket)
    {
        var options = CreateCacheOptions(ticket);
        var data = _ticketSerializer.Serialize(ticket);
        await _cache.SetAsync(key, data, options);
    }

    public async Task<AuthenticationTicket?> RetrieveAsync(string key)
    {
        var data = await _cache.GetAsync(key);
        if (data == null)
        {
            return null;
        }

        return _ticketSerializer.Deserialize(data);
    }

    public Task RemoveAsync(string key)
    {
        return _cache.RemoveAsync(key);
    }
}