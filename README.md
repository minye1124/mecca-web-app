# Mecca Web App
A full stack clone of Mecca beauty e-commerce website built with React, ASP.NET Core, and PostgreSQL.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, CSS Modules
- **Backend:** ASP.NET Core Web API, Entity Framework Core, ASP.NET Core Identity
- **Data & Cache:** PostgreSQL, Redis
- **Authentication:** ASP.NET Core Identity cookie auth, Google OAuth

## Prerequisites

- Node.js
- .NET 9 SDK
- Docker Desktop
- `dotnet-ef` CLI tool

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/minye1124/mecca-web-app.git
cd mecca-web-app
```

### 2. Install the EF Core CLI if needed

```bash
dotnet tool install --global dotnet-ef
```

### 3. Start PostgreSQL

```bash
docker run --name mecca-db -e POSTGRES_DB=mecca -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 4. Start Redis

```bash
docker run --name mecca-redis -p 6379:6379 -d redis
```

### 5. Configure backend secrets

```bash
cd Mecca.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=mecca;Username=postgres;Password=postgres"
dotnet user-secrets set "ConnectionStrings:Redis" "localhost:6379"
dotnet user-secrets set "SendGrid:ApiKey" ""
dotnet user-secrets set "SendGrid:FromEmail" ""
dotnet user-secrets set "SendGrid:FromName" ""
dotnet user-secrets set "Google:ClientId" ""
dotnet user-secrets set "Google:ClientSecret" ""
```

Notes:

- `SendGrid:*` is required for registration and email confirmation flows
- `Google:*` is only required if you want Google sign-in
- The app uses cookie-based authentication, and Redis stores server-side session tickets, so Redis must be running for login sessions

To get Google OAuth credentials, create a project at https://console.cloud.google.com/ and set up an OAuth 2.0 Client ID with redirect URI: `https://local.mecca.test/api/signin-google`.

### 6. Run database migrations

```bash
cd Mecca.API
dotnet ef database update
```

### 7. Start the backend

```bash
cd Mecca.API
dotnet run
```

Backend runs at http://localhost:5238

### 8. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at http://localhost:5173. No frontend env vars are required for local development; Vite proxies `/api` to the backend.

### 9. Optional local HTTPS proxy with Nginx

If you want to access the app locally through `https://local.mecca.test`, use the project Nginx config in [`deploy/nginx/nginx.conf`](./deploy/nginx/nginx.conf).

Requirements:

- Add `127.0.0.1 local.mecca.test` to your hosts file
- Put local certificates in `D:/projects/mecca-web-app/.local/certs/`
- Keep the frontend dev server running on `http://localhost:5173`
- Keep the backend running on `http://localhost:5238`

Validate the config:

```powershell
& "C:\Users\iris\AppData\Local\Microsoft\WinGet\Packages\nginxinc.nginx_Microsoft.Winget.Source_8wekyb3d8bbwe\nginx-1.29.8\nginx.exe" -p "D:\projects\mecca-web-app\deploy\nginx\" -t -c "nginx.conf"
```

Start Nginx:

```powershell
& "C:\Users\iris\AppData\Local\Microsoft\WinGet\Packages\nginxinc.nginx_Microsoft.Winget.Source_8wekyb3d8bbwe\nginx-1.29.8\nginx.exe" -p "D:\projects\mecca-web-app\deploy\nginx\" -c "nginx.conf"
```

Reload Nginx after config changes:

```powershell
& "C:\Users\iris\AppData\Local\Microsoft\WinGet\Packages\nginxinc.nginx_Microsoft.Winget.Source_8wekyb3d8bbwe\nginx-1.29.8\nginx.exe" -p "D:\projects\mecca-web-app\deploy\nginx\" -s reload -c "nginx.conf"
```

When Nginx is running, open the app at `https://local.mecca.test`.

## API Endpoints

- `GET /api/auth/check-email?email={email}` - Check if email is registered
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/confirm-email` - Confirm a user's email address
- `POST /api/auth/resend-confirmation-email` - Resend the confirmation email
- `POST /api/auth/login` - Login and establish a cookie-backed session
- `GET /api/auth/google-login` - Initiate Google OAuth login
- `POST /api/auth/logout` - Sign out the current user
- `GET /api/auth/me` - Get the current signed-in user
