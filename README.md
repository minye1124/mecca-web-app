# Mecca Web App
A full stack clone of Mecca beauty e-commerce website built with React, ASP.NET Core, and PostgreSQL.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, CSS Modules
- **Backend:** ASP.NET Core Web API, Entity Framework Core, ASP.NET Core Identity
- **Database:** PostgreSQL (Docker)
- **Authentication:** JWT, Google OAuth

## Prerequisites

- Node.js
- .NET 9 SDK
- Docker Desktop

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/minye1124/mecca-web-app.git
cd mecca-web-app
```

### 2. Start the database

```bash
docker run --name mecca-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 3. Configure backend secrets

```bash
cd Mecca.API
dotnet user-secrets set "Google:ClientId" ""
dotnet user-secrets set "Google:ClientSecret" ""
dotnet user-secrets set "Jwt:Key" ""
```

To get Google OAuth credentials, create a project at https://console.cloud.google.com/ and set up an OAuth 2.0 Client ID with redirect URI: `http://localhost:5238/signin-google`

### 4. Run database migrations

```bash
cd Mecca.API
dotnet ef database update
```

### 5. Start the backend

```bash
cd Mecca.API
dotnet run
```

Backend runs at http://localhost:5238

### 6. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## API Endpoints

- `GET /api/auth/check-email?email={email}` - Check if email is registered
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/google-login` - Initiate Google OAuth login
