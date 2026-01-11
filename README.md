# 🚀 ThrottleX: Engineering Specification

### **API Key Management & Intelligent Rate Limiting Platform**

> “ThrottleX gives developers full control over API keys, usage tracking, and rate limits — built with production-grade middleware and test-driven development.”

---

## 1️⃣ Project Summary

### 🔹 What ThrottleX Does

ThrottleX is a SaaS-grade backend platform that allows developers to:

- **Create users** with unique ownership models.
- **Issue and manage API keys** (Secure generation, activation/deactivation).
- **Assign custom rate limits** per key (e.g., 100 requests per hour).
- **Track request usage** in real-time.
- **Enforce limits via Middleware**, automatically blocking abusive or over-limit requests.

## 2️⃣ High-Level System Architecture

The system ensures all enforcement happens **before** business logic, mirroring production environments like Stripe or AWS.

**Request Flow:**
`Client` → `API Key Auth Middleware` → `Rate Limiting Middleware` → `Route Controller` → `Database (Prisma)`

---

## 3️⃣ Core Features

| Feature                  | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| **User Management**      | Clean ownership model where users can own multiple keys.                       |
| **Key Lifecycle**        | Secure generation, status toggling (enable/disable), and custom limit config.  |
| **Rate Limiting Engine** | Tracks requests per key and automatically resets windows (Returning HTTP 429). |
| **Middleware Design**    | Highly reusable, decoupled logic for authentication and enforcement.           |
| **TDD Discipline**       | Unit tests for pure logic and integration tests for full API flows.            |

---

## 4️⃣ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL (Production), SQLite (Testing)
- **Testing:** Jest, Supertest, ts-jest

---

## 5️⃣ Final Project Structure

```text
throttlex/
│
├── prisma/
│ ├── schema.prisma
│ └── migrations/
│
├── src/
│ ├── app.ts # Express app configuration
│ ├── server.ts # HTTP server bootstrap
│
│ ├── config/
│ │ ├── env.ts # Environment variables
│ │ └── prisma.ts # Prisma client setup
│
│ ├── modules/
│ │ ├── user/
│ │ │ ├── user.controller.ts
│ │ │ ├── user.service.ts
│ │ │ └── user.routes.ts
│ │ │
│ │ ├── apiKey/
│ │ │ ├── apiKey.controller.ts
│ │ │ ├── apiKey.service.ts
│ │ │ └── apiKey.routes.ts
│ │ │
│ │ └── usage/
│ │ ├── usage.service.ts
│ │ └── usage.types.ts
│
│ ├── middleware/
│ │ ├── apiKeyAuth.middleware.ts
│ │ └── rateLimiter.middleware.ts
│
│ ├── routes.ts # Global route registry
│ └── utils/
│ ├── generateApiKey.ts
│ └── time.ts
│
├── tests/
│ ├── unit/
│ │ ├── apiKey.service.test.ts
│ │ ├── rateLimiter.logic.test.ts
│ │ └── time.window.test.ts
│ │
│ └── integration/
│ ├── user.routes.test.ts
│ ├── apiKey.routes.test.ts
│ └── rateLimiter.middleware.test.ts
│
├── .env
├── jest.config.ts
├── tsconfig.json
├── package.json
└── README.md


```

---

## 6️⃣ Database Design (Conceptual)

- **User:** `id`, `email (unique)`, `createdAt`
- **ApiKey:** `id`, `key (unique)`, `userId`, `isActive`, `rateLimit`, `windowSeconds`
- **ApiUsage:** `id`, `apiKeyId`, `requestCount`, `windowStart`

---

## 7️⃣ API Capabilities

### **Create User**

`POST /users`

- **Input:** `{ "email": "dev@example.com" }`
- **Output:** `{ "id": "uuid", "email": "dev@example.com" }`

### **Generate API Key**

`POST /api-keys`

- **Input:** `{ "userId": "uuid", "rateLimit": 100, "windowSeconds": 3600 }`
- **Output:** `{ "apiKey": "tx_live_xxx", "rateLimit": 100 }`

### **Rate-Limited Route**

`GET /protected/data`

- **Header:** `x-api-key: tx_live_xxx`
- **Success (200):** `{ "message": "Request successful" }`
- **Failure (429):** `{ "error": "Rate limit exceeded" }`

---

## 8️⃣ Middleware Logic

1. **🔐 API Key Authentication:** Extracts key from header, validates existence/status, and attaches metadata to the request context.
2. **⏱ Rate Limiter:** Locates the current usage window. If the window has expired, it resets; if the count exceeds the limit, it blocks the request.

---

## 9️⃣ TDD Roadmap

- **Phase 0:** Setup TypeScript, Jest, and a separate test database.
- **Phase 1 (Unit):** Write tests for API key formatting and time-window expiration logic (No DB).
- **Phase 2 (Database):** Test Prisma persistence for users and keys.
- **Phase 3 (Middleware):** Test 401 (Invalid key), 403 (Inactive), and 429 (Over limit) scenarios.
- **Phase 4 (Integration):** Full flow: Create User → Create Key → Access Route → Hit Limit.
- **Phase 5 (Hardening):** Handle edge cases, race conditions, and clean error reporting.

---

## 🔟 Future Extensions

- **Redis Integration:** Move rate-limiting to memory for high-throughput scaling.
- **Usage Dashboards:** Visual analytics for key performance.
- **Tiered Plans:** Automated limit increases based on user subscription levels.

---

### Few things to consider when reading this

README and the whole idea was generated by AI so I can plan out easily and build that idea.
