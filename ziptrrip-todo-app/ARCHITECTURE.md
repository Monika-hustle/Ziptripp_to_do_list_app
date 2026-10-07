# Architecture & Engineering Design Decisions

This document outlines the architectural patterns, database optimizations, error-handling pipeline, and testing strategies applied in the **Ziptrrip Todo Application**.

---

## 1. Architectural Pattern: Layered MVC (Separation of Concerns)

To adhere to clean enterprise design principles, the backend is strictly decoupled into distinct functional layers:

```
                  ┌────────────────────────────────────────┐
                  │          Client / Frontend             │
                  └──────────────────┬─────────────────────┘
                                     │ HTTP (REST)
                                     ▼
                  ┌────────────────────────────────────────┐
                  │       Express Router & Routes          │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │    Validation Middleware (Zod Schemas) │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │              Controllers               │
                  │   (Request extraction, Status codes)   │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │            Services Layer              │
                  │   (Business Logic & Query Assembly)    │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │     Database Access (better-sqlite3)   │
                  └────────────────────────────────────────┘
```

### Layer Responsibilities:
1. **Routes (`/src/routes`):** Define URI paths, HTTP methods, and attach route-specific validation middleware.
2. **Validation Middleware (`/src/middlewares/validate.middleware.ts`):** Validates and sanitizes incoming request payloads against strict Zod schemas before touching business logic.
3. **Controllers (`/src/controllers`):** Handle HTTP transport concerns, extract query/body parameters, and return structured JSON with appropriate HTTP status codes (`200`, `201`, `400`, `404`, `500`).
4. **Services (`/src/services`):** Pure TypeScript business logic containing data transformation and prepared SQL execution.
5. **Database (`/src/db`):** Persistent, fast SQLite storage using `better-sqlite3` with Write-Ahead Logging (WAL) enabled.

---

## 2. Database Schema & Indexing Optimization

### Schema Structure:
```sql
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
  status TEXT CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
  category TEXT DEFAULT 'General',
  due_date TEXT,
  is_completed INTEGER DEFAULT 0 CHECK(is_completed IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### B-Tree Indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);
```

* **Why B-Tree Indexes:** Accelerates multi-parameter filtering queries (e.g. `status = 'PENDING' AND priority = 'HIGH'`) from $O(N)$ full table scans down to $O(\log N)$ logarithmic tree lookups.
* **WAL Mode (`journal_mode = WAL`):** Enables non-blocking concurrent reads while writes are being processed.

---

## 3. Global Error Handling Middleware

Express error management is centralized using the standard 4-argument signature `(err, req, res, next)` placed at the bottom of the middleware chain:

```typescript
export const errorHandler = (err: CustomAppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

---

## 4. Multi-Page Application (MPA) Routing Strategy

As required by the assessment:
* **Page 1 (`TodoListPage`):** Renders the global list with live filtering, metrics, and search.
* **Page 2 (`TodoDetailPage`):** Receives the `?id=...` query parameter (e.g. `http://localhost:3000/?id=1`), fetching and displaying the exact todo record with its audit timestamps and deep metadata.
* Browser navigation (`window.history.pushState` and `popstate`) is synced so deep-links directly resolve to the requested todo.

---

## 5. Automated Testing Strategy (Jest & Supertest)

Unit and integration tests are decoupled from network sockets:
- The Express `app` is exported independently from `server.ts`.
- `supertest` exercises real HTTP requests directly against `app`, testing:
  - Input validation edge cases
  - 400 Bad Request responses
  - 404 Not Found handling
  - Full CRUD lifecycle (Create $\rightarrow$ Read $\rightarrow$ Update $\rightarrow$ Toggle $\rightarrow$ Delete).
