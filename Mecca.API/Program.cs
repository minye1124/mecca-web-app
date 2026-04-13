using System.Runtime.InteropServices;
using Mecca.API.Data;
using Mecca.API.Models;
using Mecca.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add MVC Controller, db context, identity and other services.
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication().AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Google:ClientSecret"]!;
    options.CallbackPath = "/api/signin-google";
});

builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<GoogleAuthService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["ClientUrl"]!)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

var forwardedHeaderOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor // client IP
        | ForwardedHeaders.XForwardedHost // http or https
        | ForwardedHeaders.XForwardedProto // host name
};

forwardedHeaderOptions.KnownNetworks.Clear(); // Clear the default known networks to allow forwarding from any network
forwardedHeaderOptions.KnownProxies.Clear(); // Clear the default known proxies to allow forwarding

app.UseForwardedHeaders(forwardedHeaderOptions);
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { } 
