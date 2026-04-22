# Authentication System — Technical Overview

> This document describes the current authentication system of the Mecca Web App from two perspectives: **Application Level** (frontend/backend code layout and interaction logic) and **System Level** (infrastructure, storage, protocols, and security mechanisms).

---

## 1. Overview

Mecca Web App uses a **Redis-backed server-side session + HttpOnly cookie** authentication scheme (recently refactored from a JWT-based approach) with IP-based rate limiting on sensitive endpoints. The identity model is built on **ASP.NET Core Identity** and supports both email/password login and Google OAuth as an external provider.

**Participants:**

| Component | Responsibility |
| --- | --- |
| React Client | Renders login/register UI, maintains frontend auth context, sends API requests with cookies |
| ASP.NET Core API | Handles identity verification, session lifecycle, password hashing, rate limiting |
| PostgreSQL | Persists user accounts (managed by EF Core + Identity) |
| Redis | Stores serialized `AuthenticationTicket` objects (the session payload) |
| Google OAuth | External identity provider (optional) |

---

## 2. Application Level — Code Composition and Flows

### 2.1 Code Layout

**Backend ([Mecca.API](Mecca.API/))**

| Module | Path | Purpose |
| --- | --- | --- |
| Startup config | [Program.cs](Mecca.API/Program.cs) | Registers Identity, cookies, Redis, CORS, rate limiting |
| Auth controller | [AuthController.cs](Mecca.API/Controllers/AuthController.cs) | `register` / `login` / `logout` / `me` / `check-email` |
| Session store | [DistributedCacheTicketStore.cs](Mecca.API/Services/DistributedCacheTicketStore.cs) | Custom `ITicketStore` that writes tickets to Redis |
| Google login | [GoogleAuthService.cs](Mecca.API/Services/GoogleAuthService.cs) | Handles Google callback, finds or provisions local account |
| User model | [AppUser.cs](Mecca.API/Models/AppUser.cs) | Extends `IdentityUser` with business fields |
| Request DTOs | [LoginRequest.cs](Mecca.API/DTOs/LoginRequest.cs) / [RegisterRequest.cs](Mecca.API/DTOs/RegisterRequest.cs) | Input validation |
| Error codes | [AuthErrorCodes.cs](Mecca.API/Contracts/AuthErrorCodes.cs) | Shared error codes between backend and frontend |

**Frontend ([client](client/))**

| Module | Path | Purpose |
| --- | --- | --- |
| Auth context | [AuthContext.tsx](client/src/context/AuthContext.tsx) | Global `authUser` state, `login` / `signOut`, session restoration on app start |
| API wrappers | [auth.ts](client/src/features/auth/api/auth.ts) | fetch calls, unified `credentials: "include"` and `AuthApiError` handling |
| Form hook | [useAuthPanelForm.ts](client/src/features/auth/hooks/useAuthPanelForm.ts) | Multi-step form state machine (email check → login/register) |
| Client validation | [validation.ts](client/src/utils/validation.ts) | Mirrors server-side rules for immediate feedback |
| Auth panel | [AuthPanel.tsx](client/src/features/auth/components/AuthPanel.tsx) | UI shell |

### 2.2 API Contract

All endpoints live under `/api/auth` and return JSON. Error responses follow the shape `{ code, message, retryAfterSeconds? }`.

| Method & Path | Description | Rate Limit |
| --- | --- | --- |
| `POST /api/auth/register` | Creates a user, signs them in, returns `user` | 10 / hour per IP |
| `POST /api/auth/login` | Email + password login, returns `user` | 5 / 15 min per IP |
| `POST /api/auth/logout` | Destroys session, returns 204 | — |
| `GET /api/auth/me` | Returns the current user, guarded by `[Authorize]` | — |
| `GET /api/auth/check-email?email=` | Checks whether an email is registered, used by the client to decide between login and register UI | 30 / min per IP |
| Google OAuth | Integrated via `AddGoogle`, callback path `/api/signin-google` | — |

Successful response shape:

```json
{ "user": { "firstName": "...", "lastName": "...", "email": "..." } }
```

### 2.3 Password Policy

Declared in `AddIdentity` inside [Program.cs](Mecca.API/Program.cs):

- Minimum length 8
- Must contain a digit, upper and lower case letters, and a non-alphanumeric character
- Email must be unique

Additional rule: whitespace inside passwords is rejected explicitly in [AuthController.cs](Mecca.API/Controllers/AuthController.cs) and mapped to `PASSWORD_CONTAINS_WHITESPACE`. The frontend mirrors the same ruleset in [validation.ts](client/src/utils/validation.ts) for instant feedback, but the server is the source of truth.

