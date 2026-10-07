# Ziptrrip Tech Assessment: Full-Stack Task Management System

**Candidate:** Monika R T  
**Target Role:** Backend Engineer / Full-Stack Engineer  
**Tech Stack:** TypeScript, Node.js (Express), SQLite (`better-sqlite3`), React, Tailwind CSS, Jest, Supertest

---

## Overview & Technical Highlights

This repository contains an enterprise-grade, scalable **Full-Stack Task Management Application** engineered specifically for the **Ziptrrip Tech Assessment**.

Built to professional production standards, it features:
* **TypeScript End-to-End:** Strict type safety across backend and frontend models, DTOs, and API clients.
* **Persistent Embedded Database:** Zero-config SQLite database with Write-Ahead Logging (WAL) mode and B-Tree indexing on `status`, `priority`, and `category`.
* **RESTful API with Layered Architecture:** Strict separation of concerns across Controllers, Services, Models, Routes, and Middlewares.
* **Multi-Page Application (MPA) Routing:**
  * **Task List Page:** Live search, status tabs (`PENDING`, `IN_PROGRESS`, `COMPLETED`), priority filtering, metrics summary dashboard, inline status toggle, and task deletion.
  * **Task Detail Page (`?id=...`):** Full task inspection, detail edit form, category tagging, due date assignment, and audit timestamps.
* **Automated Integration Tests:** Jest + Supertest test suite verifying endpoints, Zod schema validation, and boundary conditions.
* **API Testing Specification:** Postman Collection (`ziptrrip_todos_postman.json`) and VS Code REST Client specification (`requests.http`).

---

## Repository Structure

```
ziptrrip-todo-app/
├── backend/
│   ├── src/
│   │   ├── controllers/            # Request handling & HTTP status responses
│   │   ├── services/               # Database operations & business logic
│   │   ├── db/                     # SQLite database init & schema indexing
│   │   ├── middlewares/            # Zod validation & central error handler
│   │   ├── routes/                 # REST endpoint routing
   │   ├── types/                  # TypeScript interfaces & DTOs
│   │   ├── validators/             # Zod validation schemas
│   │   ├── __tests__/              # Jest & Supertest integration tests
│   │   ├── app.ts                  # Express app pipeline
│   │   └── server.ts               # Server bootstrap & listener
│   ├── requests.http               # VS Code REST client
│   ├── ziptrrip_todos_postman.json # Exported Postman Collection
│   ├── jest.config.js              # Jest configuration
│   ├── tsconfig.json               # Backend TypeScript config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                    # API client layer
│   │   ├── components/             # Reusable UI components & modals
│   │   ├── pages/                  # Multi-Page views (List & Detail ?id=...)
│   │   ├── types/                  # Shared frontend TypeScript types
│   │   ├── App.tsx                 # MPA Query Parameter Router
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── API_DOCUMENTATION.md            # Detailed REST API specification
├── ARCHITECTURE.md                 # Technical architecture & design decisions
└── README.md                       # Main setup & execution guide
```

---

## Quick Start Guide

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

---

### 1. Backend Setup & Startup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

* **Backend Server:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/health`
* **Database:** SQLite database `todos.db` is auto-created with tables and indexes upon launch.

---

### 2. Run Automated Unit Tests

```bash
# Inside backend directory
npm test
```

Executes the **Jest + Supertest** suite verifying CRUD operations, Zod validation handling, and filter queries.

---

### 3. Frontend Setup & Startup

```bash
# Navigate to frontend directory in a new terminal
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

* **Frontend Application:** `http://localhost:3000`

---

## Features & Assessment Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Multi-Page Application (MPA)** | Page 1 for Task List, Page 2 for single Task receiving `?id=...` parameter | Complete |
| **Backend REST CRUD APIs** | Full CRUD + status toggle + filtering in Node.js / Express | Complete |
| **Database Integration** | SQLite with WAL mode and B-Tree indexing | Complete |
| **TypeScript Usage** | 100% strict TypeScript in both Backend & Frontend | Complete |
| **Unit & Integration Tests** | Jest + Supertest covering endpoints & edge cases | Complete |
| **Postman / REST Client** | Postman JSON collection + `requests.http` included | Complete |
| **Comprehensive Documentation** | `README.md`, `API_DOCUMENTATION.md`, `ARCHITECTURE.md` | Complete |

---

## REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server status & uptime health check |
| `GET` | `/api/todos` | List all tasks with search, status, & priority filters |
| `GET` | `/api/todos/:id` | Fetch single task by ID |
| `POST` | `/api/todos` | Create a new task with Zod validation |
| `PUT` | `/api/todos/:id` | Update task title, description, priority, category, or status |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completion status |
| `DELETE` | `/api/todos/:id` | Delete task by ID |

*See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full request/response schemas and examples.*
