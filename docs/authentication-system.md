# Authentication System 技术文档

> 本文档描述 Mecca Web App 当前的认证系统，从 **Application Level**（应用层：前后端代码构成与交互逻辑）和 **System Level**（系统层：基础设施、存储、协议与安全机制）两个角度来介绍该系统的构成和工作流程。

---

## 1. 总览

Mecca Web App 采用 **Redis-backed server-side session + HttpOnly cookie** 的认证方案（此前为 JWT，已于近期重构替换），并在登录、注册等敏感端点接入 IP 维度的速率限制。身份模型基于 **ASP.NET Core Identity**，同时支持邮箱密码登录和 Google OAuth 外部登录。

**核心参与方：**

| 参与方 | 职责 |
| --- | --- |
| React Client | 渲染登录/注册 UI，维护前端认证上下文，携带 cookie 发起 API 请求 |
| ASP.NET Core API | 处理身份校验、会话创建/销毁、密码哈希、速率限制 |
| PostgreSQL | 持久化用户账户（由 EF Core + Identity 管理） |
| Redis | 存储序列化后的 `AuthenticationTicket`（会话主体） |
| Google OAuth | 外部身份提供方（可选） |

---

## 2. Application Level —— 应用层构成与流程

### 2.1 代码结构

**后端（[Mecca.API](Mecca.API/)）**

| 模块 | 路径 | 作用 |
| --- | --- | --- |
| 启动配置 | [Program.cs](Mecca.API/Program.cs) | Identity、Cookie、Redis、CORS、Rate Limit 注册 |
| 认证控制器 | [AuthController.cs](Mecca.API/Controllers/AuthController.cs) | `register` / `login` / `logout` / `me` / `check-email` |
| 会话存储 | [DistributedCacheTicketStore.cs](Mecca.API/Services/DistributedCacheTicketStore.cs) | 自定义 `ITicketStore`，把 ticket 写入 Redis |
| Google 登录 | [GoogleAuthService.cs](Mecca.API/Services/GoogleAuthService.cs) | 处理 Google 回调，查找或创建本地账户 |
| 用户模型 | [AppUser.cs](Mecca.API/Models/AppUser.cs) | 继承 `IdentityUser`，附加业务字段 |
| 请求 DTO | [LoginRequest.cs](Mecca.API/DTOs/LoginRequest.cs) / [RegisterRequest.cs](Mecca.API/DTOs/RegisterRequest.cs) | 输入校验 |
| 错误码 | [AuthErrorCodes.cs](Mecca.API/Contracts/AuthErrorCodes.cs) | 前后端共享的统一错误码 |

**前端（[client](client/)）**

| 模块 | 路径 | 作用 |
| --- | --- | --- |
| 认证上下文 | [AuthContext.tsx](client/src/context/AuthContext.tsx) | 全局 `authUser` 状态、`login` / `signOut`、应用启动时恢复会话 |
| API 封装 | [auth.ts](client/src/features/auth/api/auth.ts) | fetch 调用，统一 `credentials: "include"` 与 `AuthApiError` 处理 |
| 表单 Hook | [useAuthPanelForm.ts](client/src/features/auth/hooks/useAuthPanelForm.ts) | 多步表单（email check → login/register）状态机 |
| 客户端校验 | [validation.ts](client/src/utils/validation.ts) | 与服务端规则保持一致的前置校验 |
| 登录面板 | [AuthPanel.tsx](client/src/features/auth/components/AuthPanel.tsx) | UI 壳子 |

### 2.2 API 合约

所有端点挂在 `/api/auth` 下，响应格式统一 JSON，失败响应形如 `{ code, message, retryAfterSeconds? }`。

| 方法 & 路径 | 说明 | 受限 |
| --- | --- | --- |
| `POST /api/auth/register` | 注册并立刻登录，返回 `user` | 每 IP 10 次 / 小时 |
| `POST /api/auth/login` | 邮箱 + 密码登录，返回 `user` | 每 IP 5 次 / 15 分钟 |
| `POST /api/auth/logout` | 注销（销毁 session），返回 204 | —— |
| `GET /api/auth/me` | 获取当前登录用户，`[Authorize]` 保护 | —— |
| `GET /api/auth/check-email?email=` | 判断邮箱是否已注册，用于前端决定展示登录还是注册表单 | 每 IP 30 次 / 分钟 |
| Google OAuth | `AddGoogle` 集成，回调路径 `/api/signin-google` | —— |

成功响应固定形状：

```json
{ "user": { "firstName": "...", "lastName": "...", "email": "..." } }
```

