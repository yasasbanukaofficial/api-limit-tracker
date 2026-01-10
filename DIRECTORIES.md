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