### 2.4 Frontend State Management

- On first mount, `AuthProvider` calls `GET /api/auth/me` to restore a session. A 401 results in `authUser = null`.
- `login(user)` and `signOut()` only mutate React state; cookie writes/deletes are handled entirely by the browser and backend — the frontend never touches the session token.
- Every fetch call sets `credentials: "include"` so the browser attaches `mecca.sid` across same-origin and cross-origin requests.
- The `Retry-After` header on rate-limited responses is parsed into `retryAfterSeconds` on `AuthApiError`, letting the UI show a wait hint.

### 2.5 Representative Flows

**Registration**
1. The user enters their email in the auth panel. The client first checks the format locally, then asks the server whether the email is already registered.
2. The server reports the email is unused, so the UI switches to the registration form and asks for name, password, and other details.
3. Before submitting, the client runs the password policy checks for instant feedback; only a valid form is sent to the server.
4. The server re-validates the email and password rules (including the no-whitespace rule), then creates the account, storing the password as a hash.
5. On success the server immediately opens a session for the new user and returns the session cookie in the response. The client saves the returned user info into the global auth context, closes the panel, and the user is now logged in.

**Login**
1. The user enters an email; the client asks the server whether it exists. If so, the UI moves to the password step.
2. The client submits the email and password. The server looks up the user and verifies the password.
3. On success a session is created and a cookie is issued. On failure the server returns a generic "invalid email or password" message — it never reveals which one was wrong — to prevent account enumeration.

**Authenticated request**
1. Any request from the client that needs identity carries the session cookie automatically.
2. The server uses the session id in the cookie to fetch the corresponding identity from the session store and attach it to the current request.
3. Protected endpoints proceed if identity is present; otherwise they return 401.
4. An active request also refreshes the session's expiration so that active users stay signed in.

**Logout**
1. The client calls the logout endpoint.
2. The server destroys the session in the session store and instructs the browser to clear the session cookie.
3. The client clears the global auth context, and the UI returns to its logged-out state.

**Session restoration on app start**
1. When the page loads, the client asks the server "who is currently signed in?".
2. If the browser still has a valid session cookie, the server returns the current user and the client restores the logged-in state without any input from the user.
3. If the session is missing or expired, the client stays logged out.

---

## 3. System Level — Infrastructure and Protocols

### 3.1 Tech Stack

| Layer | Choice |
| --- | --- |
| Runtime | .NET 9 |
| Web framework | ASP.NET Core MVC |
| ORM | EF Core 9 + Npgsql |
| Identity library | ASP.NET Core Identity |
| Session cache | Redis (`StackExchange.Redis` + `Microsoft.Extensions.Caching.StackExchangeRedis`) |
| External login | `Microsoft.AspNetCore.Authentication.Google` |
| Rate limiting | `AspNetCoreRateLimit` v5 |
| Frontend | React 19 + React Router 7 + Vite 8 |

### 3.2 Session Store Design

The custom `DistributedCacheTicketStore` (see [DistributedCacheTicketStore.cs](Mecca.API/Services/DistributedCacheTicketStore.cs)) implements `ITicketStore`:

- Session key: `Guid.NewGuid().ToString("N")`
- Redis instance prefix: `mecca:session:`, so the full key looks like `mecca:session:<guid>`
- Value: `AuthenticationTicket` (ClaimsPrincipal, expiry, etc.) serialized via `TicketSerializer`
- TTL: 7 days, refreshed on each hit by `RenewAsync` → sliding expiration
- `SignOutAsync` deletes the ticket directly via `RemoveAsync`

Benefits of this design:
- The cookie carries only a random session id — no identity or claims data is exposed to the client
- Revocation is immediate (delete the Redis key)
- Multiple API instances can scale horizontally while sharing session state

### 3.3 Cookie Configuration

Set in `ConfigureApplicationCookie` (see [Program.cs](Mecca.API/Program.cs)):

| Field | Value | Purpose |
| --- | --- | --- |
| `Name` | `mecca.sid` | Session cookie name |
| `HttpOnly` | `true` | Blocks JS access, mitigates XSS token theft |
| `Secure` | `Always` | HTTPS only |
| `SameSite` | `Lax` | Mitigates CSRF while still allowing top-level navigation |
| `ExpireTimeSpan` | 7 days | Matches Redis TTL |
| `SlidingExpiration` | `true` | Active users stay signed in |
| `OnRedirectToLogin` / `OnRedirectToAccessDenied` | Rewritten to 401 / 403 | API-style responses, no MVC redirects |