### 2.3 密码策略

在 [Program.cs](Mecca.API/Program.cs) 的 `AddIdentity` 中声明：

- 最小长度 8
- 必须包含数字、大小写字母、特殊字符
- 邮箱必须唯一

额外规则：密码不允许包含空白字符（由 [AuthController.cs](Mecca.API/Controllers/AuthController.cs) 显式检查，映射到 `PASSWORD_CONTAINS_WHITESPACE`）。前端在 [validation.ts](client/src/utils/validation.ts) 中镜像同一套规则做即时提示，但服务端为最终权威。

### 2.4 前端状态管理

- `AuthProvider` 首次挂载时调用 `GET /api/auth/me` 尝试恢复会话；401 则置 `authUser = null`。
- `login(user)` 与 `signOut()` 仅更新 React 状态；cookie 的写入/清除完全由浏览器和后端接管，前端从不接触 session token。
- `fetch` 全部带上 `credentials: "include"`，让浏览器在跨域/同域下都发送 `mecca.sid` cookie。
- 速率限制响应中 `Retry-After` 会被解析为 `retryAfterSeconds`，封装进 `AuthApiError`，交由 UI 展示。

### 2.5 典型流程

**注册**
1. 用户在登录面板输入邮箱，前端先做格式校验，再向后端询问该邮箱是否已注册。
2. 后端返回“未注册”，前端切换到注册表单，让用户补全姓名、密码等信息。
3. 用户提交前，前端按照密码策略做一遍即时校验；通过后才发起注册请求。
4. 后端接收请求后会再次校验邮箱和密码规则（包括不允许包含空格），合法则创建账户，并对密码做哈希落库。
5. 注册成功后，后端直接为该用户建立一条会话，并通过响应下发会话 cookie；前端把返回的用户信息写入全局认证上下文，面板关闭，用户即进入已登录状态。

**登录**
1. 用户输入邮箱，前端询问后端邮箱是否存在；存在则进入密码输入步骤。
2. 前端提交邮箱 + 密码，后端查找用户并校验密码。
3. 校验通过后建立会话并下发 cookie；若邮箱不存在或密码错误，后端返回统一的“邮箱或密码错误”，避免暴露哪一项有误。

**已认证请求**
1. 前端任何需要身份的请求都会让浏览器自动附带会话 cookie。
2. 后端根据 cookie 里的会话 id 从会话存储取回该用户的身份信息，填充到当前请求上下文。
3. 带有授权要求的接口通过后继续执行；如果会话不存在或已过期，返回 401。
4. 活跃请求会顺带刷新会话的过期时间，让活跃用户保持登录。

**登出**
1. 前端调用登出接口。
2. 后端从会话存储中销毁该会话，并让响应清除浏览器中的会话 cookie。
3. 前端清空全局认证上下文，UI 回到未登录状态。

**应用启动时的状态恢复**
1. 页面加载后，前端会主动询问后端“当前是谁在登录”。
2. 若浏览器仍持有有效会话 cookie，后端返回当前用户；前端据此恢复已登录状态，无需用户重新输入。
3. 若会话已过期或不存在，前端保持未登录状态。

---

## 3. System Level —— 系统层构成

### 3.1 技术栈

| 层 | 选型 |
| --- | --- |
| 运行时 | .NET 9 |
| Web 框架 | ASP.NET Core MVC |
| ORM | EF Core 9 + Npgsql |
| 身份库 | ASP.NET Core Identity |
| 会话缓存 | Redis（`StackExchange.Redis` + `Microsoft.Extensions.Caching.StackExchangeRedis`） |
| 外部登录 | `Microsoft.AspNetCore.Authentication.Google` |
| 速率限制 | `AspNetCoreRateLimit` v5 |
| 前端 | React 19 + React Router 7 + Vite 8 |

### 3.2 会话存储设计

自定义 `DistributedCacheTicketStore`（见 [DistributedCacheTicketStore.cs](Mecca.API/Services/DistributedCacheTicketStore.cs)）实现 `ITicketStore`：

- 每个会话 key：`Guid.NewGuid().ToString("N")`
- Redis 实例前缀：`mecca:session:`，因此实际键名形如 `mecca:session:<guid>`
- Value：由 `TicketSerializer` 序列化的 `AuthenticationTicket`（含 ClaimsPrincipal、过期时间等）
- TTL：7 天；每次请求命中时由 `RenewAsync` 刷新 ⇒ 实现 sliding expiration
- `SignOutAsync` 通过 `RemoveAsync` 直接从 Redis 删除

这样的好处：
- Cookie 里只存随机会话 id，不含用户身份/权限数据 → 撤销即时生效
- 服务端可随时批量失效（例如 `FLUSHDB` 或按前缀清理）
- 多实例横向扩展时共享同一份会话状态

### 3.3 Cookie 配置

在 `ConfigureApplicationCookie`（见 [Program.cs](Mecca.API/Program.cs)）：

| 项 | 值 | 说明 |
| --- | --- | --- |
| `Name` | `mecca.sid` | 会话 cookie 名 |
| `HttpOnly` | `true` | 阻止 JS 读取，缓解 XSS 窃取 |
| `Secure` | `Always` | 仅通过 HTTPS 传输 |
| `SameSite` | `Lax` | 缓解 CSRF，同时允许顶级导航 |
| `ExpireTimeSpan` | 7 天 | 与 Redis TTL 对齐 |
| `SlidingExpiration` | `true` | 活跃用户持续续期 |
| `OnRedirectToLogin` / `OnRedirectToAccessDenied` | 改写为 401 / 403 | API 风格响应，避免 MVC 重定向页面 |

### 3.4 密码哈希

- 算法：ASP.NET Core Identity 默认的 PBKDF2（HMAC-SHA256，随机 salt，迭代次数由框架内置）
- 存储：`AspNetUsers.PasswordHash` 列（PostgreSQL）
- 验证：`SignInManager.CheckPasswordSignInAsync` 内部用 `IPasswordHasher` 做常量时间比较

### 3.5 速率限制

由 `AspNetCoreRateLimit` 以 IP 维度实现（规则见 [appsettings.json](Mecca.API/appsettings.json)）：

| 端点 | 限额 |
| --- | --- |
| `POST /api/auth/login` | 5 / 15 分钟 |
| `POST /api/auth/register` | 10 / 1 小时 |
| `GET /api/auth/check-email` | 30 / 1 分钟 |

- 真实 IP 从 `X-Forwarded-For` 读取（配合 `UseForwardedHeaders`）
- 超限返回 HTTP 429，响应体 `{ "code": "RATE_LIMITED", ... }`
- 计数器存储走同一份分布式缓存（Redis），因此多实例下限额全局一致

### 3.6 CORS 与传输安全

- `AddCors` 只放行 `ClientUrl` 一个来源，并启用 `AllowCredentials()` 以允许 cookie 跨域携带
- 生产环境启用 `UseHsts()` + `UseHttpsRedirection()`
- `UseForwardedHeaders` 处理反代场景下的 `X-Forwarded-For/Host/Proto`

### 3.7 Google OAuth 流程

1. 用户在前端点击 “Continue with Google”，浏览器被引导到 Google 授权页。
2. 用户在 Google 侧完成授权后被回调到后端。
3. 后端根据 Google 返回的身份信息查找是否已有绑定账户：有则直接复用；没有则用 Google 资料（邮箱、姓名）创建一个本地账户并与该 Google 身份做绑定。
4. 之后的会话建立过程与邮箱密码登录完全一致——同样写入会话存储，同样下发会话 cookie。
5. 后端把浏览器重定向回前端域名；前端检测到返回后，用“获取当前用户”的接口拉起用户信息，UI 进入已登录状态。

---

## 4. 端到端数据流图（文字版）

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

## 5. 安全特性清单

| 类别 | 机制 |
| --- | --- |
| 凭据机密性 | HttpOnly + Secure cookie；不向 JS 暴露 session id |
| CSRF | `SameSite=Lax`；API 仅接受 JSON 且 CORS 白名单 |
| 密码存储 | PBKDF2（Identity 默认），每用户独立 salt |
| 账户枚举 | 登录错误统一返回 `INVALID_CREDENTIALS`，不区分邮箱是否存在 |
| 暴力破解 | IP 维度速率限制（login / register / check-email） |
| 会话吊销 | 服务端 Redis 可即时删除，登出 / 密码变更场景可控 |
| 传输安全 | 生产环境强制 HTTPS + HSTS |
| 代理信任 | `UseForwardedHeaders` 仅启用必要的 X-Forwarded-* |

---

## 6. 相关提交历史

- `4deac2f` —— Replace JWT with redis-backed cookie sessions（引入 `DistributedCacheTicketStore`、移除 TokenService）
- `37896d0` —— Strengthen auth with redis-backed sessions and rate limiting（接入 `AspNetCoreRateLimit`、统一错误码、增强 CORS credentials）