### 3.4 Password Hashing

- Algorithm: ASP.NET Core Identity's default PBKDF2 (HMAC-SHA256, random salt, framework-defined iteration count)
- Storage: `AspNetUsers.PasswordHash` column in PostgreSQL
- Verification: `SignInManager.CheckPasswordSignInAsync` delegates to `IPasswordHasher` with constant-time comparison

### 3.5 Rate Limiting

Implemented by `AspNetCoreRateLimit` on an IP basis (rules in [appsettings.json](Mecca.API/appsettings.json)):

| Endpoint | Limit |
| --- | --- |
| `POST /api/auth/login` | 5 / 15 minutes |
| `POST /api/auth/register` | 10 / 1 hour |
| `GET /api/auth/check-email` | 30 / 1 minute |

- Real client IP is read from `X-Forwarded-For` (paired with `UseForwardedHeaders`)
- Exceeding the limit yields HTTP 429 with body `{ "code": "RATE_LIMITED", ... }`
- Counters live in the same distributed cache (Redis), so limits stay globally consistent across instances

### 3.6 CORS and Transport Security

- `AddCors` whitelists a single origin (`ClientUrl`) and calls `AllowCredentials()` so cookies are allowed across origins
- `UseHsts()` and `UseHttpsRedirection()` are enabled in production
- `UseForwardedHeaders` handles `X-Forwarded-For/Host/Proto` behind reverse proxies

### 3.7 Google OAuth Flow

1. The user clicks "Continue with Google" in the UI, and the browser is redirected to Google's consent screen.
2. After the user authorizes on Google's side, the browser is redirected back to the backend.
3. The backend uses the identity info returned by Google to look up an existing bound account. If one exists, it is reused; if not, a new local account is provisioned from the Google profile (email, name) and linked to that Google identity.
4. From here the session creation is identical to email/password login — the same session store is written and the same session cookie is issued.
5. The backend redirects the browser back to the frontend. The client then calls "get current user" to hydrate its auth state and the UI enters the logged-in state.

---

## 4. End-to-End Data Flow (ASCII)

```
┌──────────┐        ┌──────────────────┐         ┌──────────────┐
│ Browser  │        │ ASP.NET Core API │         │    Redis     │
│          │        │                  │         │ mecca:session│
└────┬─────┘        └────────┬─────────┘         └──────┬───────┘
     │ POST /login (email,pw)│                          │
     ├──────────────────────▶│                          │
     │                       │ FindByEmail / CheckPw    │
     │                       │ (PostgreSQL)             │
     │                       │ SignInAsync              │
     │                       ├──────────── SET ticket ─▶│
     │   Set-Cookie: mecca.sid=<guid>  (HttpOnly,Secure)│
     │◀──────────────────────┤                          │
     │                       │                          │
     │ GET /me  (Cookie)     │                          │
     ├──────────────────────▶│ RetrieveAsync(guid) ────▶│
     │                       │◀──── AuthenticationTicket│
     │   200 { user }        │ [Authorize] OK           │
     │◀──────────────────────┤                          │
     │                       │                          │
     │ POST /logout (Cookie) │                          │
     ├──────────────────────▶│ RemoveAsync(guid) ──────▶│
     │   Set-Cookie: ...=; Max-Age=0                    │
     │◀──────────────────────┤                          │
```

---

## 5. Security Checklist

| Category | Mechanism |
| --- | --- |
| Credential confidentiality | HttpOnly + Secure cookie; session id never exposed to JS |
| CSRF | `SameSite=Lax`; API accepts JSON only with a CORS allowlist |
| Password storage | PBKDF2 (Identity default) with a per-user salt |
| Account enumeration | Login errors return a uniform `INVALID_CREDENTIALS`, never revealing whether the email exists |
| Brute force | IP-based rate limiting on login / register / check-email |
| Session revocation | Server-side Redis allows immediate deletion on logout or password change |
| Transport | HTTPS enforced in production, HSTS enabled |
| Proxy trust | `UseForwardedHeaders` only enables the required `X-Forwarded-*` headers |

---

## 6. Relevant Commits

- `4deac2f` — Replace JWT with redis-backed cookie sessions (introduced `DistributedCacheTicketStore`, removed `TokenService`)
- `37896d0` — Strengthen auth with redis-backed sessions and rate limiting (wired up `AspNetCoreRateLimit`, unified error codes, expanded CORS credentials)
